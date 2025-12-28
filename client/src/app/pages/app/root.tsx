/**
 * @module app/pages/app/root
 * @description Root layout component that wraps all application routes
 *
 * This module defines the base visual structure for the entire application.
 * It provides a consistent layout wrapper ( @see ContentLayout ) while allowing
 * child routes to render their content through React Router's Outlet.
 *
 * Functionality:
 * - **Layout consistency**: Wraps all routes in ContentLayout for unified header/footer
 * - **Route rendering**: Uses Outlet to render matched child route components
 *
 * @example
 * // Route configuration (in create-router.tsx)
 * {
 *   path: '/',
 *   Component: AppRoot,
 *   children: [
 *     { path: '/', Component: HomePage },
 *     { path: '/categories/:id', Component: CategoryPage }
 *   ]
 * }
 */

import { Outlet } from 'react-router';

import { ContentLayout } from '@/components/layouts';

/**
 * AppRoot component - Base layout shell for the entire application.
 *
 * Wraps all routes in a consistent ContentLayout structure. Child routes
 * render their content through the Outlet component, which acts as a placeholder
 * for matched route components.
 *
 * @returns Root layout structure with Outlet for child routes
 *
 * @remarks
 * - ContentLayout provides the header with back/home navigation
 * - ContentLayout provides the footer with contact information
 * - Outlet renders the active route's component (HomePage, CategoryPage, etc.)
 * - This component is typically mounted once and persists across route changes
 * - Error handling is managed at the route level via MainErrorFallback
 *
 * @example
 * // Outlet will render different components based on route:
 * // '/' → HomePage
 * // '/categories/2' → CategoryPage
 * // '/articles/42' → ArticlePage
 * // '/personal' → PersonalPage
 */
const AppRoot = () => {
  return (
    <ContentLayout title="EdNotes">
      <Outlet />
    </ContentLayout>
  );
};

export default AppRoot;
