"use client";
import * as React from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Badge,
  Box,
  Button,
  CloseReason,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
  type SnackbarOrigin,
  type SnackbarProps,
} from "@mui/material";
import useSlotProps from "@mui/utils/useSlotProps";

import { NotificationsContext } from "./NotificationsContext";
import {
  DEFAULT_ANCHOR_ORIGIN,
  STACKED_SNACKBAR_SX,
} from "./NotificationsProvider.consts";
import type {
  NotificationProps,
  NotificationsProps,
  NotificationsProviderProps,
  NotificationsState,
} from "./NotificationsProvider.types";
import useNonNullableContext from "./useNonNullableContext";
import type {
  CloseAllNotifications,
  CloseNotification,
  ShowNotification,
  ShowNotificationOptions,
} from "./useNotifications";

export type {
  NotificationsProviderProps,
  NotificationsProviderSlotProps,
  NotificationsProviderSlots,
} from "./NotificationsProvider.types";

const RootPropsContext = React.createContext<NotificationsProviderProps | null>(
  null,
);

function Notification({
  notificationKey,
  anchorOrigin,
  open,
  message,
  options,
  badge,
}: NotificationProps) {
  const { close } = useNonNullableContext(NotificationsContext);

  const { severity, actionText, onAction, autoHideDuration } = options;

  const handleClose = React.useCallback(
    (_event: unknown, reason?: CloseReason | SnackbarCloseReason) => {
      if (reason === "clickaway") {
        return;
      }
      close(notificationKey);
    },
    [notificationKey, close],
  );

  const action = (
    <React.Fragment>
      {onAction ? (
        <Button color="inherit" size="small" onClick={onAction}>
          {actionText ?? "Action"}
        </Button>
      ) : null}
      <IconButton
        size="small"
        aria-label={"Close"}
        title={"Close"}
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const props = React.useContext(RootPropsContext);
  const SnackbarComponent = props?.slots?.snackbar ?? Snackbar;
  const externalSnackbarSlotProps = props?.slotProps?.snackbar ?? {};
  const externalSnackbarSx = externalSnackbarSlotProps.sx;
  const snackbarExternalSlotProps = { ...externalSnackbarSlotProps };
  delete snackbarExternalSlotProps.anchorOrigin;
  delete snackbarExternalSlotProps.sx;
  const snackbarSlotProps = useSlotProps({
    elementType: SnackbarComponent,
    ownerState: props,
    externalSlotProps: snackbarExternalSlotProps,
    additionalProps: {
      open,
      anchorOrigin,
      autoHideDuration,
      onClose: handleClose,
      action,
      sx: mergeSx(STACKED_SNACKBAR_SX, externalSnackbarSx),
    },
  });

  return (
    <SnackbarComponent key={notificationKey} {...snackbarSlotProps}>
      <Badge badgeContent={badge} color="primary" sx={{ width: "100%" }}>
        {severity ? (
          <Alert severity={severity} sx={{ width: "100%" }} action={action}>
            {message}
          </Alert>
        ) : (
          <SnackbarContent message={message} action={action} />
        )}
      </Badge>
    </SnackbarComponent>
  );
}

function mergeSx(
  internalSx: NonNullable<SnackbarProps["sx"]>,
  externalSx: SnackbarProps["sx"],
): SnackbarProps["sx"] {
  if (!externalSx) {
    return internalSx;
  }

  return [
    internalSx,
    ...(Array.isArray(externalSx) ? externalSx : [externalSx]),
  ] as SnackbarProps["sx"];
}

function getStackSx(anchorOrigin: SnackbarOrigin): SnackbarProps["sx"] {
  const horizontalPosition =
    anchorOrigin.horizontal === "center"
      ? {
          left: { xs: 1, sm: "50%" },
          right: { xs: 1, sm: "auto" },
          transform: { xs: "none", sm: "translateX(-50%)" },
          alignItems: "center",
        }
      : {
          [anchorOrigin.horizontal]: { xs: 1, sm: 3 },
          [anchorOrigin.horizontal === "left" ? "right" : "left"]: {
            xs: 1,
            sm: "auto",
          },
          alignItems:
            anchorOrigin.horizontal === "left" ? "flex-start" : "flex-end",
        };

  return {
    position: "fixed",
    zIndex: (theme) => theme.zIndex.snackbar,
    display: "flex",
    flexDirection: anchorOrigin.vertical === "top" ? "column" : "column-reverse",
    gap: 1,
    pointerEvents: "none",
    maxWidth: { xs: "calc(100% - 16px)", sm: "calc(100% - 48px)" },
    [anchorOrigin.vertical]: { xs: 1, sm: 3 },
    ...horizontalPosition,
  };
}

function getMaxSnack(maxSnack: number | undefined) {
  if (!maxSnack || !Number.isFinite(maxSnack)) {
    return 1;
  }

  return Math.max(1, Math.floor(maxSnack));
}

function getAnchorOrigin(props: NotificationsProviderProps): SnackbarOrigin {
  return (
    props.anchorOrigin ??
    props.slotProps?.snackbar?.anchorOrigin ??
    DEFAULT_ANCHOR_ORIGIN
  );
}

function getDefaultShowOptions(
  defaultSeverity: NotificationsProviderProps["defaultSeverity"],
  defaultAutoHideDuration: NotificationsProviderProps["defaultAutoHideDuration"],
): ShowNotificationOptions {
  return {
    ...(defaultSeverity !== undefined ? { severity: defaultSeverity } : null),
    ...(defaultAutoHideDuration !== undefined
      ? { autoHideDuration: defaultAutoHideDuration }
      : null),
  };
}

function Notifications({ anchorOrigin, maxSnack, state }: NotificationsProps) {
  const visibleNotifications = state.queue.slice(0, maxSnack);

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <Box sx={getStackSx(anchorOrigin)}>
      {visibleNotifications.map((notification, index) => (
        <Notification
          {...notification}
          anchorOrigin={anchorOrigin}
          badge={
            state.queue.length > visibleNotifications.length &&
            index === visibleNotifications.length - 1
              ? String(state.queue.length)
              : null
          }
          key={notification.notificationKey}
        />
      ))}
    </Box>
  );
}

let nextId = 0;
const generateId = () => {
  const id = nextId;
  nextId += 1;
  return id;
};

function NotificationsProvider(props: NotificationsProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<NotificationsState>({ queue: [] });
  const anchorOrigin = getAnchorOrigin(props);
  const maxSnack = getMaxSnack(props.maxSnack);
  const defaultShowOptions = React.useMemo(
    () =>
      getDefaultShowOptions(
        props.defaultSeverity,
        props.defaultAutoHideDuration,
      ),
    [props.defaultAutoHideDuration, props.defaultSeverity],
  );

  const show = React.useCallback<ShowNotification>(
    (message, options = {}) => {
      const notificationKey =
        options.key ?? `::toolpad-internal::notification::${generateId()}`;
      const notificationOptions = { ...defaultShowOptions, ...options };

      setState((prev) => {
        if (prev.queue.some((n) => n.notificationKey === notificationKey)) {
          // deduplicate by key
          return prev;
        }
        return {
          ...prev,
          queue: [
            ...prev.queue,
            {
              message,
              options: notificationOptions,
              notificationKey,
              open: true,
            },
          ],
        };
      });
      return notificationKey;
    },
    [defaultShowOptions],
  );

  const close = React.useCallback<CloseNotification>((key) => {
    setState((prev) => ({
      ...prev,
      queue: prev.queue.filter((n) => n.notificationKey !== key),
    }));
  }, []);

  const closeAll = React.useCallback<CloseAllNotifications>(() => {
    setState((prev) => {
      if (prev.queue.length === 0) {
        return prev;
      }

      return {
        ...prev,
        queue: [],
      };
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({ show, close, closeAll }),
    [show, close, closeAll],
  );

  return (
    <RootPropsContext.Provider value={props}>
      <NotificationsContext.Provider value={contextValue}>
        {children}
        <Notifications
          anchorOrigin={anchorOrigin}
          maxSnack={maxSnack}
          state={state}
        />
      </NotificationsContext.Provider>
    </RootPropsContext.Provider>
  );
}

export { NotificationsProvider };
