import type { ReactNode } from "react";

import { useLocation } from "react-router-dom";

import { useMobileLayout } from "@/shared/hooks/useMobile";

import { NavBar } from "./NavBar";

type MasterLayoutProps = {
  LeftPanel: ReactNode;
  RightPanel: ReactNode;
};

/** Works for tablet as well */
export const DesktopMasterLayout = ({ LeftPanel, RightPanel }: MasterLayoutProps) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <aside className="flex-shrink-0 flex flex-col w-76 h-screen overflow-hidden">
        <div className="flex-1 min-h-0 overflow-hidden">{LeftPanel}</div>
        <NavBar navClassName="flex-grow-0 flex-shrink-0" />
      </aside>
      <main className="flex-1 h-screen overflow-hidden border-l-1">{RightPanel}</main>
    </div>
  );
};

export const MobileMasterLayout = ({ LeftPanel, RightPanel }: MasterLayoutProps) => {
  const location = useLocation();
  const navbarPaths = ["/chats", "/settings", "/calls"];

  const showLeftPanel = navbarPaths.includes(location.pathname);
  const Panel = showLeftPanel ? LeftPanel : RightPanel;

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <main className="flex-1 min-h-0 overflow-hidden">{Panel}</main>
      {showLeftPanel && <NavBar navClassName="flex-grow-0 flex-shrink-0" />}
    </div>
  );
};

export const MasterLayout = ({ LeftPanel, RightPanel }: MasterLayoutProps) => {
  const isMobile = useMobileLayout();
  const layoutProps = { LeftPanel, RightPanel };

  return isMobile ? (
    <MobileMasterLayout {...layoutProps} />
  ) : (
    <DesktopMasterLayout {...layoutProps} />
  );
};
