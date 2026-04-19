import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';

type ToolKey = 'xp' | 'sp' | 'bs' | 'cc' | 'ns' | 'tc';

const toolCards: Array<{
  key: ToolKey;
  href: string;
  title: string;
  description: ReactNode;
}> = [
  {
    key: 'xp',
    href: '/xp.html',
    title: 'Experience Calculator',
    description:
      "Find how many times takes to reach certain level through either main quest or side quests or how many levels you'll get by doing these quests a certain number of times.",
  },
  {
    key: 'sp',
    href: '/sp.html',
    title: 'Stat and Skill Points Calculator',
    description:
      "Find how many skill and stat points you'll have at certain level counting extra points from emblems or not. You may also find required level to have certain amount of stat/skill points.",
  },
  {
    key: 'bs',
    href: '/blacksmith.html',
    title: 'Blacksmith Crafting Calculator',
    description:
      'Find how much potential your weapons/armor will have or how much success chance each craft might have based on your stats, equipaments and skills related to crafting.',
  },
  {
    key: 'cc',
    href: '/corynclub.html',
    title: 'Simplified Advanced Search',
    description: (
      <>
        Less trouble finding items at{' '}
        <a href="http://coryn.club" target="_blank" rel="noreferrer">
          Coryn Club.
        </a>
      </>
    ),
  },
  {
    key: 'ns',
    href: '/scroll.html',
    title: 'Ninja Scroll Database',
    description:
      'Find which weapons are required to craft a scroll given its type/skills or check which kind of scroll a certain combination of weapons will produce.',
  },
  {
    key: 'tc',
    href: '/toramcafe.html',
    title: 'ToramCafe English Search',
    description: (
      <>
        Find items by english name on japanese database{' '}
        <a href="https://toramcafe.com" target="_blank" rel="noreferrer">
          ToramCafe.com
        </a>
        .
      </>
    ),
  },
];

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
        {toolCards
          // Keep `ToramCafe` hidden until it's migrated as a React page.
          .filter((c) => c.key !== 'tc')
          .map((card) => (
            <li
              key={card.key}
              className="group rounded-2xl border border-border/50 bg-linear-to-br from-card/80 to-card/30 text-card-foreground p-5 shadow-sm backdrop-blur-md hover:shadow-md hover:border-primary/30 hover:from-card hover:to-primary/5 transition-all duration-300"
            >
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
                  onClick={() => setActiveKey(card.key)}
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
          ))}

        <li className="group rounded-2xl border border-border/50 bg-linear-to-br from-card/80 to-card/30 text-card-foreground p-5 shadow-sm backdrop-blur-md hover:shadow-md hover:border-primary/30 hover:from-card hover:to-primary/5 transition-all duration-300">
          <NavLink
            to="/credits"
            className="text-base font-bold text-card-foreground no-underline group-hover:text-primary transition-colors"
          >
            Credits, References and Contact
          </NavLink>
          <div className="mt-3 text-sm text-muted-foreground">
            Thanks to the community sources and references.
          </div>
        </li>
      </ul>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
        >
          <button
            type="button"
            aria-label="Close help"
            className="absolute inset-0 bg-black/40 dark:bg-black/50 backdrop-blur-sm"
            onClick={() => setActiveKey(null)}
          />

          <div className="relative w-full max-w-2xl rounded-2xl border border-border/50 bg-linear-to-b from-card to-card/90 text-card-foreground shadow-2xl backdrop-blur-xl">
            <div className="p-5 flex items-start justify-between gap-4 border-b border-border/40">
              <h2 id="help-title" className="text-lg font-semibold">
                {active.title}
              </h2>

              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Close help"
                onClick={() => setActiveKey(null)}
                className="p-2 rounded-xl bg-card/10 border border-border/40 hover:bg-accent/20 hover:border-accent/50 transition-colors dark:bg-card/10 dark:border-border/30 dark:hover:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring/50"
              >
                <img
                  src="/media/images/close.svg"
                  alt=""
                  className="h-5 w-5"
                  draggable={false}
                />
              </button>
            </div>

            <div className="p-5">
              <div className="text-sm sm:text-base leading-relaxed text-card-foreground">
                {active.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
