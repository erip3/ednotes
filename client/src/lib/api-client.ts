import Axios, { type InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';

/**
 * Auth request interceptor adds authentication headers to requests.
 * @param config - Axios request configuration
 * @returns Updated Axios request configuration
 */
function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

// Create an Axios instance with base URL from environment variables
export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor); // Add request interceptor

// Add response interceptor to handle responses and errors globally
api.interceptors.response.use(
  // On success, return the response data
  (response) => {
    return response.data;
  },
  // On error, show a notification and reject the promise
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    return Promise.reject(error);
  },
);
