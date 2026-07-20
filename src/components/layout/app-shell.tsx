"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { usePathname } from "next/navigation";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-background text-gray-100">{children}</div>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-command w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
