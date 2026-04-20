import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import MainLayout from '@/layouts/MainLayout';

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
