import type { HTMLAttributes } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export default function Loading({
  text,
  className = '',
  ...props
}: LoadingProps) {
  return (
    <div
      className={`flex justify-center items-center p-8 bg-black/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-border/40 ${className}`}
      {...props}
    >
      <Spinner className="text-foreground/60" />
      {text && (
        <span className="ml-3 text-foreground/60 font-medium">{text}</span>
      )}
    </div>
  );
}
