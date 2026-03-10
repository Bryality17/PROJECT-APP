"use client";

import { Search, Bell, Plus } from "lucide-react";
import { Org } from "@/types";

interface TopbarProps {
  currentOrg: Org;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Topbar({ currentOrg, title, subtitle, action }: TopbarProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            placeholder="Search jobs, clients…"
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-52"
          />
        </div>
        {action}
      </div>
    </header>
  );
}
