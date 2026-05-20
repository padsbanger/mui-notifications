import * as React from "react";

import { NotificationsContext } from "./NotificationsContext";

export interface ShowNotificationOptions {
  key?: string;
  severity?: "info" | "warning" | "error" | "success";
  autoHideDuration?: number;
  actionText?: React.ReactNode;
  onAction?: () => void;
}

export interface ShowNotification {
  (message: React.ReactNode, options?: ShowNotificationOptions): string;
}

export interface CloseNotification {
  (key: string): void;
}

interface UseNotifications {
  show: ShowNotification;
  close: CloseNotification;
}

let serverNotificationCounter = 0;

const serverNotifications: UseNotifications = {
  show: (_message, options) => {
    if (options?.key) {
      return options.key;
    }

    serverNotificationCounter += 1;

    return `server-notification-${serverNotificationCounter}`;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  close: (_key) => {},
};

export function useNotifications(): UseNotifications {
  const context = React.useContext(NotificationsContext);

  if (context) {
    return context;
  }

  return serverNotifications;
}
