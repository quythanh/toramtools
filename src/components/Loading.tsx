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
      className={`flex flex-col justify-center items-center p-8 bg-card/60 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-xl shadow-primary/5 ${className}`}
      {...props}
    >
      <Spinner className="text-primary w-8 h-8" />
      {text && (
        <span className="mt-4 text-primary/80 font-medium tracking-wide animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
