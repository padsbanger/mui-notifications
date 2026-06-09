import type { UseNotifications } from "./useNotifications.types";

let serverNotificationCounter = 0;

export const serverNotifications: UseNotifications = {
  show: (_message, options) => {
    if (options?.key) {
      return options.key;
    }

    serverNotificationCounter += 1;

    return `server-notification-${serverNotificationCounter}`;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  close: (_key) => {},
  closeAll: () => {},
};
