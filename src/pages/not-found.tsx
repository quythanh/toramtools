import { useEffect } from 'react';
import { NavLink } from 'react-router';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Toram Tools - Not Found';
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-cyan-400">
            404
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-semibold text-foreground/95">
            Page not found
          </p>

          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            We couldn't find the page you're looking for. It may have been
            moved, renamed, or is temporarily unavailable.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-linear-to-r from-primary to-cyan-500 text-primary-foreground font-semibold shadow hover:scale-105 transition-transform"
            >
              Go to Home
            </NavLink>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-2xl border border-border/40 bg-card/60 text-card-foreground hover:bg-card/80 transition-colors"
            >
              Go back
            </button>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            If you believe this is an error, check the URL or return to the home
            page and try again.
          </div>
        </div>
      </div>
    </div>
  );
}
