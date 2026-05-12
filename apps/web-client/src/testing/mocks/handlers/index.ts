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

const toCategorySummary = (category: {
  id: number;
  title: string;
  published?: boolean;
}) => ({
  id: category.id,
  title: category.title,
  published: category.published,
});

const toArticleSummary = (article: {
  id: number;
  title: string;
  published?: boolean;
}) => ({
  id: article.id,
  title: article.title,
  published: article.published,
});

const getBreadcrumbs = (categoryId: number) => {
  const breadcrumbs: Array<{ id: number; title: string }> = [];
  let currentId: number | null | undefined = categoryId;

  while (currentId !== null && currentId !== undefined) {
    const category = db.category.findFirst({
      where: { id: { equals: currentId } },
    }) as
      | {
          id: number;
          title: string;
          parentId?: number | null;
        }
      | undefined;

    if (!category) {
      break;
    }

    breadcrumbs.unshift(toCategorySummary(category));
    currentId = category.parentId;
  }

  return breadcrumbs;
};

const getFolderContent = (categoryId: number | null) => {
  const categories = db.category
    .getAll()
    .filter((category) => category.parentId === categoryId)
    .map(toCategorySummary);

  const articles = db.article
    .getAll()
    .filter((article) => article.categoryId === categoryId)
    .map(toArticleSummary);

  return {
    subCategories: categories,
    articles,
  };
};

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
  // NAVIGATION
  // ============================================================================

  /**
   * GET /navigation/roots
   * Returns root folder content for the home page.
   */
  http.get(`${env.API_URL}/navigation/roots`, async () => {
    return HttpResponse.json(getFolderContent(null));
  }),

  /**
   * GET /navigation/categories/:id
   * Returns a folder's direct subcategories and articles.
   */
  http.get(`${env.API_URL}/navigation/categories/:id`, async ({ params }) => {
    const categoryId = Number(params.id);
    return HttpResponse.json(getFolderContent(categoryId));
  }),

  /**
   * GET /navigation/path/:catId
   * Returns breadcrumbs for a category.
   */
  http.get(`${env.API_URL}/navigation/path/:catId`, async ({ params }) => {
    const categoryId = Number(params.catId);
    return HttpResponse.json(getBreadcrumbs(categoryId));
  }),

  /**
   * GET /navigation/tree/:topicId
   * Returns a simple recursive tree rooted at the provided topic.
   */
  http.get(`${env.API_URL}/navigation/tree/:topicId`, async ({ params }) => {
    const topicId = Number(params.topicId);
    const allCategories = db.category.getAll();
    const allArticles = db.article.getAll();

    const buildNode = (categoryId: number) => {
      const category = allCategories.find((item) => item.id === categoryId);
      if (!category) {
        return null;
      }

      return {
        id: category.id,
        name: category.title,
        published: category.published,
        articles: allArticles
          .filter((article) => article.categoryId === category.id)
          .map(toArticleSummary),
      };
    };

    return HttpResponse.json(buildNode(topicId) ? [buildNode(topicId)] : []);
  }),

  /**
   * GET /navigation/search
   * Returns published articles for basic search.
   */
  http.get(`${env.API_URL}/navigation/search`, async () => {
    const articles = db.article
      .getAll()
      .filter((article) => article.published)
      .map(toArticleSummary);
    return HttpResponse.json(articles);
  }),

  /**
   * GET /navigation/article-summaries/:categoryId
   * Returns article summaries for a category.
   */
  http.get(
    `${env.API_URL}/navigation/article-summaries/:categoryId`,
    async ({ params }) => {
      const categoryId = Number(params.categoryId);
      const articles = db.article
        .findMany({ where: { categoryId: { equals: categoryId } } })
        .map(toArticleSummary);
      return HttpResponse.json(articles);
    },
  ),

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
    return HttpResponse.json({
      article,
      breadcrumbs: article.categoryId ? getBreadcrumbs(article.categoryId) : [],
      backgroundArticles: [],
    });
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
