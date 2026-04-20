import { Link } from 'react-router';
import type { IToolCard } from './type';

export type ToolCardProps = {
  card: IToolCard;
  onClick: () => void;
};

export default function ToolCard({ card, onClick }: ToolCardProps) {
  return (
    <li className="group rounded-2xl border border-border/50 bg-linear-to-br from-card/80 to-card/30 text-card-foreground p-5 shadow-sm backdrop-blur-md hover:shadow-md hover:border-primary/30 hover:from-card hover:to-primary/5 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {card.href.endsWith('.html') ? (
          <a
            href={card.href}
            className="text-base font-bold text-card-foreground no-underline group-hover:text-primary transition-colors"
          >
            {card.title}
          </a>
        ) : (
          <Link
            to={card.href}
            className="text-base font-bold text-card-foreground no-underline group-hover:text-primary transition-colors"
          >
            {card.title}
          </Link>
        )}

        <button
          type="button"
          aria-label={`Show help for ${card.title}`}
          onClick={onClick}
          className="shrink-0 p-2 rounded-xl bg-card/10 border border-border/40 hover:bg-accent/20 hover:border-accent/50 transition-colors dark:bg-card/10 dark:border-border/30 dark:hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring/50"
        >
          <img
            src="/media/images/question-mark.svg"
            alt=""
            className="h-5 w-5"
            draggable={false}
          />
        </button>
      </div>

      <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
        {card.description}
      </div>
    </li>
  );
}
