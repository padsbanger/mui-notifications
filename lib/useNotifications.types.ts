import * as React from "react";

export interface ShowNotificationOptions {
  key?: string;
  severity?: "info" | "warning" | "error" | "success";
  autoHideDuration?: number | null;
  actionText?: React.ReactNode;
  onAction?: () => void;
}

export interface ShowNotification {
  (message: React.ReactNode, options?: ShowNotificationOptions): string;
}

export interface CloseNotification {
  (key: string): void;
}

export interface CloseAllNotifications {
  (): void;
}

export interface UseNotifications {
  show: ShowNotification;
  close: CloseNotification;
  closeAll: CloseAllNotifications;
}
