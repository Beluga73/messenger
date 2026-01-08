import { useLocation } from "react-router-dom";
import { useMobileLayout } from "@/shared/hooks/useMobile";
import { NavBar } from "./NavBar";
import type { ReactNode } from "react";

type MasterLayoutProps = {
  LeftPanel: ReactNode;
  RightPanel: ReactNode;
};

/** Works for tablet as well */
export const DesktopMasterLayout = ({
  LeftPanel,
  RightPanel,
}: MasterLayoutProps) => {
  return (
    <div className="flex w-screen h-screen">
      <aside className="flex-shrink-0 flex flex-col w-76 h-screen">
        <div className="flex-1 overflow-y-auto">{LeftPanel}</div>
        <NavBar navClassName="flex-grow-0 flex-shrink-0" />
      </aside>
      <main className="flex-1 h-screen border-l-1">{RightPanel}</main>
    </div>
  );
};

export const MobileMasterLayout = ({
  LeftPanel,
  RightPanel,
}: MasterLayoutProps) => {
  const paths = ["/chats", "/settings"]; // for those paths show left panel
  const location = useLocation();

  const Panel = paths.includes(location.pathname) ? LeftPanel : RightPanel;

  return (
    <div className="flex flex-col w-screen h-screen">
      <main className="flex-1 overflow-auto">{Panel}</main>
      <NavBar navClassName="flex-grow-0 flex-shrink-0" />
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
