/**
 * Initializes Mock Service Worker (MSW) in the browser so your app can use
 * realistic, deterministic mock APIs during development and Storybook.
 * Central place to register HTTP request handlers defined under
 * `testing/mocks/handlers`.
 *
 * Integration:
 * - This file exports a singleton `worker` created with all handlers.
 * - The worker is started from `testing/mocks/index.ts` via `enableMocking()`
 *   to avoid double-start warnings and keep startup logic in one place.
 *
 * Usage:
 * - Development: Work without the backend and still exercise API flows.
 * - Storybook: Provide stable data for components/pages.
 */

import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

// Create a browser Service Worker client with all request handlers.
export const worker = setupWorker(...handlers);
