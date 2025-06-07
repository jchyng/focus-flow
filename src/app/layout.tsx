import type { Metadata } from "next";
import "@/app/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";

export const metadata: Metadata = {
  title: "Focus Flow",
  description: "Focus Flow - 목표 달성을 위한 작업 관리 도구",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex" data-theme="light">
        {children}
        <DarkModeToggle />
      </body>
    </html>
  );
}
