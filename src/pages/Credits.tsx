import type { ReactNode } from 'react';

function CreditLink({ href, label }: { href: string; label: ReactNode }) {
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

export default function Credits() {
  const credits = [
    {
      href: 'https://www.dopr.net/toramonline-wiki/blog-statussmith',
      label: 'Crafting (DOPR)',
    },
    {
      href: 'https://aminoapps.com/c/toram_online/page/blog/bs-craft-sr-test-abandoned/n5Pl_eKQTLuWr8j5PZJkw8gg8QBxrLYwNbdTe',
      label: 'BS Craft SR Test (by JosuaK62)',
    },
    {
      href: 'https://toramonline.com/index.php?threads/little-experience-experiment.5598/',
      label: 'Experience Formula (by Lorem)',
    },
    {
      href: 'https://toramonline.com/index.php?threads/main-quest-catalog-trivia-updated-to-24-09-20-mq.46239/',
      label: 'MQ XP Catalog (by XPPlayer1337)',
    },
    {
      href: 'http://coryn.club/guide.php?key=smith',
      label: 'Smithing Guide (Coryn Club)',
    },
    {
      href: 'https://docs.google.com/spreadsheets/d/1MGq9rIZ4NrMItEY8yuhSoUTOcclqsN4JYcMp2boVQS0/edit?usp=sharing',
      label: 'Ninja Scroll Combinations (by Tamyo02)',
    },
    {
      href: 'https://discord.gg/DP7v22kbJb',
      label: "Ultimate Blogger's Discord Server",
    },
    {
      href: 'https://www.youtube.com/@XenGamingChannel',
      label: 'Xen Gaming Channel',
    },
  ] as const;

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
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {credits.map((c) => (
            <CreditLink key={c.href} href={c.href} label={c.label} />
          ))}
        </ul>

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
