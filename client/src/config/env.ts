import * as z from 'zod';

/**
 * Reads and validates environment variables for the app.
 * - Only variables prefixed with VITE_APP_ are considered.
 * - Uses zod for schema validation and type safety.
 */
const createEnv = () => {
  // Define the expected environment variables and their types/defaults
  const EnvSchema = z.object({
    // Base URL for your backend API
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

  // Extract VITE_APP_* variables from import.meta.env
  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

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

// Export the validated environment variables
export const env = createEnv();
