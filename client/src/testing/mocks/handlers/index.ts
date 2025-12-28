/**
 * Define Mock Service Worker handlers for API endpoints.
 * These intercept network requests during tests and return mock data from db.ts.
 *
 * Integration:
 * - Used by `testing/mocks/browser.ts` for browser environment (dev, Storybook)
 * - Used by `testing/mocks/server.ts` for Node.js test environment (Vitest)
 *
 * Usage:
 *   Add handlers for each endpoint you need to mock:
 *   http.get(`${env.API_URL}/api/categories`, () => HttpResponse.json(db.category.getAll()))
 */

import { HttpResponse, http } from 'msw';

import { db, persistDb } from '../db';

import { env } from '@/config/env';

export const handlers = [
  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  /**
   * GET /
   * Handles root requests (e.g., Storybook/Vite dev server) to avoid MSW "unhandled request" warnings.
   */
  http.get('/', async () => {
    return HttpResponse.json({ ok: true });
  }),

  /**
   * GET /healthcheck
   * Returns health status for the API.
   * Used to verify the mock server is running.
   */
  http.get(`${env.API_URL}/healthcheck`, async () => {
    return HttpResponse.json({ ok: true });
  }),

  // ============================================================================
  // CATEGORIES
  // ============================================================================

  /**
   * GET /categories
   * Retrieves all categories from the database.
   * Returns: Array of all category objects.
   */
  http.get(`${env.API_URL}/categories`, async () => {
    const categories = db.category.getAll();
    return HttpResponse.json(categories);
  }),

  /**
   * GET /categories/top-level
   * Retrieves only root-level categories (those without parents).
   * Used for displaying the main navigation categories on the home page.
   * Returns: Array of categories where parentId is null or undefined.
   */
  http.get(`${env.API_URL}/categories/top-level`, async () => {
    const allCategories = db.category.getAll();
    const topLevel = allCategories.filter(
      (cat) => cat.parentId === null || cat.parentId === undefined,
    );
    return HttpResponse.json(topLevel);
  }),

  /**
   * GET /categories/:id
   * Retrieves a single category by its ID.
   * Returns: Single category object, or 404 if not found.
   */
  http.get(`${env.API_URL}/categories/:id`, async ({ params }) => {
    const { id } = params;
    const category = db.category.findFirst({
      where: { id: { equals: Number(id) } },
    });
    if (!category) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(category);
  }),

  /**
   * GET /categories/:id/with-children
   * Retrieves a category along with all its direct child categories.
   * Used for displaying a category page with its subcategories.
   * Returns: { parent: Category, children: Category[] }
   */
  http.get(
    `${env.API_URL}/categories/:id/with-children`,
    async ({ params }) => {
      const { id } = params;
      const parent = db.category.findFirst({
        where: { id: { equals: Number(id) } },
      });
      if (!parent) {
        return new HttpResponse(null, { status: 404 });
      }
      const allCategories = db.category.getAll();
      const children = allCategories.filter(
        (cat) => cat.parentId === Number(id),
      );
      return HttpResponse.json({ parent, children });
    },
  ),

  /**
   * GET /categories/:id/children
   * Retrieves only the child categories for a given parent category.
   * Returns: Array of categories that are direct children of the specified parent.
   */
  http.get(`${env.API_URL}/categories/:id/children`, async ({ params }) => {
    const { id } = params;
    const allCategories = db.category.getAll();
    const children = allCategories.filter((cat) => cat.parentId === Number(id));
    return HttpResponse.json(children);
  }),

  /**
   * POST /categories
   * Creates a new category in the database.
   * Accepts: Category object in request body.
   * Returns: Newly created category with 201 status.
   * Side effect: Persists changes to localStorage/file.
   */
  http.post(`${env.API_URL}/categories`, async ({ request }) => {
    const data = await request.json();
    const category = db.category.create(data as any);
    await persistDb('category');
    return HttpResponse.json(category, { status: 201 });
  }),

  /**
   * PUT /categories/:id
   * Updates an existing category with new data.
   * Accepts: Partial category object in request body.
   * Returns: Updated category object.
   * Side effect: Persists changes to localStorage/file.
   */
  http.put(`${env.API_URL}/categories/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const category = db.category.update({
      where: { id: { equals: Number(id) } },
      data: updates as any,
    });
    await persistDb('category');
    return HttpResponse.json(category);
  }),

  /**
   * DELETE /categories/:id
   * Deletes a category from the database.
   * Returns: 204 No Content on success.
   * Side effect: Persists changes to localStorage/file.
   */
  http.delete(`${env.API_URL}/categories/:id`, async ({ params }) => {
    const { id } = params;
    db.category.delete({ where: { id: { equals: Number(id) } } });
    await persistDb('category');
    return new HttpResponse(null, { status: 204 });
  }),

  // ============================================================================
  // ARTICLES
  // ============================================================================

  /**
   * GET /articles
   * Retrieves all articles from the database.
   * Returns: Array of all article objects.
   */
  http.get(`${env.API_URL}/articles`, async () => {
    const articles = db.article.getAll();
    return HttpResponse.json(articles);
  }),

  /**
   * GET /articles/:id
   * Retrieves a single article by its ID.
   * Used for displaying individual article pages.
   * Returns: Single article object with parsed content, or 404 if not found.
   */
  http.get(`${env.API_URL}/articles/:id`, async ({ params }) => {
    const { id } = params;
    const article = db.article.findFirst({
      where: { id: { equals: Number(id) } },
    });
    if (!article) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(article);
  }),

  /**
   * GET /articles/category/:categoryId
   * Retrieves all articles belonging to a specific category.
   * Used for displaying a list of articles within a category page.
   * Returns: Array of articles filtered by categoryId.
   */
  http.get(
    `${env.API_URL}/articles/category/:categoryId`,
    async ({ params }) => {
      const { categoryId } = params;
      const articles = db.article.findMany({
        where: { categoryId: { equals: Number(categoryId) } },
      });
      return HttpResponse.json(articles);
    },
  ),

  /**
   * POST /articles
   * Creates a new article in the database.
   * Accepts: Article object in request body (content should be JSON stringified).
   * Returns: Newly created article with 201 status.
   * Side effect: Persists changes to localStorage/file.
   */
  http.post(`${env.API_URL}/articles`, async ({ request }) => {
    const data = await request.json();
    const article = db.article.create(data as any);
    await persistDb('article');
    return HttpResponse.json(article, { status: 201 });
  }),

  /**
   * PUT /articles/:id
   * Updates an existing article with new data.
   * Accepts: Partial article object in request body.
   * Returns: Updated article object.
   * Side effect: Persists changes to localStorage/file.
   */
  http.put(`${env.API_URL}/articles/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const article = db.article.update({
      where: { id: { equals: Number(id) } },
      data: updates as any,
    });
    await persistDb('article');
    return HttpResponse.json(article);
  }),

  /**
   * DELETE /articles/:id
   * Deletes an article from the database.
   * Returns: 204 No Content on success.
   * Side effect: Persists changes to localStorage/file.
   */
  http.delete(`${env.API_URL}/articles/:id`, async ({ params }) => {
    const { id } = params;
    db.article.delete({ where: { id: { equals: Number(id) } } });
    await persistDb('article');
    return new HttpResponse(null, { status: 204 });
  }),

  // ============================================================================
  // PROJECTS
  // ============================================================================

  /**
   * GET /projects
   * Retrieves all personal projects from the database.
   * Used for displaying the projects list on the Personal page.
   * Returns: Array of all project objects.
   */
  http.get(`${env.API_URL}/projects`, async () => {
    const projects = db.project.getAll();
    return HttpResponse.json(projects);
  }),
];
