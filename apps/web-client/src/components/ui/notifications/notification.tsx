/**
 * @module components/ui/notifications/notification
 * @description Renders a visually distinct notification card with an icon based on type,
 * accessible labeling, and a dismiss button that calls back to the notifications store.
 *
 * Features:
 * - **Type-based icons**: Info, success, warning, error
 * - **Dismiss control**: Calls `onDismiss(id)` to remove from the store
 * - **Responsive**: Layout adjusts alignment between mobile and larger screens
 *
 * @example
 * <Notification
 *   notification={{ id: '1', type: 'success', title: 'Saved!', message: 'Your changes were saved.' }}
 *   onDismiss={(id) => console.log('dismiss', id)}
 * />
 */
import { Info, CircleAlert, CircleX, CircleCheck } from 'lucide-react';

const icons = {
  info: <Info className="size-6 text-blue-500" aria-hidden="true" />,
  success: <CircleCheck className="size-6 text-green-500" aria-hidden="true" />,
  warning: (
    <CircleAlert className="size-6 text-yellow-500" aria-hidden="true" />
  ),
  error: <CircleX className="size-6 text-red-600" aria-hidden="true" />,
};

export type NotificationProps = {
  notification: {
    id: string;
    type: keyof typeof icons;
    title: string;
    message?: string;
  };
  onDismiss: (id: string) => void;
};

/**
 * Notification card component for a single message.
 *
 * Displays an icon based on `type`, a title, optional message, and a close button. The
 * component is wrapped to align properly within the `Notifications` container and uses
 * semantic roles and labels for accessibility.
 *
 * @param {NotificationProps} props - Notification data and dismiss callback.
 * @returns {JSX.Element} Styled notification card with dismiss control.
 *
 * @remarks
 * - The close button calls `onDismiss(id)` to remove the notification
 * - Uses `role="alert"` and `aria-label` to announce the notification
 * - Icons are decorative (`aria-hidden="true"`) and not announced
 */
export const Notification = ({
  notification: { id, type, title, message },
  onDismiss,
}: NotificationProps) => {
  return (
    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
        <div className="p-4" role="alert" aria-label={title}>
          <div className="flex items-start">
            <div className="shrink-0">{icons[type]}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
            <div className="ml-4 flex shrink-0">
              <button
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                onClick={() => {
                  onDismiss(id);
                }}
              >
                <span className="sr-only">Close</span>
                <CircleX className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
