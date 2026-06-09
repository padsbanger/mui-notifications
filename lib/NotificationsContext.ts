import * as React from "react";

import type {
  CloseAllNotifications,
  CloseNotification,
  ShowNotification,
} from "./useNotifications";

export interface NotificationsContextValue {
  show: ShowNotification;
  close: CloseNotification;
  closeAll: CloseAllNotifications;
}

export const NotificationsContext =
  React.createContext<NotificationsContextValue | null>(null);
