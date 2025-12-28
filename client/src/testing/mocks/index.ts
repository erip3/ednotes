/**
 * Starts the Mock Service Worker (MSW) in the browser and initializes the
 * mock database before your app renders. Central entry to enable mocking in dev.
 *
 * Integration:
 * - Called from app bootstrap (e.g., `main.tsx`) before rendering.
 * - Loads the MSW browser worker from `testing/mocks/browser.ts`.
 * - Initializes data via `testing/mocks/db.ts` (localStorage in browser).
 */
import { env } from '@/config/env';

export const enableMocking = async () => {
  if (env.ENABLE_API_MOCKING) {
    const { worker } = await import('./browser');
    const { initializeDb } = await import('./db');
    await initializeDb();
    return worker.start();
  }
};
