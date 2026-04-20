import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

const MainLayout = lazy(() => import('@/layouts/MainLayout'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        Component: lazy(() => import('@/pages/Home')),
      },
      {
        path: 'exp-calculator',
        Component: lazy(() => import('@/pages/Exp')),
        handle: { title: 'Experience Calculator' },
      },
      {
        path: 'advanced-search',
        Component: lazy(() => import('@/pages/AdvancedSearch')),
        handle: { title: 'Simplified Advanced Search' },
      },
      {
        path: 'credits',
        Component: lazy(() => import('@/pages/Credits')),
        handle: { title: 'Credits' },
      },
    ],
  },
  {
    path: '*',
    Component: lazy(() => import('@/pages/not-found')),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
