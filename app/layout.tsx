// app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import PublicHeader from "./components/header";
import AdminHeader from "./components/adminheader";
import Footer from "./components/footer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Determine which header to show
  const isAdminRoute = pathname?.startsWith("/web-admin");

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Conditional Header - Only show one */}
        {isAdminRoute ? <AdminHeader /> : <PublicHeader />}

        <main className="flex-1">{children}</main>

        {/* Footer - Only show on public routes */}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
