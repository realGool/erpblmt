import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar, type SidebarNavigationKey } from "./Sidebar";

export interface AppShellProps {
  children: ReactNode;
  activeNavigation?: SidebarNavigationKey;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

export function AppShell({ children, activeNavigation, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen bg-page text-text-primary">
      <Sidebar activeNavigation={activeNavigation} onNavigate={onNavigate} />
      <div className="min-h-screen pl-sidebar">
        <Header />
        <main className="min-h-[calc(100vh-var(--size-header-height))]">{children}</main>
      </div>
    </div>
  );
}
