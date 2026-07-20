"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { NotificationCenter } from "@/components/layout/notification-center";
import { SpeedDial } from "@/components/ui/speed-dial";
import { PageTransition } from "@/components/layout/page-transition";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandCenterMode, setCommandCenterMode] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-gray-100 font-sans antialiased">
      {/* Collapsible Left Sidebar (Hidden in full Command Center Mode) */}
      {!commandCenterMode && <Sidebar />}

      {/* Main Content Viewport */}
      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        <TopNavbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          commandCenterMode={commandCenterMode}
          onToggleCommandCenterMode={() => setCommandCenterMode(!commandCenterMode)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background relative">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Global Overlays */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <SpeedDial />
    </div>
  );
};
