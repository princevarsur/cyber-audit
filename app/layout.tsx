import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "GRC Risk & Compliance Dashboard | SecureHealth Inc.",
  description:
    "Governance, Risk & Compliance dashboard demonstrating cybersecurity risk assessment, NIST CSF 2.0 compliance mapping, policy management, and executive reporting.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base text-slate-200 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
