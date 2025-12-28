/**
 * Creates an in-memory database for mocking API requests.
 * Provides CRUD operations that handlers can use to simulate real API behavior.
 * Persists data to localStorage (browser) or mocked-db.json (Node) so state
 * survives page refreshes or test reruns.
 *
 * Integration:
 * - Models define the shape of each entity (category, article, project).
 * - `loadDb()` restores data from storage into memory.
 * - `persistDb()` saves model changes back to storage.
 * - `initializeDb()` orchestrates loading, seeding, and version management.
 * - `resetDb()` clears all data (useful for testing/development).
 *
 * Persistence strategy
 * - Browser: Stored in window.localStorage['msw-db']
 * - Node.js: Stored in file 'mocked-db.json' (relative to cwd)
 * - Version tracking: Each persist includes `__version` to detect seed changes
 *   and automatically reseed when the seed file is updated.
 *
 * Usage in handlers
 *   import { db, persistDb } from '@/testing/mocks/db';
 *   db.article.create({ title: 'My Article', ... });
 *   await persistDb('article');
 */

import { factory, primaryKey, nullable } from '@mswjs/data';

/**
 * Database schema definition.
 * Each model specifies the fields and their types for categories, articles, and projects.
 *
 * Category: Represents content topics with optional parent-child relationships.
 * Article: Belongs to a category and contains JSON-stringified content blocks.
 * Project: Personal projects with links and metadata.
 */
const models = {
  category: {
    id: primaryKey(Number),
    title: String,
    parentId: nullable(Number), // null for root categories
    published: Boolean,
    order: Number, // Display order within parent/root
    topicId: nullable(Number), // Link to topic category
    topic: Boolean, // Whether this is a topic (root level)
  },
  article: {
    id: primaryKey(Number),
    title: String,
    content: String, // JSON stringified ArticleBlock[]
    categoryId: Number, // Foreign key to category
    published: Boolean,
    order: Number, // Display order within category
  },
  project: {
    id: primaryKey(Number),
    name: String,
    description: String,
    githubUrl: String,
    demoUrl: nullable(String),
    techStack: String,
    imageUrl: nullable(String),
    articleId: nullable(Number), // Optional link to related article
    order: Number, // Display order on projects list
  },
};

export const db = factory(models);

export type Model = keyof typeof models;

const dbFilePath = 'mocked-db.json';

/**
 * Load data from persistent storage.
 *
 * Browser: Reads from localStorage key 'msw-db'.
 * Node.js: Reads from 'mocked-db.json' file.
 *
 * Returns: Parsed object with model keys and data, or empty object if not found.
 * On Node.js, auto-creates empty file if missing (for first-run setup).
 */
/**
 * Load data from persistent storage.
 *
 * Browser: Reads from localStorage key 'msw-db'.
 * Node.js: Reads from 'mocked-db.json' file.
 *
 * Returns: Parsed object with model keys and data, or empty object if not found.
 * On Node.js, auto-creates empty file if missing (for first-run setup).
 */
export const loadDb = async () => {
  // If we are running in a Node.js environment
  if (typeof window === 'undefined') {
    const { readFile, writeFile } = await import('fs/promises');
    try {
      const data = await readFile(dbFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error?.code === 'ENOENT') {
        const emptyDB = {};
        await writeFile(dbFilePath, JSON.stringify(emptyDB, null, 2));
        return emptyDB;
      } else {
        console.error('Error loading mocked DB:', error);
        return null;
      }
    }
  }
  // If we are running in a browser environment
  return Object.assign(
    JSON.parse(window.localStorage.getItem('msw-db') || '{}'),
  );
};

/**
 * Save data to persistent storage.
 *
 * Browser: Writes to localStorage key 'msw-db'.
 * Node.js: Writes to 'mocked-db.json' file.
 *
 * Called after model mutations (create, update, delete) to ensure
 * data survives page refreshes or test reruns.
 */
export const storeDb = async (data: string) => {
  // If we are running in a Node.js environment
  if (typeof window === 'undefined') {
    const { writeFile } = await import('fs/promises');
    await writeFile(dbFilePath, data);
  } else {
    // If we are running in a browser environment
    window.localStorage.setItem('msw-db', data);
  }
};

/**
 * Persist a specific model to storage after mutations.
 *
 * Usage (in handlers):
 *   db.article.create({ ... });
 *   await persistDb('article');
 *
 * Skips in test mode (NODE_ENV === 'test') to keep tests isolated.
 * Retrieves full model from in-memory db, merges with existing stored data,
 * and saves back to storage.
 */
export const persistDb = async (model: Model) => {
  if (process.env.NODE_ENV === 'test') return;
  const data = await loadDb();
  data[model] = db[model].getAll();
  await storeDb(JSON.stringify(data));
};

/**
 * Initialize the mock database.
 *
 * Three scenarios:
 *
 * 1. Seed version mismatch or missing version
 *    - Detects that seed-data.ts has been updated (SEED_VERSION changed).
 *    - Clears in-memory db and reseeds from fresh data.
 *    - Persists all models with new version.
 *    - Useful for auto-reseeding on seed file changes.
 *
 * 2. Stored data exists and version matches
 *    - Populates in-memory db from persisted data.
 *    - Respects existing state across page reloads.
 *
 * 3. Database is empty (no categories found)
 *    - Seeds database with default test data.
 *    - Persists with version.
 *
 * Called during app bootstrap (before rendering) to ensure consistent state.
 */
export const initializeDb = async () => {
  const database: Record<string, any> = (await loadDb()) || {};
  const { seedDatabase, SEED_VERSION } = await import('./seed-data');

  const currentVersion = database.__version;
  const versionChanged = !currentVersion || currentVersion !== SEED_VERSION;

  if (versionChanged) {
    // Clear in-memory db and reseed
    Object.values(db).forEach((model: any) => {
      model.deleteMany({ where: {} });
    });
    seedDatabase();

    // Persist all models with new version
    const data: Record<string, any> = {};
    Object.keys(models).forEach((key) => {
      data[key] = db[key as Model].getAll();
    });
    data.__version = SEED_VERSION;
    await storeDb(JSON.stringify(data, null, 2));
    return;
  }

  // Populate in-memory db from persisted data
  Object.keys(models).forEach((key) => {
    const dataEntries = database[key];
    if (dataEntries) {
      dataEntries.forEach((entry: Record<string, any>) => {
        db[key as Model].create(entry);
      });
    }
  });

  // If database is empty (no categories), seed and persist with version
  if (db.category.count() === 0) {
    seedDatabase();
    const data: Record<string, any> = {};
    Object.keys(models).forEach((key) => {
      data[key] = db[key as Model].getAll();
    });
    data.__version = SEED_VERSION;
    await storeDb(JSON.stringify(data, null, 2));
  }
};

/**
 * Reset the database to empty state.
 *
 * Browser: Clears localStorage key 'msw-db'.
 * Node.js: Overwrites 'mocked-db.json' with empty object.
 *
 * Next initialize will trigger a reseed from seed-data.ts.
 * Useful for manual testing resets or test cleanup.
 */

export const resetDb = async () => {
  if (typeof window === 'undefined') {
    const { writeFile } = await import('fs/promises');
    await writeFile(dbFilePath, JSON.stringify({}, null, 2));
  } else {
    window.localStorage.removeItem('msw-db');
  }
};

// Optional: expose a dev helper to reset and reload
declare global {
  interface Window {
    __resetMswDb?: () => Promise<void>;
  }
}

if (typeof window !== 'undefined') {
  window.__resetMswDb = async () => {
    await resetDb();
    window.location.reload();
  };
}
