"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  UserCircle,
  Zap,
  LogOut,
  Bell,
} from "lucide-react";
import { OrgSwitcher } from "./org-switcher";
import { useOrg } from "./org-context";
import { cn } from "@/lib/utils";
import { ORGS } from "@/lib/mock-data";

const NAV_ITEMS = [
  { href: "/dashboard",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/dashboard/jobs",     label: "Jobs",        icon: Briefcase },
  { href: "/dashboard/leads",    label: "Leads",       icon: UserCircle },
  { href: "/dashboard/reports",  label: "Reports",     icon: BarChart3 },
  { href: "/dashboard/team",     label: "Team",        icon: Users },
  { href: "/dashboard/settings", label: "Settings",    icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentOrg, setCurrentOrg } = useOrg();

  return (
    <aside className="w-64 bg-gray-900 flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="px-4 pt-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Baselyne</p>
            <p className="text-[10px] text-white/40 leading-none mt-0.5">Freeze Chaos. Heat Results.</p>
          </div>
        </div>
        <OrgSwitcher orgs={ORGS} currentOrg={currentOrg} onSwitch={setCurrentOrg} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 w-full transition-all">
          <Bell className="w-4 h-4" />
          Notifications
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Jordan Mills</p>
            <p className="text-[10px] text-gray-500 truncate">Owner</p>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
