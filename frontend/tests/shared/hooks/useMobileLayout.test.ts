import { act, renderHook } from "@testing-library/react";

import { useMobileLayout } from "@/shared/hooks/useMobile";

const MAX_PHONE_WIDTH = 640;

describe("useMobileLayout", () => {
  let windowInnerWidthSpy: any;

  beforeEach(() => {
    // Mock window.innerWidth with a getter
    windowInnerWidthSpy = vi.spyOn(window, "innerWidth", "get");
  });

  afterEach(() => {
    windowInnerWidthSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("returns true when initial width is less than MAX_PHONE_WIDTH", () => {
    windowInnerWidthSpy.mockReturnValue(500);

    const { result } = renderHook(() => useMobileLayout());

    expect(result.current).toBe(true);
  });

  it("returns false when initial width is greater than MAX_PHONE_WIDTH", () => {
    windowInnerWidthSpy.mockReturnValue(800);

    const { result } = renderHook(() => useMobileLayout());

    expect(result.current).toBe(false);
  });

  it("returns false when width equals MAX_PHONE_WIDTH", () => {
    windowInnerWidthSpy.mockReturnValue(MAX_PHONE_WIDTH);

    const { result } = renderHook(() => useMobileLayout());

    expect(result.current).toBe(false);
  });

  it("returns true when width is 1 pixel less than MAX_PHONE_WIDTH", () => {
    windowInnerWidthSpy.mockReturnValue(MAX_PHONE_WIDTH - 1);

    const { result } = renderHook(() => useMobileLayout());

    expect(result.current).toBe(true);
  });

  it("updates state on window resize event", () => {
    windowInnerWidthSpy.mockReturnValue(500);

    const { result } = renderHook(() => useMobileLayout());

    expect(result.current).toBe(true);

    // Simulate window resize to desktop width
    act(() => {
      windowInnerWidthSpy.mockReturnValue(800);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(false);
  });

  it("updates state multiple times on window resize events", () => {
    windowInnerWidthSpy.mockReturnValue(500);

    const { result } = renderHook(() => useMobileLayout());
    expect(result.current).toBe(true);

    // Resize to desktop
    act(() => {
      windowInnerWidthSpy.mockReturnValue(1000);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(false);

    // Resize back to mobile
    act(() => {
      windowInnerWidthSpy.mockReturnValue(320);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(true);

    // Resize to tablet
    act(() => {
      windowInnerWidthSpy.mockReturnValue(768);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(false);
  });

  it("cleans up resize event listener on unmount", () => {
    windowInnerWidthSpy.mockReturnValue(500);

    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useMobileLayout());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it("adds resize event listener on mount", () => {
    windowInnerWidthSpy.mockReturnValue(500);

    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    renderHook(() => useMobileLayout());

    expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    addEventListenerSpy.mockRestore();
  });

  it("handles rapid resize events correctly", () => {
    windowInnerWidthSpy.mockReturnValue(500);

    const { result } = renderHook(() => useMobileLayout());
    expect(result.current).toBe(true);

    act(() => {
      windowInnerWidthSpy.mockReturnValue(800);
      window.dispatchEvent(new Event("resize"));
      windowInnerWidthSpy.mockReturnValue(600);
      window.dispatchEvent(new Event("resize"));
      windowInnerWidthSpy.mockReturnValue(700);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(false);
  });
});
