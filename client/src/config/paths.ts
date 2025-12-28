/**
 * @module config/paths
 * @description Centralized routing configuration with path patterns for React Router and
 * helper functions to generate full URLs. Each route has a `path` (with optional parameters)
 * and a `getHref` function to safely construct URLs with parameters.
 *
 * Features:
 * - **Single source**: All paths defined in one place
 * - **Type-safe**: Paths and parameters are constants
 * - **DRY**: URLs not hardcoded throughout the app
 *
 * Usage:
 * - React Router: Use `paths.home.path`, `paths.category.path` in route config
 * - Navigation: Use `paths.home.getHref()`, `paths.article.getHref(id)` for links/navigate
 *
 * @example
 * // In route config
 * { path: paths.article.path, element: <ArticlePage /> }
 *
 * @example
 * // In navigation
 * navigate(paths.category.getHref(categoryId))
 */

/**
 * Application routing paths with URL generators.
 *
 * Each path has:
 * - `path`: React Router pattern (with `:paramName` for dynamic segments)
 * - `getHref`: Function to generate full URL given required parameters
 *
 * @type {Object}
 * @property {Object} home - Home page route
 * @property {string} home.path - Router pattern: `/`
 * @property {() => string} home.getHref - Returns: `/`
 *
 * @property {Object} category - Category page route
 * @property {string} category.path - Router pattern: `/categories/:categoryId`
 * @property {(categoryId: string) => string} category.getHref - Returns: `/categories/{categoryId}`
 *
 * @property {Object} article - Article page route
 * @property {string} article.path - Router pattern: `/articles/:articleId`
 * @property {(articleId: string) => string} article.getHref - Returns: `/articles/{articleId}`
 *
 * @property {Object} personal - Personal/about page route
 * @property {string} personal.path - Router pattern: `/personal`
 * @property {() => string} personal.getHref - Returns: `/personal`
 */
export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  category: {
    path: '/categories/:categoryId',
    getHref: (categoryId: string) => `/categories/${categoryId}`,
  },

  article: {
    path: '/articles/:articleId',
    getHref: (articleId: string) => `/articles/${articleId}`,
  },

  personal: {
    path: '/personal',
    getHref: () => '/personal',
  },
} as const;
