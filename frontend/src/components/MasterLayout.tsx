"use client";

import { NavBar } from "./NavBar";
import type { ReactNode } from "react";

type MasterLayoutProps = {
  LeftPanel: ReactNode;
  RightPanel: ReactNode;
};

export const MasterLayout = ({ LeftPanel, RightPanel }: MasterLayoutProps) => {
  return (
    <div className="flex w-screen h-screen">
      <aside className="relative w-76 h-screen pb-12">
        <div className="h-full overflow-y-auto">{LeftPanel}</div>
        <NavBar />
      </aside>
      <main className="flex-1 min-h-screen overflow-y-auto border-l-1">
        {RightPanel}
      </main>
    </div>
  );
};
