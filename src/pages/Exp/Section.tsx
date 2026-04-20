import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <fieldset className="mx-auto border border-primary rounded-xl px-4 py-1">
      <legend className="text-xs font-bold border border-primary rounded-full py-1 px-4">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
