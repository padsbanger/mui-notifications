import type {
  CloseAllNotifications,
  CloseNotification,
  ShowNotification,
} from "./useNotifications.types";

export interface NotificationsContextValue {
  show: ShowNotification;
  close: CloseNotification;
  closeAll: CloseAllNotifications;
}
