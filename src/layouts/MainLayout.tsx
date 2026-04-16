import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Loading from '@/components/Loading';
import AppTitle from '@/components/Title';
import MainHeader from '@/layouts/MainHeader';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 dark:to-primary/10 text-foreground flex flex-col selection:bg-primary/20">
      <AppTitle />
      <MainHeader />
      <main className="flex-1 pb-8">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm text-center py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Developed by: Insane23
      </footer>
    </div>
  );
}
