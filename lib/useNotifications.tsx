import * as React from "react";

import { NotificationsContext } from "./NotificationsContext";
import { serverNotifications } from "./useNotifications.consts";
import type { UseNotifications } from "./useNotifications.types";

export type {
  CloseAllNotifications,
  CloseNotification,
  ShowNotification,
  ShowNotificationOptions,
  UseNotifications,
} from "./useNotifications.types";

export function useNotifications(): UseNotifications {
  const context = React.useContext(NotificationsContext);

  if (context) {
    return context;
  }

  return serverNotifications;
}
