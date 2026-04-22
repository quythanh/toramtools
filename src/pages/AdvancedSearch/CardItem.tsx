import { MinusCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import type { Item } from '@/types/search.type';

function formatProcessAmount(amount: number) {
  return amount <= 0 ? 'N/A' : amount;
}

export default function CardItem({ item }: { item: Item }) {
  const [isEffectsExpanded, setIsEffectsExpanded] = useState(true);
  const [isMonstersExpanded, setIsMonstersExpanded] = useState(true);

  const hasEffects = Boolean(item.effects?.length);
  const hasMonsters = Boolean(item.monsters?.length);

  return (
    <div className="p-3 border border-border/50 rounded-md bg-background min-w-[220px] max-w-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">
            {item.name}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {item.type_label}
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
              {formatProcessAmount(item.sell)}
            </span>
          </div>
          <div>
            Proc:{' '}
            <span className="text-foreground font-medium">
              {formatProcessAmount(item.process_amount)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 border border-border/50 rounded-sm overflow-hidden">
        <button
          type="button"
          className="w-full px-2 py-1.5 bg-secondary/10 flex items-center justify-between text-left"
          onClick={() => setIsEffectsExpanded((prev) => !prev)}
        >
          <span className="text-xs font-semibold text-foreground">
            Stat/Effect
          </span>
          {isEffectsExpanded ? (
            <MinusCircle className="size-3.5 text-muted-foreground" />
          ) : (
            <PlusCircle className="size-3.5 text-muted-foreground" />
          )}
        </button>

        {isEffectsExpanded ? (
          hasEffects ? (
            <ul className="p-2 space-y-1 text-sm">
              {item.effects?.map((ef) => (
                <li
                  key={`${ef.id}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex-1 text-xs text-muted-foreground">
                    {ef.label}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {ef.amount}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-xs text-muted-foreground">No effects</div>
          )
        ) : null}
      </div>

      <div className="mt-2 border border-border/50 rounded-sm overflow-hidden">
        <button
          type="button"
          className="w-full px-2 py-1.5 bg-secondary/10 flex items-center justify-between text-left"
          onClick={() => setIsMonstersExpanded((prev) => !prev)}
        >
          <span className="text-xs font-semibold text-foreground">
            Obtained From
          </span>
          {isMonstersExpanded ? (
            <MinusCircle className="size-3.5 text-muted-foreground" />
          ) : (
            <PlusCircle className="size-3.5 text-muted-foreground" />
          )}
        </button>

        {isMonstersExpanded ? (
          hasMonsters ? (
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
          )
        ) : null}
      </div>
    </div>
  );
}
