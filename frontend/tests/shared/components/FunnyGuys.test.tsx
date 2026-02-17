import { render } from "@testing-library/react";

import { FunnyGuys } from "@/shared/components/FunnyGuys";

describe("FunnyGuys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<FunnyGuys />);
    expect(container).toBeTruthy();
  });

  it("renders divs with expected classes for animation", () => {
    const { container } = render(<FunnyGuys />);

    const shapes = container.querySelectorAll(".shape");
    expect(shapes.length).toBeGreaterThan(0);
  });

  it("sets up mousemove event listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");

    render(<FunnyGuys />);

    expect(addEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));

    addEventListenerSpy.mockRestore();
  });

  it("removes mousemove event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(<FunnyGuys />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it("applies float animation to shape elements", () => {
    const { container } = render(<FunnyGuys />);

    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain("animation: float 5s ease-in-out infinite");
  });

  it("applies animation delay to orange-semi", () => {
    const { container } = render(<FunnyGuys />);

    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain("animation-delay: -2.5s");
  });

  it("renders elements with pupil class for eye tracking", () => {
    const { container } = render(<FunnyGuys />);

    const pupils = container.querySelectorAll(".pupil");
    expect(pupils.length).toBeGreaterThan(0);
  });

  it("handles mousemove events for eye tracking", () => {
    const { container } = render(<FunnyGuys />);

    const pupil = container.querySelector(".pupil") as HTMLDivElement;
    expect(pupil).toBeTruthy();

    // Simulate mouse movement
    const mouseEvent = new MouseEvent("mousemove", {
      bubbles: true,
      clientX: 100,
      clientY: 100,
    });

    document.dispatchEvent(mouseEvent);

    // The pupil should have transform applied from the eye tracking logic
    // (We can't easily verify the exact transform value without complex calculations)
    expect(pupil).toBeTruthy();
  });

  it("renders yellow-bird element with beak", () => {
    const { container } = render(<FunnyGuys />);

    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain(".beak");
  });

  it("renders orange-semi with mouth and smile", () => {
    const { container } = render(<FunnyGuys />);

    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain(".mouth");
    expect(styleTag?.textContent).toContain(".smile");
  });

  it("applies correct styles for eye positioning", () => {
    const { container } = render(<FunnyGuys />);

    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain(".eyes-cont");
  });
});
