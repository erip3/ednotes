/**
 * Provides a Mock Service Worker server for Node environments (Vitest/Jest).
 * Lets tests run against deterministic mock APIs without a real backend.
 *
 * Integration:
 * - Exported `server` is started in test setup (e.g., `testing/setup-tests.ts`).
 * - Uses the same handlers as the browser worker (`testing/mocks/handlers`).
 * - Persists mock data to `client/mocked-db.json` when not in `NODE_ENV='test'`.
 *
 * Typical test setup (Vitest/Jest):
 *   import { server } from '@/testing/mocks/server';
 *   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
 *   afterEach(() => server.resetHandlers());
 *   afterAll(() => server.close());
 *
 * Handlers & Data
 * - Define API handlers in `testing/mocks/handlers/index.ts`.
 * - Handlers can read/write mock data via `testing/mocks/db.ts` (`@mswjs/data`).
 */
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
