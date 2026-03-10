"use client";

import { useState } from "react";
import { ChevronDown, Check, Building2, PlusCircle } from "lucide-react";
import { Org } from "@/types";
import { cn } from "@/lib/utils";

interface OrgSwitcherProps {
  orgs: Org[];
  currentOrg: Org;
  onSwitch: (org: Org) => void;
}

export function OrgSwitcher({ orgs, currentOrg, onSwitch }: OrgSwitcherProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: currentOrg.primaryColor }}
        >
          {currentOrg.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{currentOrg.name}</p>
          <p className="text-xs text-white/60 truncate">{currentOrg.slogan}</p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-white/60 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-40 py-1.5 overflow-hidden">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
              Organizations
            </p>
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => { onSwitch(org); setOpen(false); }}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 transition-colors text-left",
                  currentOrg.id === org.id && "bg-orange-50"
                )}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: org.primaryColor }}
                >
                  {org.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{org.name}</p>
                  <p className="text-xs text-gray-500 truncate">{org.slug}</p>
                </div>
                {currentOrg.id === org.id && (
                  <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                )}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-1.5 pt-1.5">
              <button className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-500">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                  <PlusCircle className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-sm">Add organization</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
