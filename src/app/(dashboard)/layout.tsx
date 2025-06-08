'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Timer, BarChart3, Settings, LucideIcon } from 'lucide-react';
import { ThemeProvider } from '@/contexts/ThemeContext';

function Logo() {
  return (
    <Link href="/" className="flex p-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Focus Flow
      </h1>
    </Link>
  );
}

interface MenuLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

function MenuLink({ href, icon: Icon, label, isActive }: MenuLinkProps) {
  const activeCn =
    'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-lg font-medium text-primary';
  const inactiveCn = 'text-base-content';
  return (
    <li>
      <Link
        href={href}
        className={`flex gap-3 hover:bg-base-300/50 relative ${isActive ? activeCn : inactiveCn}`}
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
        isActive={pathname.startsWith('/goals')}
      />
      <MenuLink
        href="/pomo"
        icon={Timer}
        label="뽀모도로"
        isActive={pathname.startsWith('/pomo')}
      />
      <MenuLink
        href="/stat"
        icon={BarChart3}
        label="통계"
        isActive={pathname.startsWith('/stat')}
      />
      <MenuLink
        href="/settings"
        icon={Settings}
        label="설정"
        isActive={pathname.startsWith('/settings')}
      />
    </ul>
  );
}

function Profile() {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-t border-base-300">
      <div className="avatar avatar-placeholder">
        <div className="bg-neutral text-neutral-content rounded-full w-12 ">
          <span className="text-xl">CY</span>
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
    <aside className="flex flex-col min-h-screen w-64 bg-base-200 border-r border-base-300">
      <Logo />
      <div className="flex-1 overflow-y-auto">
        <Menu />
      </div>
      <Profile />
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 m-auto container mt-10 p-6 bg-base-100 ">{children}</main>
      </div>
    </ThemeProvider>
  );
}
