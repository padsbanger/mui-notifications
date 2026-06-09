import * as React from "react";

import type { SnackbarOrigin, SnackbarProps } from "@mui/material";

import type { ShowNotificationOptions } from "./useNotifications.types";

export interface NotificationsProviderSlotProps {
  snackbar: SnackbarProps;
}

export interface NotificationsProviderSlots {
  snackbar: React.ElementType;
}

export interface NotificationsProviderProps {
  children?: React.ReactNode;
  anchorOrigin?: SnackbarOrigin;
  defaultAutoHideDuration?: ShowNotificationOptions["autoHideDuration"];
  defaultSeverity?: ShowNotificationOptions["severity"];
  maxSnack?: number;
  slots?: Partial<NotificationsProviderSlots>;
  slotProps?: Partial<NotificationsProviderSlotProps>;
}

export interface NotificationProps {
  notificationKey: string;
  anchorOrigin: SnackbarOrigin;
  badge: string | null;
  open: boolean;
  message: React.ReactNode;
  options: ShowNotificationOptions;
}

export interface NotificationQueueEntry {
  notificationKey: string;
  options: ShowNotificationOptions;
  open: boolean;
  message: React.ReactNode;
}

export interface NotificationsState {
  queue: NotificationQueueEntry[];
}

export interface NotificationsProps {
  anchorOrigin: SnackbarOrigin;
  maxSnack: number;
  state: NotificationsState;
}
