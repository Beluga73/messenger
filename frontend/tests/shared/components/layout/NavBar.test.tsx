import { BrowserRouter } from "react-router-dom";

import { render } from "@testing-library/react";

import { NavBar } from "@/shared/components/layout/NavBar";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/chats" }),
  };
});

describe("NavBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all navigation links", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const links = container.querySelectorAll("a");
    expect(links.length).toBe(3);
  });

  it("renders links with correct href attributes", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const callsLink = container.querySelector('a[href="/calls"]');
    const chatsLink = container.querySelector('a[href="/chats"]');
    const settingsLink = container.querySelector('a[href="/settings"]');

    expect(callsLink).toBeTruthy();
    expect(chatsLink).toBeTruthy();
    expect(settingsLink).toBeTruthy();
  });

  it("applies primary text color to active link", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const activeLink = container.querySelector('a[href="/chats"]');

    expect(activeLink?.classList.contains("text-primary")).toBe(true);
  });

  it("does not apply primary color to inactive links", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const callsLink = container.querySelector('a[href="/calls"]');
    const settingsLink = container.querySelector('a[href="/settings"]');

    expect(callsLink?.classList.contains("text-primary")).toBe(false);
    expect(settingsLink?.classList.contains("text-primary")).toBe(false);
  });

  it("applies custom navbar className", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar navClassName="custom-nav-class" />
      </BrowserRouter>
    );

    const nav = container.querySelector("nav");
    expect(nav?.classList.contains("custom-nav-class")).toBe(true);
  });

  it("renders nav as unordered list with list items", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const list = container.querySelector("ul");
    expect(list).toBeTruthy();

    const listItems = container.querySelectorAll("li");
    expect(listItems.length).toBe(3);
  });

  it("displays icons for each navigation item", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders without custom className", () => {
    const { container } = render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    const nav = container.querySelector("nav");
    expect(nav).toBeTruthy();
  });
});
