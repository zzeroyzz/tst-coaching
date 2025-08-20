"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  UserIcon as UserIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
} from "@heroicons/react/24/solid";
import { clsx } from "clsx";

const tabs = [
  {
    name: "Today",
    href: "/habits",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: "Weekly",
    href: "/habits/weekly",
    icon: CalendarIcon,
    iconSolid: CalendarIconSolid,
  },
  {
    name: "Habits",
    href: "/habits/manage",
    icon: CheckCircleIcon,
    iconSolid: CheckCircleIconSolid,
  },
  {
    name: "Progress",
    href: "/habits/progress",
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
  },
  {
    name: "Profile",
    href: "/habits/profile",
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
];

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-nb-lilac/40 flex flex-col">
      <main className="flex-1 pb-20 md:pb-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-nb-bg border-t-3 border-nb-border md:hidden">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = isActive ? tab.iconSolid : tab.icon;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={clsx(
                  "flex flex-col items-center justify-center space-y-1 px-1 transition-colors",
                  isActive
                    ? "text-nb-teal"
                    : "text-nb-ink/60 hover:text-nb-ink"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-bold">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="hidden md:fixed md:top-0 md:left-0 md:h-full md:w-64 md:bg-nb-bg md:border-r-3 md:border-nb-border md:flex md:flex-col shadow-nb-lg">
        <div className="p-6">
          <h1 className="text-xl font-black text-nb-ink">Habit Tracker</h1>
        </div>
        
        <div className="flex-1 px-6">
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = isActive ? tab.iconSolid : tab.icon;
              
              return (
                <li key={tab.name}>
                  <Link
                    href={tab.href}
                    className={clsx(
                      "flex items-center space-x-3 px-3 py-2 font-bold border-3 transition-all duration-200",
                      isActive
                        ? "bg-nb-yellow text-nb-ink border-nb-border shadow-nb-md"
                        : "text-nb-ink/70 hover:text-nb-ink hover:bg-nb-lilac/30 border-transparent"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <style jsx global>{`
        @media (min-width: 768px) {
          main {
            margin-left: 16rem;
          }
        }
      `}</style>
    </div>
  );
}