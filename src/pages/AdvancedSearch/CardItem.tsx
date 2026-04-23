import { useMemo } from 'react';
import { ApplyMap, ProcessType } from '@/constants/item';
import type { Item } from '@/types/search.type';
import { isValidProcessType } from '@/utils/item';
import Collapse from './Collapse';

function formatProcessAmount(amount: number) {
  return amount <= 0 ? 'N/A' : amount.toLocaleString();
}

export default function CardItem({ item }: { item: Item }) {
  const hasEffects = Boolean(item.effects?.length);
  const hasMonsters = Boolean(item.monsters?.length);

  const groupedEffects = useMemo(() => {
    if (!item.effects) return {};
    return item.effects.reduce(
      (acc, ef) => {
        const key = ef.applies_to || 0;
        if (!acc[key]) acc[key] = [];
        acc[key].push(ef);
        return acc;
      },
      {} as Record<number, typeof item.effects>,
    );
  }, [item.effects]);

  return (
    <div className="flex flex-col w-full p-4 border border-border/50 rounded-xl bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-border/80 group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-bold text-card-foreground truncate group-hover:text-primary transition-colors"
            title={item.name}
          >
            {item.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-medium whitespace-nowrap border border-primary/20">
              {item.type.label}
            </span>
            {item.badge ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-medium whitespace-nowrap border border-amber-500/20">
                {item.badge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0 text-[11px]">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 border border-border/40">
            <span className="text-muted-foreground font-medium">Sell</span>
            <span className="text-foreground font-semibold flex items-center gap-1">
              {formatProcessAmount(item.sell)}
              {item.sell > 0 && (
                <span className="text-muted-foreground/70 font-normal">S</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 border border-border/40">
            <span className="text-muted-foreground font-medium">Proc</span>
            <span className="text-foreground font-semibold flex items-center gap-1">
              {formatProcessAmount(item.process_amount)}
              {isValidProcessType(item.process) && (
                <span className="text-muted-foreground/70 font-normal">
                  {ProcessType[item.process - 1]}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2 pt-2">
        <Collapse title="Stats & Effects" defaultExpanded={hasEffects}>
          {hasEffects ? (
            <div className="p-3 space-y-3">
              {Object.entries(groupedEffects).map(([keyStr, effects]) => {
                const key = Number(keyStr);
                const groupLabel =
                  key > 0 ? `${ApplyMap[Math.log2(key) + 1]} only` : null;

                return (
                  <div key={key} className="space-y-1.5">
                    {groupLabel && (
                      <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        {groupLabel}
                      </div>
                    )}
                    <ul className="space-y-1">
                      {effects.map((ef) => (
                        <li
                          key={`${ef.id}`}
                          className="flex items-center justify-between gap-3 py-1 group/stat border-b border-border/30 last:border-0"
                        >
                          <div
                            className={`flex-1 text-[13px] text-muted-foreground group-hover/stat:text-foreground transition-colors ${groupLabel ? 'pl-2' : ''}`}
                          >
                            {ef.label}
                          </div>
                          <div className="text-[13px] font-semibold text-foreground bg-background/50 px-2 py-0.5 rounded">
                            {ef.amount}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/10">
              No effects data available
            </div>
          )}
        </Collapse>

        <Collapse title="Obtained From">
          {hasMonsters ? (
            <div className="p-0">
              <div className="grid grid-cols-[1.5fr_1fr] gap-3 px-3 py-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <span>Monster</span>
                <span>Map</span>
              </div>
              <ul className="divide-y divide-border/30">
                {item.monsters?.map((monster) => (
                  <li
                    key={monster.id}
                    className="grid grid-cols-[1.5fr_1fr] gap-3 px-3 py-2.5 text-[13px] hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-foreground font-medium truncate"
                        title={monster.name}
                      >
                        {monster.name}
                      </span>
                      {monster.level && (
                        <span className="text-[11px] text-muted-foreground mt-0.5">
                          Lv {monster.level}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center min-w-0">
                      <span
                        className="text-muted-foreground truncate"
                        title={monster.map?.name ?? '-'}
                      >
                        {monster.map?.name ?? '-'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/10">
              No monster data available
            </div>
          )}
        </Collapse>
      </div>
    </div>
  );
}
