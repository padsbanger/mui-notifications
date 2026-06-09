import * as React from "react";

import { Snackbar, type SnackbarProps } from "@mui/material";
import { act, renderHook, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import { NotificationsProvider } from "./NotificationsProvider";
import { useNotifications } from "./useNotifications";

interface TestWrapperProps {
  children: React.ReactNode;
}

function TestWrapper({ children }: TestWrapperProps) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}

function MaxSnackWrapper({ children }: TestWrapperProps) {
  return <NotificationsProvider maxSnack={2}>{children}</NotificationsProvider>;
}

describe("useNotifications", () => {
  test("can do basic notifications", async () => {
    const { result, rerender } = renderHook(() => useNotifications(), {
      wrapper: TestWrapper,
    });

    expect(screen.queryByRole("alert")).toBeNull();

    let key = "";
    act(() => {
      key = result.current.show("Hello");
    });
    expect(key).toBeTypeOf("string");

    rerender();

    const snackbar = screen.getByRole("alert");
    expect(snackbar.textContent).toBe("Hello");

    await userEvent.click(
      within(snackbar).getByRole("button", { name: "Close" }),
    );

    rerender();

    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("can close all queued notifications", () => {
    const { result, rerender } = renderHook(() => useNotifications(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.show("First");
      result.current.show("Second");
    });

    rerender();

    expect(screen.getByRole("alert").textContent).toBe("First");

    act(() => {
      result.current.closeAll();
    });

    rerender();

    expect(screen.queryByRole("alert")).toBeNull();
  });

  test("can show multiple notifications up to maxSnack", () => {
    const { result, rerender } = renderHook(() => useNotifications(), {
      wrapper: MaxSnackWrapper,
    });

    let firstKey = "";
    act(() => {
      firstKey = result.current.show("First");
      result.current.show("Second");
      result.current.show("Third");
    });

    rerender();

    expect(screen.getByText("First")).toBeDefined();
    expect(screen.getByText("Second")).toBeDefined();
    expect(screen.queryByText("Third")).toBeNull();

    act(() => {
      result.current.close(firstKey);
    });

    rerender();

    expect(screen.queryByText("First")).toBeNull();
    expect(screen.getByText("Second")).toBeDefined();
    expect(screen.getByText("Third")).toBeDefined();
  });

  test("applies default provider options to notifications", () => {
    const snackbarProps: SnackbarProps[] = [];

    function CapturingSnackbar(props: SnackbarProps) {
      snackbarProps.push(props);
      return <Snackbar {...props} />;
    }

    function DefaultsWrapper({ children }: TestWrapperProps) {
      return (
        <NotificationsProvider
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          defaultAutoHideDuration={4500}
          defaultSeverity="success"
          slots={{ snackbar: CapturingSnackbar }}
        >
          {children}
        </NotificationsProvider>
      );
    }

    const { result, rerender } = renderHook(() => useNotifications(), {
      wrapper: DefaultsWrapper,
    });

    act(() => {
      result.current.show("Defaulted");
    });

    rerender();

    const latestSnackbarProps = snackbarProps[snackbarProps.length - 1];
    const child = latestSnackbarProps?.children;
    const childProps = React.isValidElement<{ severity?: string }>(child)
      ? child.props
      : null;

    expect(latestSnackbarProps?.anchorOrigin).toEqual({
      vertical: "top",
      horizontal: "right",
    });
    expect(latestSnackbarProps?.autoHideDuration).toBe(4500);
    expect(childProps?.severity).toBe("success");
  });
});
