import { useMemo } from 'react';
import { ApplyMap, ProcessType } from '@/constants/item';
import type { Item } from '@/types/search.type';
import { isValidProcessType } from '@/utils/item';
import Collapse from './Collapse';

function formatProcessAmount(amount: number) {
  return amount <= 0 ? 'N/A' : amount;
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
    <div className="p-3 border border-border/50 rounded-md bg-background min-w-[220px] max-w-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">
            {item.name}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            [{item.type.label}]
            {item.badge ? (
              <span className="ml-2 px-2 py-0.5 rounded bg-secondary/10 text-secondary text-xs">
                {item.badge}
              </span>
            ) : null}
          </div>
        </div>

        <div className="text-right text-xs text-muted-foreground">
          <div>
            Sell:{' '}
            <span className="text-foreground font-medium">
              {formatProcessAmount(item.sell)} {item.sell > 0 ? 'Spina' : null}
            </span>
          </div>
          <div>
            Proc:{' '}
            <span className="text-foreground font-medium">
              {formatProcessAmount(item.process_amount)}{' '}
              {isValidProcessType(item.process)
                ? ProcessType[item.process - 1]
                : null}
            </span>
          </div>
        </div>
      </div>

      <Collapse title="Stat/Effect">
        {hasEffects ? (
          <div className="p-2 space-y-2 text-sm">
            {Object.entries(groupedEffects).map(([keyStr, effects]) => {
              const key = Number(keyStr);
              const groupLabel =
                key > 0 ? `${ApplyMap[Math.log2(key) + 1]} only:` : null;

              return (
                <div key={key}>
                  {groupLabel && (
                    <div className="text-xs font-bold text-teal-600/80 mb-1">
                      {groupLabel}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {effects.map((ef) => (
                      <li
                        key={`${ef.id}`}
                        className="flex items-center justify-between gap-2"
                      >
                        <div
                          className={`flex-1 text-xs text-muted-foreground ${groupLabel ? 'pl-2' : ''}`}
                        >
                          {ef.label}
                        </div>
                        <div className="text-sm font-medium text-foreground">
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
          <div className="p-2 text-xs text-muted-foreground">No effects</div>
        )}
      </Collapse>

      <Collapse title="Obtained From">
        {hasMonsters ? (
          <div className="p-2">
            <div className="grid grid-cols-[1fr_1fr] gap-2 text-[11px] font-semibold text-muted-foreground border-b border-border/50 pb-1">
              <span>Monster</span>
              <span>Map</span>
            </div>
            <ul className="mt-1 space-y-1">
              {item.monsters?.map((monster) => (
                <li
                  key={monster.id}
                  className="grid grid-cols-[1fr_1fr] gap-2 text-xs"
                >
                  <span className="text-foreground truncate">
                    {monster.name}{' '}
                    {monster.level ? `(Lv ${monster.level})` : ''}
                  </span>
                  <span className="text-muted-foreground truncate">
                    {monster.map?.name ?? '-'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-2 text-xs text-muted-foreground">
            No monster data
          </div>
        )}
      </Collapse>
    </div>
  );
}
