import { ChevronDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface CollapseProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export default function Collapse({
  title,
  children,
  defaultExpanded = false,
}: CollapseProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mt-2 rounded-md border border-border/60 bg-card/40 overflow-hidden shadow-sm transition-colors hover:border-border/80">
      <button
        type="button"
        className="w-full px-3 py-2 flex items-center justify-between text-left transition-colors hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform duration-300 ease-in-out ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/50 bg-background/50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
