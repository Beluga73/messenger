import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DesktopMasterLayout, MasterLayout } from "@/shared/components/layout/MasterLayout";
import { useMobileLayout } from "@/shared/hooks/useMobile";

vi.mock("@/shared/hooks/useMobile");
vi.mock("@/shared/components/layout/NavBar", () => ({
  NavBar: () => <div data-testid="navbar">NavBar</div>,
}));

const mockUseMobileLayout = vi.mocked(useMobileLayout);

describe("DesktopMasterLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders left and right panels in desktop layout", () => {
    const LeftPanel = <div data-testid="left-panel">Left Panel</div>;
    const RightPanel = <div data-testid="right-panel">Right Panel</div>;

    render(<DesktopMasterLayout LeftPanel={LeftPanel} RightPanel={RightPanel} />);

    expect(screen.getByTestId("left-panel")).toBeTruthy();
    expect(screen.getByTestId("right-panel")).toBeTruthy();
  });

  it("renders NavBar component", () => {
    const LeftPanel = <div>Left</div>;
    const RightPanel = <div>Right</div>;

    render(<DesktopMasterLayout LeftPanel={LeftPanel} RightPanel={RightPanel} />);

    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("applies correct layout structure with aside and main", () => {
    const LeftPanel = <div>Left</div>;
    const RightPanel = <div>Right</div>;

    const { container } = render(
      <DesktopMasterLayout LeftPanel={LeftPanel} RightPanel={RightPanel} />
    );

    const aside = container.querySelector("aside");
    const main = container.querySelector("main");

    expect(aside).toBeTruthy();
    expect(main).toBeTruthy();
  });
});

describe("MasterLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders DesktopMasterLayout when desktop", () => {
    mockUseMobileLayout.mockReturnValue(false);

    const LeftPanel = <div data-testid="left-panel">Left</div>;
    const RightPanel = <div data-testid="right-panel">Right</div>;

    const { container } = render(<MasterLayout LeftPanel={LeftPanel} RightPanel={RightPanel} />);

    expect(screen.getByTestId("left-panel")).toBeTruthy();
    expect(screen.getByTestId("right-panel")).toBeTruthy();

    const aside = container.querySelector("aside");
    expect(aside).toBeTruthy();
  });

  it("calls useMobileLayout hook", () => {
    mockUseMobileLayout.mockReturnValue(false);

    const LeftPanel = <div>Left</div>;
    const RightPanel = <div>Right</div>;

    render(<MasterLayout LeftPanel={LeftPanel} RightPanel={RightPanel} />);

    expect(mockUseMobileLayout).toHaveBeenCalled();
  });
});
