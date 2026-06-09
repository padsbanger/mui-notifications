import * as React from "react";

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
});
