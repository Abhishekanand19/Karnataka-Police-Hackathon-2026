import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "CrimeLens AI — Karnataka Police Crime Intelligence Command Centre",
  description:
    "Enterprise-grade crime analytics, spatial hotspot mapping, criminal network discovery, and explainable AI decision support for Karnataka State Police.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 font-sans antialiased min-h-screen">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
