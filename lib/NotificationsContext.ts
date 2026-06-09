import * as React from "react";

import type { NotificationsContextValue } from "./NotificationsContext.types";

export const NotificationsContext =
  React.createContext<NotificationsContextValue | null>(null);
