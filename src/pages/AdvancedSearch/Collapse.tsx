import { MinusCircle, PlusCircle } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface CollapseProps {
  title: string;
  children: ReactNode;
}

export default function Collapse({ title, children }: CollapseProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = isExpanded ? MinusCircle : PlusCircle;

  return (
    <div className="mt-3 border border-border/50 rounded-sm overflow-hidden">
      <button
        type="button"
        className="w-full px-2 py-1.5 bg-secondary/10 flex items-center justify-between text-left"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <Icon className="size-3.5 text-muted-foreground" />
      </button>

      {isExpanded && children}
    </div>
  );
}
