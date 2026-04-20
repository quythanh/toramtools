import type { ReactNode } from 'react';

interface CreditLinkProps {
  href: string;
  label: ReactNode;
}

export default function CreditLink({ href, label }: CreditLinkProps) {
  return (
    <li className="group rounded-2xl border border-border/50 bg-linear-to-br from-card/80 to-card/30 text-card-foreground p-4 shadow-sm backdrop-blur-md hover:shadow-md hover:border-primary/30 hover:from-card hover:to-primary/5 transition-all duration-300">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-start justify-between gap-4 text-left no-underline group-hover:text-primary transition-colors"
      >
        <span className="text-sm sm:text-base font-bold">{label}</span>
        <span
          className="shrink-0 text-muted-foreground text-xs pt-1"
          aria-hidden="true"
        >
          ↗
        </span>
      </a>
    </li>
  );
}
