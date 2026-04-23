import { lazy, type MouseEvent, Suspense, useMemo, useState } from 'react';
import Loading from '@/components/Loading';
import {
  useGetEffectData,
  useGetItemTypesData,
  useSearchItems,
} from '@/queries/search.query';
import type {
  Operator,
  SearchPayload,
  SearchStatPayload,
} from '@/types/search.type';

const CardItem = lazy(() => import('./CardItem'));

type StatLine = {
  id: number;
  statName: string;
  op: Operator;
  value: number;
};

const SPECIAL_CRYSTA_LINKS: Record<number, number> = {
  21: 210,
  23: 230,
  24: 240,
  22: 220,
  20: 200,
};
const DEFAULT_PAGE_SIZE = 10;

function prettyJoin(items: string[]) {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

export default function CorynClub() {
  const { data: effectData, isPending: isFetchingEffect } = useGetEffectData();
  const { data: itemTypesData, isPending: isFetchingItemTypes } =
    useGetItemTypesData();

  const [searchPayload, setSearchPayload] = useState<SearchPayload | null>(
    null,
  );
  const { data: searchResults, isPending: isSearching } =
    useSearchItems(searchPayload);

  const itemTypesList = useMemo(
    () => Object.entries(itemTypesData ?? {}),
    [itemTypesData],
  );
  const statChoices = useMemo(
    () => Object.keys(effectData ?? {}),
    [effectData],
  );

  const [selectedTypes, setSelectedTypes] = useState<number[]>([-1]);
  const [statLines, setStatLines] = useState<StatLine[]>([]);
  const [nextId, setNextId] = useState(0);
  const [name, setName] = useState<string>('');

  const reverseItemTypes = useMemo(
    () =>
      Object.fromEntries(itemTypesList.map(([name, value]) => [value, name])),
    [itemTypesList],
  );

  const selectedTypeText = useMemo(
    () =>
      prettyJoin(selectedTypes.map((v) => reverseItemTypes[v]).filter(Boolean)),
    [reverseItemTypes, selectedTypes],
  );

  const addStatLine = () => {
    setStatLines((prev) => [
      ...prev,
      { id: nextId, statName: '', op: '>=', value: 0 },
    ]);
    setNextId((v) => v + 1);
  };

  const removeStatLine = (id: number) => {
    setStatLines((prev) => prev.filter((line) => line.id !== id));
  };

  const updateStatLine = (
    id: number,
    patch: Partial<Pick<StatLine, 'statName' | 'op' | 'value'>>,
  ) => {
    setStatLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  };

  const toggleItemType = (value: number, checked: boolean) => {
    setSelectedTypes((prev) => {
      let next = checked ? [...prev, value] : prev.filter((v) => v !== value);

      const linkedEnhancer = SPECIAL_CRYSTA_LINKS[value];
      if (linkedEnhancer) {
        if (checked && !next.includes(linkedEnhancer))
          next.push(linkedEnhancer);
        if (!checked) next = next.filter((v) => v !== linkedEnhancer);
      }

      return Array.from(new Set(next));
    });
  };

  const normalizeStatName = (value: string) =>
    statChoices.find((k) => k.toLowerCase() === value.trim().toLowerCase());

  // Build payload used for internal search
  const buildPayload = (page = 1, limit = DEFAULT_PAGE_SIZE) => {
    const types = selectedTypes.length === 0 ? [-1] : selectedTypes;
    const stats = statLines.map(
      (line) =>
        [effectData?.[line.statName], line.op, line.value] as SearchStatPayload,
    );
    const base = {
      types,
      stats,
      page,
      pageSize: limit,
    };

    // include name only when present (keeps payload minimal)
    return name ? { ...base, name } : base;
  };

  const handleInternalSearch = (page = 1) => {
    const payload = buildPayload(
      page,
      searchResults?.pagination.pageSize ?? DEFAULT_PAGE_SIZE,
    );
    setSearchPayload(payload);
  };

  // Before native submit to Coryn: ensure the form contains itype[] = -1 if user selected none.
  const handleCorynClick = (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form as HTMLFormElement | null;
    if (!form) return;

    // If nothing selected, add a temporary hidden itype[] = -1 so Coryn receives it.
    if (selectedTypes.length === 0) {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'itype[]';
      hidden.value = '-1';
      hidden.dataset._temp = '1';
      form.appendChild(hidden);
      // cleanup after a short while (submit will already be triggered)
      setTimeout(() => hidden.remove(), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <form
        className="mx-auto mt-6 mb-8 max-w-5xl rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-6 shadow-sm"
        method="POST"
        action="https://coryn.club/itemsearch_handler.php"
        target="_blank"
        rel="noopener"
      >
        <input type="hidden" name="iprocess" value="-1" />
        <fieldset className="space-y-5">
          <legend className="px-1 text-base sm:text-lg font-semibold text-foreground">
            Advanced Search
          </legend>

          {isFetchingItemTypes ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
              {itemTypesList.map(([name, value]) => (
                <label
                  key={value}
                  className="inline-flex items-center gap-2 rounded-md border border-border/50 bg-background/60 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="itype[]"
                    value={value}
                    checked={selectedTypes.includes(value)}
                    onChange={(e) => toggleItemType(value, e.target.checked)}
                    className="accent-primary"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Selected type(s):{' '}
              </span>
              {selectedTypeText || 'None'}
            </div>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Name</span>
              <input
                type="text"
                name="iname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item name"
                className="mt-1 h-10 w-full rounded-md border border-border/50 bg-background px-3 text-sm"
              />
            </label>
          </div>

          <datalist id="stat-choices">
            {statChoices.map((choice) => (
              <option key={choice} value={choice} />
            ))}
          </datalist>

          <input type="hidden" name="op[]" value=">=" />

          <div className="space-y-2">
            {statLines.map((line) => {
              const validStatName = normalizeStatName(line.statName);
              const inputStyle = !line.statName
                ? 'border-border/50'
                : validStatName
                  ? 'border-emerald-500/60 bg-emerald-500/10'
                  : 'border-red-500/60 bg-red-500/10';

              return (
                <div
                  key={line.id}
                  className="flex flex-wrap items-center gap-2"
                >
                  <input
                    type="text"
                    list="stat-choices"
                    value={line.statName}
                    onChange={(e) =>
                      updateStatLine(line.id, { statName: e.target.value })
                    }
                    className={`h-10 min-w-55 flex-1 rounded-md border px-3 text-sm ${inputStyle}`}
                    placeholder="Input stat name"
                  />

                  <select
                    value={line.op}
                    onChange={(e) =>
                      updateStatLine(line.id, {
                        op: e.target.value as Operator,
                      })
                    }
                    className="h-10 rounded-md border border-border/50 bg-background px-2"
                    name={
                      validStatName ? `op[${effectData?.[validStatName]}]` : ''
                    }
                  >
                    <option value=">=">≥</option>
                    <option value=">">&gt;</option>
                    <option value="=">=</option>
                    <option value="<">&lt;</option>
                    <option value="<=">≤</option>
                  </select>

                  <input
                    type="number"
                    value={line.value}
                    onChange={(e) =>
                      updateStatLine(line.id, {
                        value: Number(e.target.value),
                      })
                    }
                    className="h-10 w-24 rounded-md border border-border/50 bg-background px-2"
                    name={
                      validStatName
                        ? `effect[${effectData?.[validStatName]}]`
                        : ''
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeStatLine(line.id)}
                    className="h-10 w-10 rounded-md border border-border/50 bg-background hover:bg-red-500/10"
                    aria-label="Remove stat line"
                  >
                    -
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            {isFetchingEffect ? (
              <Loading />
            ) : (
              <button
                type="button"
                onClick={addStatLine}
                className="h-9 w-9 rounded-md border border-border/50 bg-background hover:bg-accent/20"
                aria-label="Add stat line"
              >
                +
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="submit"
              className="h-10 rounded-md border border-border/50 bg-background font-medium hover:opacity-90"
              onClick={handleCorynClick}
            >
              Search on Coryn.club
            </button>
            <button
              type="button"
              className="h-10 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
              onClick={() => handleInternalSearch(1)}
            >
              Search (new)
            </button>
          </div>
        </fieldset>
      </form>

      {searchPayload != null && isSearching ? (
        <Loading />
      ) : (
        <Suspense fallback={<Loading />}>
          {searchResults ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-muted-foreground">
                Page {searchResults.pagination.currentPage}/
                {searchResults.pagination.totalPages} - Showing{' '}
                {searchResults.data.length} of{' '}
                {searchResults.pagination.totalItems} item(s)
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-8 rounded-md border border-border/50 bg-background px-3 text-sm disabled:opacity-50"
                  disabled={
                    isSearching || searchResults.pagination.currentPage <= 1
                  }
                  onClick={() =>
                    handleInternalSearch(searchResults.pagination.currentPage - 1)
                  }
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md border border-border/50 bg-background px-3 text-sm disabled:opacity-50"
                  disabled={
                    isSearching ||
                    searchResults.pagination.currentPage >=
                      searchResults.pagination.totalPages
                  }
                  onClick={() =>
                    handleInternalSearch(searchResults.pagination.currentPage + 1)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            {searchResults?.data.map((item) => (
              <CardItem key={item.id} item={item} />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
