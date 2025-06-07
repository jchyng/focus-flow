"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Timer, BarChart3, LucideIcon } from "lucide-react";

interface MenuLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

function MenuLink({ href, icon: Icon, label, isActive }: MenuLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 hover:bg-base-300/50 relative ${
          isActive
            ? "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r-lg font-medium text-primary"
            : "text-base-content"
        }`}
      >
        <Icon size={20} />
        {label}
      </Link>
    </li>
  );
}

function Menu() {
  const pathname = usePathname();

  return (
    <ul className="menu menu-lg w-full p-4 gap-2">
      <MenuLink
        href="/goals"
        icon={ClipboardList}
        label="목표 관리"
        isActive={pathname.startsWith("/goals")}
      />
      <MenuLink
        href="/pomodoro"
        icon={Timer}
        label="뽀모도로"
        isActive={pathname.startsWith("/pomodoro")}
      />
      <MenuLink
        href="/statistics"
        icon={BarChart3}
        label="통계"
        isActive={pathname.startsWith("/statistics")}
      />
    </ul>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center px-6 py-6">
      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Focus Flow
      </div>
    </Link>
  );
}

function Profile() {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-t border-base-300">
      <div className="avatar placeholder">
        <div className="bg-neutral text-neutral-content rounded-full w-12 ring ring-primary ring-offset-base-100 ring-offset-2">
          {/* 프로필 이미지 */}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-base-content">정찬영</div>
        <div className="text-sm text-base-content/60">example@email.com</div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="bg-base-200 w-80 min-h-screen border-r border-base-300 flex flex-col">
      <Logo />
      <div className="flex-1">
        <Menu />
      </div>
      <Profile />
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 mt-10 md:p-8 bg-base-100 mx-auto max-w-[1440px]">
        {children}
      </main>
    </>
  );
}
