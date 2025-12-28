/**
 * @module components/ui/notifications/notifications
 * @description Subscribes to the notifications store and renders each `Notification` component
 * in a portal-like fixed container. Uses `aria-live="assertive"` to announce updates.
 *
 * Layout:
 * - Fixed, pointer-events-none wrapper that positions notifications overlay
 * - Stacks notifications with spacing and responsive alignment
 * - Individual cards are interactive (`pointer-events-auto` inside each)
 *
 * @example
 * const { addNotification } = useNotifications();
 * addNotification({ type: 'info', title: 'Heads up', message: 'This is a notice.' });
 * // Container will render the new notification automatically
 */
import { Notification } from './notification';

import { useNotifications } from '@/stores/notifications-store';

/**
 * Notifications overlay rendering the current store items.
 *
 * @returns {JSX.Element} Fixed overlay containing notification cards.
 * @remarks
 * - Uses `aria-live="assertive"` so screen readers announce changes immediately
 * - The outer container disables pointer events to avoid intercepting clicks;
 *   each notification card re-enables pointer events for its own interactions
 */
export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end space-y-4 px-4 py-6 sm:items-start sm:p-6"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};
