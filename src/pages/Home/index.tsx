import {
  Activity,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router';
import Loading from '@/components/Loading';
import toolCards from './data';
import type { ToolKey } from './type';

const ToolCard = lazy(() => import('./ToolCard'));
const Dialog = lazy(() => import('./Dialog'));

export default function Home() {
  const [activeKey, setActiveKey] = useState<ToolKey | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const active = useMemo(
    () => toolCards.find((c) => c.key === activeKey) ?? null,
    [activeKey],
  );

  useEffect(() => {
    if (!activeKey) return;

    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button for better accessibility.
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveKey(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus?.();
    };
  }, [activeKey]);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mt-10 mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-cyan-400 pb-2">
          Toram Tools
        </h1>
        <p className="mt-2 text-base sm:text-lg text-muted-foreground max-w-2xl">
          Pick a tool below. Tap the question mark to see what each calculator
          does.
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={<Loading />}>
          {toolCards
            .filter((c) => c.key !== 'tc')
            .map((card) => (
              <ToolCard
                key={card.key}
                card={card}
                onClick={() => setActiveKey(card.key)}
              />
            ))}
        </Suspense>

        <li className="group rounded-2xl border border-border/50 bg-linear-to-br from-card/80 to-card/30 text-card-foreground p-5 shadow-sm backdrop-blur-md hover:shadow-md hover:border-primary/30 hover:from-card hover:to-primary/5 transition-all duration-300">
          <Link
            to="/credits"
            className="text-base font-bold text-card-foreground no-underline group-hover:text-primary transition-colors"
          >
            Credits, References and Contact
          </Link>
          <div className="mt-3 text-sm text-muted-foreground">
            Thanks to the community sources and references.
          </div>
        </li>
      </ul>

      <Activity mode={active ? 'visible' : 'hidden'}>
        <Dialog
          title={active?.title ?? ''}
          description={active?.description ?? ''}
          onClose={() => setActiveKey(null)}
        />
      </Activity>
    </div>
  );
}
