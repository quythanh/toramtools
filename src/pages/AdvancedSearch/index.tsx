import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  PackageSearch,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
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
const DEFAULT_PAGE_SIZE = 12;

function prettyJoin(items: string[]) {
  if (items.length === 0) return 'None';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

export default function AdvancedSearch() {
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
      Object.fromEntries(
        itemTypesList.map(([keyName, value]) => [value, keyName]),
      ),
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

    return name ? { ...base, name } : base;
  };

  const handleInternalSearch = (page = 1) => {
    const payload = buildPayload(
      page,
      searchResults?.pagination.pageSize ?? DEFAULT_PAGE_SIZE,
    );
    setSearchPayload(payload);
  };

  const handleCorynClick = (e: MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form as HTMLFormElement | null;
    if (!form) return;

    if (selectedTypes.length === 0) {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'itype[]';
      hidden.value = '-1';
      hidden.dataset._temp = '1';
      form.appendChild(hidden);
      setTimeout(() => hidden.remove(), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search Form Card */}
      <div className="mx-auto mb-10 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all">
        <div className="border-b border-border/50 bg-muted/20 px-6 py-4 flex items-center gap-2">
          <Filter className="size-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Advanced Search</h2>
        </div>

        <form
          className="p-6"
          method="POST"
          action="https://coryn.club/itemsearch_handler.php"
          target="_blank"
          rel="noopener"
        >
          <input type="hidden" name="iprocess" value="-1" />
          <div className="space-y-8">
            {/* Item Types Section */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Item Types
                </h3>
                <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                  {selectedTypes.length} selected
                </span>
              </div>

              {isFetchingItemTypes ? (
                <div className="py-4">
                  <Loading />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                  {itemTypesList.map(([typeName, value]) => {
                    const isSelected = selectedTypes.includes(value);
                    return (
                      <label
                        key={value}
                        className={`
                          cursor-pointer select-none relative flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200
                          hover:shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1
                          ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary shadow-sm'
                              : 'border-border/60 bg-background hover:border-border hover:bg-accent/30 text-foreground'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          name="itype[]"
                          value={value}
                          checked={isSelected}
                          onChange={(e) =>
                            toggleItemType(value, e.target.checked)
                          }
                          className="sr-only"
                        />
                        <span className="truncate">{typeName}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            {/* General Filters Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="iname"
                  className="block text-sm font-semibold text-foreground"
                >
                  Item Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="size-4 text-muted-foreground" />
                  </div>
                  <input
                    id="iname"
                    type="text"
                    name="iname"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search by name..."
                    className="h-10 w-full rounded-lg border border-border/60 bg-background pl-10 pr-4 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col justify-center">
                <span className="block text-sm font-semibold text-foreground">
                  Selection Overview
                </span>
                <p
                  className="text-sm text-muted-foreground line-clamp-2"
                  title={selectedTypeText}
                >
                  <span className="font-medium text-foreground/80">Types:</span>{' '}
                  {selectedTypeText}
                </p>
              </div>
            </section>

            {/* Stats Section */}
            <section className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Stats & Effects
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Filter items by their specific stats
                  </p>
                </div>

                {!isFetchingEffect && (
                  <button
                    type="button"
                    onClick={addStatLine}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border/60 bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Plus className="size-4" />
                    Add Stat Filter
                  </button>
                )}
              </div>

              <datalist id="stat-choices">
                {statChoices.map((choice) => (
                  <option key={choice} value={choice} />
                ))}
              </datalist>

              <input type="hidden" name="op[]" value=">=" />

              {isFetchingEffect ? (
                <div className="py-4">
                  <Loading />
                </div>
              ) : statLines.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {statLines.map((line) => {
                    const validStatName = normalizeStatName(line.statName);
                    const inputStyle = !line.statName
                      ? 'border-border/60 bg-background'
                      : validStatName
                        ? 'border-emerald-500/50 bg-emerald-500/5 focus:border-emerald-500 focus:ring-emerald-500/20'
                        : 'border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20 text-red-600';

                    return (
                      <div
                        key={line.id}
                        className="flex flex-col sm:flex-row items-center gap-2 animate-in fade-in slide-in-from-top-2"
                      >
                        <div className="relative w-full sm:flex-1">
                          <input
                            type="text"
                            list="stat-choices"
                            value={line.statName}
                            onChange={(e) =>
                              updateStatLine(line.id, {
                                statName: e.target.value,
                              })
                            }
                            className={`h-10 w-full rounded-lg border px-3 text-sm transition-all focus:outline-none focus:ring-2 ${inputStyle}`}
                            placeholder="Type a stat name..."
                          />
                        </div>

                        <div className="flex w-full sm:w-auto items-center gap-2">
                          <select
                            value={line.op}
                            onChange={(e) =>
                              updateStatLine(line.id, {
                                op: e.target.value as Operator,
                              })
                            }
                            className="h-10 w-20 rounded-lg border border-border/60 bg-background px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                            name={
                              validStatName
                                ? `op[${effectData?.[validStatName]}]`
                                : ''
                            }
                          >
                            <option value=">=">&ge;</option>
                            <option value=">">&gt;</option>
                            <option value="=">=</option>
                            <option value="<">&lt;</option>
                            <option value="<=">&le;</option>
                          </select>

                          <input
                            type="number"
                            value={line.value}
                            onChange={(e) =>
                              updateStatLine(line.id, {
                                value: Number(e.target.value),
                              })
                            }
                            className="h-10 w-28 rounded-lg border border-border/60 bg-background px-3 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            name={
                              validStatName
                                ? `effect[${effectData?.[validStatName]}]`
                                : ''
                            }
                          />

                          <button
                            type="button"
                            onClick={() => removeStatLine(line.id)}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background text-muted-foreground transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            aria-label="Remove stat filter"
                            title="Remove stat filter"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 px-4 rounded-lg border border-dashed border-border/60 bg-muted/10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No stat filters added.
                  </p>
                </div>
              )}
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border/50">
              <button
                type="submit"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border/60 bg-background text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={handleCorynClick}
              >
                <ExternalLink className="size-4" />
                Search on Coryn.club
              </button>
              <button
                type="button"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => handleInternalSearch(1)}
              >
                <Search className="size-4" />
                Search Toram Tools
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {searchPayload != null && isSearching ? (
        <div className="py-12">
          <Loading />
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="py-12">
              <Loading />
            </div>
          }
        >
          {searchResults ? (
            <div className="space-y-6">
              {/* Pagination Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card px-4 py-3 rounded-xl border border-border/50 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">
                  Found{' '}
                  <span className="text-foreground font-bold">
                    {searchResults.pagination.totalItems}
                  </span>{' '}
                  items
                  <span className="mx-2 hidden sm:inline text-border">|</span>
                  <span className="block sm:inline mt-1 sm:mt-0 text-xs sm:text-sm">
                    Page {searchResults.pagination.currentPage} of{' '}
                    {searchResults.pagination.totalPages || 1}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-border/60 bg-background px-3 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                    disabled={
                      isSearching || searchResults.pagination.currentPage <= 1
                    }
                    onClick={() =>
                      handleInternalSearch(
                        searchResults.pagination.currentPage - 1,
                      )
                    }
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-border/60 bg-background px-3 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                    disabled={
                      isSearching ||
                      searchResults.pagination.currentPage >=
                        searchResults.pagination.totalPages
                    }
                    onClick={() =>
                      handleInternalSearch(
                        searchResults.pagination.currentPage + 1,
                      )
                    }
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Grid or Empty State */}
              {searchResults.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {searchResults.data.map((item) => (
                    <CardItem key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-dashed border-border/60 bg-card/50 text-center">
                  <div className="rounded-full bg-muted/50 p-4 mb-4">
                    <PackageSearch className="size-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    No items found
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    We couldn't find any items matching your current filters.
                    Try adjusting your search parameters.
                  </p>
                </div>
              )}

              {/* Bottom Pagination (only if many items) */}
              {searchResults.data.length > 8 &&
                searchResults.pagination.totalPages > 1 && (
                  <div className="flex justify-center pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                        disabled={
                          isSearching ||
                          searchResults.pagination.currentPage <= 1
                        }
                        onClick={() =>
                          handleInternalSearch(
                            searchResults.pagination.currentPage - 1,
                          )
                        }
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <div className="px-4 text-sm font-medium text-muted-foreground">
                        {searchResults.pagination.currentPage} /{' '}
                        {searchResults.pagination.totalPages}
                      </div>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-background transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                        disabled={
                          isSearching ||
                          searchResults.pagination.currentPage >=
                            searchResults.pagination.totalPages
                        }
                        onClick={() =>
                          handleInternalSearch(
                            searchResults.pagination.currentPage + 1,
                          )
                        }
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          ) : null}
        </Suspense>
      )}
    </div>
  );
}
