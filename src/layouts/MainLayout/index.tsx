import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import Loading from '@/components/Loading';

const AppTitle = lazy(() => import('@/components/Title'));
const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 dark:to-primary/10 text-foreground flex flex-col selection:bg-primary/20">
      <AppTitle />
      <Suspense fallback={<Loading />}>
        <Header />
      </Suspense>
      <main className="flex-1 pb-8">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <Suspense fallback={<Loading />}>
        <Footer />
      </Suspense>
    </div>
  );
}
