/**
 * @module components/ui/header
 * @description Provides a navigation bar across the application with back/home
 * navigation buttons and a theme toggle button. Integrates with the theme store to manage
 * light/dark mode switching and displays appropriate icons for the current theme.
 *
 * Functionality:
 * - **Navigation controls**: Back and home buttons
 * - **Theme toggle**: Sun/moon icon button that switches between light and dark modes
 * - **State management**: Reads theme from Zustand store and updates on toggle
 * - **Responsive**: Fixed height header with flexbox layout and consistent spacing
 *
 * @example
 * // Used in ContentLayout with navigation handlers
 * <Header onBack={handleBack} onHome={handleHome} />
 *
 * @example
 * // Simple usage with default behavior
 * <Header />
 */

import {
  HomeIcon,
  ArrowLeftIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';

import { Button } from '../button/button';

import { useThemeStore } from '@/stores/theme-store';

/**
 * Props for the Header component.
 */
export type HeaderProps = {
  /** Optional callback function triggered when the home button is clicked. */
  onHome?: () => void;
  /** Optional callback function triggered when the back button is clicked. */
  onBack?: () => void;
};

/**
 * Global header component with navigation controls and theme toggle.
 *
 * Renders a fixed-height header bar with:
 * - Back button (left): Navigates to previous page or parent category
 * - Home button (left): Navigates to home page
 * - Theme toggle (right): Switches between light and dark modes
 *
 * Features:
 * - **Flexible navigation**: Optional onHome/onBack handlers for routing
 * - **Theme integration**: Automatic icon updates based on current theme
 * - **Consistent styling**: Ghost button variants with icon-only display
 * - **Border separation**: Bottom border separates header from content
 *
 * @param {HeaderProps} props - Header configuration with navigation handlers.
 * @returns {JSX.Element} Header bar with navigation and theme controls.
 *
 * @remarks
 * - Theme state is read from useThemeStore which initializes from localStorage
 * - Navigation handlers are optional; buttons still render but may do nothing
 * - Uses justify-between to position navigation (left) and theme (right)
 * - Fixed h-14 height (56px) provides consistent header sizing
 *
 * @example
 * // With custom navigation (ContentLayout pattern)
 * const handleBack = () => navigate(-1);
 * const handleHome = () => navigate('/');
 * <Header onBack={handleBack} onHome={handleHome} />
 *
 * @example
 * // Without handlers (buttons render but do nothing)
 * <Header />
 */
export const Header = ({ onHome, onBack }: HeaderProps) => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-marginal-border bg-marginal-background px-4">
      <div className="flex gap-x-2">
        <Button
          variant="ghost"
          size="icon"
          icon={<ArrowLeftIcon />}
          onClick={onBack}
        />
        <Button
          variant="ghost"
          size="icon"
          icon={<HomeIcon />}
          onClick={onHome}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      />
    </header>
  );
};
