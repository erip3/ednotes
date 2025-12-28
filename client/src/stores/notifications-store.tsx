/**
 * @module components/ui/notifications/notifications-store
 * @description Provides a lightweight, global store for notifications with helpers to add
 * and dismiss messages. Each notification is assigned a unique id via `nanoid`.
 *
 * Features:
 * - **Add notifications**: Push new items with type, title, optional message
 * - **Dismiss notifications**: Remove by id
 * - **Typed store**: Strongly typed notification shape and store methods
 *
 * @example
 * const { addNotification, dismissNotification } = useNotifications();
 * addNotification({ type: 'success', title: 'Saved', message: 'Changes persisted.' });
 * // Later
 * dismissNotification(id);
 */
import { nanoid } from 'nanoid';
import { create } from 'zustand';

/**
 * Notification item shape.
 */
export type Notification = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message?: string;
};

/**
 * Zustand store shape for notifications.
 */
type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
};

/**
 * Global notifications store.
 *
 * @returns Zustand hook providing notification list and actions.
 * @remarks
 * - `addNotification` auto-generates a unique `id` via `nanoid`
 * - `dismissNotification` filters the list to remove the matching id
 */
export const useNotifications = create<NotificationsStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: nanoid(), ...notification },
      ],
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
}));
