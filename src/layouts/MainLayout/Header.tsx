import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';

const navItems: Array<{ href: string; label: string; navLink: boolean }> = [
  { href: '/exp-calculator', label: 'Exp', navLink: true },
  { href: '/sp.html', label: 'Stat/SP', navLink: false },
  { href: '/blacksmith.html', label: 'BS Calc', navLink: false },
  { href: '/advanced-search', label: 'Advance Search', navLink: true },
  { href: '/scroll.html', label: 'Ninja Scrolls', navLink: false },
  { href: '/credits', label: 'Credits', navLink: true },
];

export default function MainHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';

    try {
      const saved = window.localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore localStorage errors
    }

    const prefersDark =
      window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    // Toggle theme by setting the `.dark` class on the document root.
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem('theme', theme);
    } catch {
      // ignore localStorage errors
    }
  }, [theme]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  return (
    <header className="sticky top-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm transition-colors duration-300">
      <div className="mx-auto h-full max-w-6xl px-4 flex items-center">
        <NavLink
          to="/"
          className="flex items-center"
          aria-label="Toram Tools Home"
        >
          <img src="/logo.svg" alt="toramtools logo" className="h-6 w-auto" />
        </NavLink>

        <div className="ml-auto flex items-center gap-2">
          <nav className="hidden md:flex items-center h-full">
            {navItems.map((item) =>
              item.navLink ? (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `h-full px-3 flex items-center transition-colors ${
                      isActive
                        ? 'bg-linear-to-r from-primary/10 to-primary/5 text-primary font-medium'
                        : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground font-medium'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="h-full px-3 flex items-center text-foreground/80 hover:bg-accent/50 hover:text-foreground font-medium transition-colors"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <button
            type="button"
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="p-2 rounded-md border border-border/40 bg-background/0 hover:bg-black/10 dark:hover:bg-white/10 text-foreground/80"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 border border-border/40 text-foreground/90"
          >
            <img src="/media/images/menu.svg" alt="" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 dark:bg-black/50"
            tabIndex={0}
            aria-label="Close menu overlay"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSidebarOpen(false);
            }}
          />

          <aside className="absolute top-0 right-0 h-full w-[300px] bg-background shadow-lg border-l border-border/40 p-4 flex flex-col">
            <div className="flex items-center">
              <div className="flex-1" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 border border-border/40 text-foreground/90"
              >
                <img src="/media/images/close.svg" alt="" className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-4 flex flex-col gap-1">
              {navItems.map((item) =>
                item.navLink ? (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-3 rounded-md transition-colors ${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/90 hover:bg-accent/20 hover:text-accent-foreground'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="px-3 py-3 rounded-md text-foreground/90 hover:bg-accent/20 hover:text-accent-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
