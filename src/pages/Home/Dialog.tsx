import { forwardRef, type ReactNode } from 'react';

interface DialogProps {
  title: string;
  description: string | ReactNode;
  onClose: () => void;
}

const Dialog = forwardRef<HTMLButtonElement, DialogProps>(
  ({ title, description, onClose }, ref) => (
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
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-border/50 bg-linear-to-b from-card to-card/90 text-card-foreground shadow-2xl backdrop-blur-xl">
        <div className="p-5 flex items-start justify-between gap-4 border-b border-border/40">
          <h2 id="help-title" className="text-lg font-semibold">
            {title}
          </h2>

          <button
            ref={ref}
            type="button"
            aria-label="Close help"
            onClick={onClose}
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
            {description}
          </div>
        </div>
      </div>
    </div>
  ),
);

export default Dialog;
