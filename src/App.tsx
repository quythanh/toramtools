import QueryProvider from '@/providers/QueryProvider';
import AppRouter from '@/routes';

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}
