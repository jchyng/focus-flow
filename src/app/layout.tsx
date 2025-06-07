import type { Metadata } from "next";
import "@/app/globals.css";
import { ModalProvider } from "@/contexts/ModalContext";

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
      <body>
        <ModalProvider>
          {children}
          <div id="modal-root"></div>
        </ModalProvider>
      </body>
    </html>
  );
}
