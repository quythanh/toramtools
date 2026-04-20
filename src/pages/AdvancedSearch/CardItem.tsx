import type { Item } from '@/types/search.type';

function formatProcessAmount(amount: number) {
  return amount <= 0 ? 'N/A' : amount;
}

export default function CardItem({ item }: { item: Item }) {
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

      {item.note ? (
        <div className="mt-2 text-xs text-foreground/80 italic">
          {item.note}
        </div>
      ) : null}

      {item.effects?.length ? (
        <ul className="mt-3 space-y-1 text-sm">
          {item.effects.map((ef) => (
            <li
              key={`${ef.effect_id}-${ef.item_id}`}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex-1 text-xs text-muted-foreground">
                {ef.effect_label}
              </div>
              <div className="text-sm font-medium text-foreground">
                {ef.amount}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-2 text-xs text-muted-foreground">No effects</div>
      )}
    </div>
  );
}
