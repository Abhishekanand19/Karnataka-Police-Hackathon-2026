"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { NotificationCenter } from "@/components/layout/notification-center";
import { PageTransition } from "@/components/layout/page-transition";
import { usePathname } from "next/navigation";
import { useInvestigation } from "@/providers/investigation-provider";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { mounted } = useInvestigation();

  const isLoginRoute = pathname.startsWith("/login");

  if (!mounted && !isLoginRoute) return <div className="h-screen w-screen bg-background" />; // Prevent flash of unauthenticated state

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-gray-100 font-sans antialiased">
      {/* Fixed Left Sidebar */}
      {!isLoginRoute && <Sidebar />}

      {/* Main Content Viewport */}
      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        {!isLoginRoute && (
          <TopNavbar
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
          />
        )}

        <main className="flex flex-col flex-1 min-h-0 overflow-y-auto bg-background relative">
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
    </div>
  );
};
