import * as React from 'react';

/**
 * Custom hook to manage the open/closed state of a component.
 * @param initial - Initial open state
 * @returns An object containing the open/closed state and functions to toggle it
 */
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = React.useState(initial);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle };
};
