/**
 * @module config/env
 * @description Loads and validates environment variables at runtime using Zod schema validation.
 * Only variables prefixed with `VITE_APP_` (Vite convention) are considered. Provides type-safe
 * access to configuration with sensible defaults and early error reporting.
 *
 * Environment variables:
 * - `VITE_APP_API_URL`: Backend API base URL (default: `/api`)
 * - `VITE_APP_ENABLE_API_MOCKING`: Enable MSW mocking as string 'true'/'false' (optional)
 * - `VITE_APP_APP_URL`: Frontend base URL (default: `http://localhost:5173`)
 * - `VITE_APP_MOCK_API_PORT`: Mock server port (default: `8080`)
 *
 * @example
 * import { env } from '@/config/env';
 * fetch(`${env.API_URL}/data`);
 */
import * as z from 'zod';

/**
 * Creates and validates the environment configuration.
 *
 * Extracts `VITE_APP_*` prefixed variables from Vite's `import.meta.env` (or `process.env`
 * in Node contexts), strips the prefix, and validates against a Zod schema.
 * Throws immediately if validation fails with a detailed error message listing missing/invalid vars.
 *
 * @returns {Object} Validated environment object with API_URL, ENABLE_API_MOCKING, APP_URL, APP_MOCK_API_PORT.
 * @throws {Error} If environment variables fail schema validation.
 *
 * @remarks
 * - Only `VITE_APP_*` prefixed variables are processed (Vite convention)
 * - String values like 'true'/'false' for `ENABLE_API_MOCKING` are coerced to booleans
 * - Defaults are provided for optional vars to ensure safe fallbacks
 * - Called once at module load; throws synchronously if invalid
 */
const createEnv = () => {
  /**
   * Zod schema for environment validation.
   * Defines expected shape, types, coercions, and defaults.
   */
  const EnvSchema = z.object({
    // Base URL for backend
    API_URL: z.string().default('/api'),

    /**
     * Whether to enable API mocking (e.g., with MSW).
     * Should be the string 'true' or 'false'.
     * Will be transformed to a boolean.
     * Optional: if not set, will be undefined.
     */
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),

    // Base URL for frontend
    APP_URL: z.string().optional().default('http://localhost:5173'),

    // Port to use for the mock API server (if applicable)
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
  });

  // Extract VITE_APP_* variables from import.meta.env (Vite) or process.env (Node.js)
  const rawEnv =
    typeof import.meta.env !== 'undefined' ? import.meta.env : process.env;

  const envVars = Object.entries(rawEnv).reduce<Record<string, string>>(
    (acc, curr) => {
      const [key, value] = curr;
      if (key.startsWith('VITE_APP_')) {
        acc[key.replace('VITE_APP_', '')] = String(value);
      }
      return acc;
    },
    {},
  );

  // Validate and parse the environment variables
  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}
`,
    );
  }

  return parsedEnv.data;
};

/**
 * Validated environment configuration exported for use throughout the app.
 * Throws synchronously during module initialization if validation fails.
 */
export const env = createEnv();
