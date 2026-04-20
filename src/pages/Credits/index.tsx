import { lazy, Suspense } from 'react';
import Loading from '@/components/Loading';
import credits from './data';

const CreditLink = lazy(() => import('./CreditLink'));

export default function Credits() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mt-10 mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-cyan-400 pb-2">
          Credits
        </h1>
        <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl">
          Source of data used on this website.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Suspense fallback={<Loading />}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {credits.map((c) => (
              <CreditLink key={c.href} href={c.href} label={c.label} />
            ))}
          </ul>
        </Suspense>

        <div
          role="note"
          className="rounded-2xl border border-red-500/50 bg-linear-to-br from-red-500/10 to-red-500/5 text-red-900 dark:text-red-100 p-5 shadow-sm backdrop-blur-md"
        >
          <span className="font-bold">Warning:</span> Slow updates.
        </div>
      </div>
    </div>
  );
}
