import { useEffect } from 'react';
import { useMatches } from 'react-router';

export default function AppTitle() {
  const matches = useMatches();

  useEffect(() => {
    const currentRoute = matches[matches.length - 1];
    const handle = currentRoute?.handle as any;
    const title = handle?.title;

    if (title) {
      document.title = `Toram Tools - ${title}`;
    } else {
      document.title = 'Toram Tools';
    }
  }, [matches]);

  return null;
}
