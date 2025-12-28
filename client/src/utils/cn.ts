/**
 * @module utils/cn
 * @description Combines `clsx` for conditional class handling with `tailwind-merge` to resolve
 * Tailwind CSS class conflicts. Used for component styling where multiple class sources
 * may define the same Tailwind utility (e.g., padding, margin, colors).
 *
 * Functionality:
 * - **Conditional classes**: Handles objects, arrays, and falsy values via `clsx`
 * - **Conflict resolution**: Ensures only the last Tailwind class wins (e.g., `p-4 p-6` → `p-6`)
 * - **Type safety**: Accepts `ClassValue` union type (string, object, array, etc.)
 *
 * Usage:
 * Used throughout the component library (Button, Spinner, ContentLayout, etc.) to merge:
 * - Base component styles
 * - Variant-specific styles
 * - User-provided className props
 *
 * @example
 * // Conditional classes
 * cn('btn', isActive && 'btn-active', { 'btn-disabled': disabled })
 * // Result: "btn btn-active" or "btn btn-disabled"
 *
 * @example
 * // Tailwind conflict resolution
 * cn('p-4 text-red-500', className)
 * // If className = 'p-6 text-blue-500', result: "p-6 text-blue-500"
 * // (Last padding and text color wins)
 *
 * @example
 * // Real usage in Button component
 * <button className={cn(buttonVariants({ variant, size }), className)} />
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to combine class names with Tailwind CSS and handle conflicts.
 *
 * Merges multiple class name inputs using `clsx` for conditional logic, then applies
 * `tailwind-merge` to deduplicate and resolve Tailwind utility class conflicts.
 *
 * @param {...ClassValue} inputs - Variable number of class values (strings, objects, arrays, etc.).
 * @returns {string} Merged and deduplicated class string safe for `className` props.
 *
 * @example
 * // Basic usage
 * cn('btn', 'btn-primary')
 * // → "btn btn-primary"
 *
 * @example
 * // With conditionals
 * cn('btn', isActive && 'active', { disabled: !enabled })
 * // → "btn active" or "btn disabled"
 *
 * @example
 * // Tailwind conflict resolution (padding override)
 * cn('p-4 text-sm', 'p-6')
 * // → "text-sm p-6" (last padding wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
