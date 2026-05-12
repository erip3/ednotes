/**
 * @module lib/api-client
 * @description HTTP client configuration and interceptors for API communication
 *
 * This module sets up an Axios instance with global interceptors for:
 * - Request handling: Sets authentication headers and credentials
 * - Response handling: Extracts data and displays error notifications
 *
 * The API client handles:
 * - Adding Accept headers to all requests
 * - Enabling credentials (cookies) for cross-origin requests
 * - Showing error notifications to users
 * - Extracting response.data from all successful responses
 *
 * @example
 * import { api } from '@/lib/api-client';
 * const data = await api.get('/articles/1');
 */

import Axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';

/**
 * HTTP error classification utility
 * Distinguishes between network errors, client errors (4xx), and server errors (5xx)
 */
type ErrorType = 'network' | 'client' | 'server' | 'unknown';

/**
 * Shape of error response data from the API
 */
interface ErrorResponse {
  message?: string;
  [key: string]: unknown;
}

/**
 * Classifies error type based on HTTP status or error characteristics
 * @param error - Axios error object
 * @returns Classification of the error type
 */
function getErrorType(error: AxiosError<ErrorResponse>): ErrorType {
  if (!error.response) {
    return 'network';
  }
  const status = error.response.status;
  if (status >= 400 && status < 500) {
    return 'client';
  }
  if (status >= 500) {
    return 'server';
  }
  return 'unknown';
}

/**
 * Extracts user-friendly error message based on error type and response
 * @param error - Axios error object
 * @returns Appropriate error message for the error type
 *
 * @remarks
 * - Network errors: "Network error. Please check your connection."
 * - Client errors (4xx): Server-provided message or generic message
 * - Server errors (5xx): "Server error. Please try again later."
 * - Unknown: Generic error message
 */
function getErrorMessage(error: AxiosError<ErrorResponse>): string {
  const errorType = getErrorType(error);

  switch (errorType) {
    case 'network':
      return 'Network error. Please check your connection and try again.';
    case 'client':
      return (
        error.response?.data?.message ||
        'Request failed. Please check your input and try again.'
      );
    case 'server':
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

/**
 * Determines if an error is retryable based on error type
 * @param error - Axios error object
 * @returns True if the request should be retried
 *
 * @remarks
 * - Network errors are retryable (temporary connectivity issues)
 * - 5xx server errors are retryable (server temporarily unavailable)
 * - 4xx client errors are NOT retryable (request is malformed)
 */
function isRetryableError(error: AxiosError<ErrorResponse>): boolean {
  const errorType = getErrorType(error);
  return errorType === 'network' || errorType === 'server';
}

/**
 * Configures request headers and authentication for API requests
 *
 * This interceptor:
 * - Sets Accept header to application/json on all requests
 * - Enables withCredentials to include cookies in cross-origin requests
 *
 * @param config - Axios request configuration object
 * @returns Updated Axios request configuration with headers and credentials set
 *
 * @remarks
 * Credentials (cookies) are required for authentication when making cross-origin requests.
 * The Accept header ensures the server knows we expect JSON responses.
 */
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

/**
 * Axios instance configured with the API base URL and request timeout
 *
 * Configuration:
 * - baseURL: Loaded from environment variables (env.API_URL)
 * - timeout: 10 second timeout for all requests (prevents hanging)
 *
 * @remarks
 * All methods called on this instance will be prefixed with the base URL.
 * Requests exceeding 10 seconds will be automatically cancelled.
 */
export const api = Axios.create({
  baseURL: env.API_URL,
  timeout: 10000, // 10 second timeout
});

/**
 * Enable request/response logging in development mode
 * Logs all HTTP requests and responses for debugging
 */
if (import.meta.env.MODE === 'development') {
  // Request logging
  api.interceptors.request.use((config) => {
    console.debug('[API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });
    return config;
  });

  // Response logging
  api.interceptors.response.use(
    (response) => {
      console.debug('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.debug('[API Error]', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
      return Promise.reject(error);
    },
  );
}

/**
 * Request interceptor: Adds authentication headers and enables credentials
 * Automatically applied to all outgoing requests
 */
api.interceptors.request.use(authRequestInterceptor);

/**
 * Response interceptor: Extracts response data and handles errors with detailed classification
 *
 * Success path:
 * - Extracts response.data to simplify consumer code
 * - Returns just the data, not the full response object
 * - Preserves HTTP status code in response headers if needed
 *
 * Error path:
 * - Classifies error type (network, client, server, or unknown)
 * - Generates user-friendly error message based on error type
 * - Shows error notification to user via notification store
 * - Includes HTTP status code and original error for debugging
 * - Rejects promise with enriched error object
 *
 * @remarks
 * All successful API calls return just the data (e.g., Article | { data: Article[] })
 * rather than the full Axios response object.
 * Error objects include status, errorType, and retryable flag for downstream handling.
 */
api.interceptors.response.use(
  // On success, return the response data
  (response) => {
    return response.data;
  },
  // On error, classify error and show appropriate notification
  (error: AxiosError<ErrorResponse>) => {
    const errorType = getErrorType(error);
    const message = getErrorMessage(error);
    const status = error.response?.status;
    const retryable = isRetryableError(error);

    // Show user-friendly error notification
    useNotifications.getState().addNotification({
      type: 'error',
      title: status ? `Error ${status}` : 'Error',
      message,
    });

    // Reject with enriched error object for downstream handling
    const enrichedError = new Error(message);
    Object.assign(enrichedError, {
      originalError: error,
      status,
      errorType,
      retryable,
    });

    return Promise.reject(enrichedError);
  },
);
