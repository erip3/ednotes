/**
 * @module stores/theme-store
 * @description Zustand store for managing theme state (light/dark mode) with localStorage persistence.
 *
 * Features:
 * - Persists theme preference to localStorage
 * - Defaults to dark if no stored preference
 * - Provides global theme state accessible from any component
 *
 * @example
 * // In a component to read theme
 * const { theme } = useThemeStore();
 *
 * @example
 * // In a component to toggle theme
 * const { toggleTheme } = useThemeStore();
 * <button onClick={toggleTheme}>Toggle Theme</button>
 */

import { create } from 'zustand';

/**
 * State shape for theme management
 * @interface ThemeState
 */
type ThemeState = {
  /** Current theme: 'light' or 'dark' */
  theme: 'light' | 'dark';
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void;
};

/**
 * Get initial theme from localStorage or system preference.
 *
 * Checks localStorage for a stored theme preference. If not found,
 * defaults to 'dark'.
 *
 * @returns The initial theme ('light' or 'dark')
 *
 * @remarks
 * - localStorage key is 'theme'
 * - Default is 'dark' when no stored preference is found
 */
const getInitialTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;

  // Default to dark if no stored preference exists
  return 'dark';
};

/**
 * Zustand hook for accessing and managing global theme state.
 *
 * Provides reactive theme state and toggle function. Changes persist
 * to localStorage automatically. Use in any component to read or modify
 * the application's theme.
 *
 * @returns Theme store with current theme and toggleTheme function
 *
 * @remarks
 * - State is initialized on first access (lazy initialization)
 * - Theme preference persists across browser sessions
 * - Changes to theme should trigger CSS class updates on document root
 *
 * @example
 * // Read current theme
 * const { theme } = useThemeStore();
 * console.log(`Current theme: ${theme}`);
 *
 * @example
 * // Toggle theme
 * const { toggleTheme } = useThemeStore();
 * <button onClick={toggleTheme}>Switch Theme</button>
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    localStorage.setItem('theme', newTheme);
  },
}));
