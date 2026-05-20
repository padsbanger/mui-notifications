import * as React from "react";

import type { CloseNotification, ShowNotification } from "./useNotifications";

export interface NotificationsContextValue {
  show: ShowNotification;
  close: CloseNotification;
}

export const NotificationsContext =
  React.createContext<NotificationsContextValue | null>(null);
