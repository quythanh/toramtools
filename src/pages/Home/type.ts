import type { ReactNode } from 'react';

export type ToolKey = 'xp' | 'sp' | 'bs' | 'as' | 'ns' | 'tc';

export interface IToolCard {
  key: ToolKey;
  href: string;
  title: string;
  description: ReactNode;
}
