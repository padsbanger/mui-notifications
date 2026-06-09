import type { SnackbarOrigin, SnackbarProps } from "@mui/material";

type SnackbarSx = NonNullable<SnackbarProps["sx"]>;

export const DEFAULT_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "left",
};

export const STACKED_SNACKBAR_SX: SnackbarSx = {
  position: "static",
  transform: "none",
  left: "auto",
  right: "auto",
  top: "auto",
  bottom: "auto",
  pointerEvents: "auto",
  maxWidth: "100%",
};
