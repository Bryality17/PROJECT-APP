"use client";

import { useState } from "react";
import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Zap, Palette, Bell, Shield, Users, Eye } from "lucide-react";

const TABS = [
  { id: "general", label: "General", icon: Zap },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "tabs",    label: "Tab Visibility", icon: Eye },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",  label: "Security", icon: Shield },
];

const PRESET_COLORS = [
  "#f97316", "#ef4444", "#8b5cf6", "#3b82f6", "#22c55e", "#06b6d4", "#ec4899", "#f59e0b",
];

const CORE_TABS = [
  { id: "dashboard", label: "Dashboard", locked: true },
  { id: "jobs",      label: "Jobs",       locked: true },
  { id: "leads",     label: "Leads",      locked: true },
  { id: "reports",   label: "Reports",    locked: false },
  { id: "team",      label: "Team",       locked: false },
  { id: "settings",  label: "Settings",  locked: true },
];

export default function SettingsPage() {
  const { currentOrg } = useOrg();
  const [activeTab, setActiveTab] = useState("general");
  const [orgName, setOrgName] = useState(currentOrg.name);
  const [slogan, setSlogan] = useState(currentOrg.slogan ?? "");
  const [color, setColor] = useState(currentOrg.primaryColor);
  const [tabVisibility, setTabVisibility] = useState<Record<string, boolean>>({
    dashboard: true, jobs: true, leads: true, reports: true, team: true, settings: true,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar currentOrg={currentOrg} title="Settings" subtitle="Manage your organization settings" />

      <div className="flex-1 overflow-hidden flex">
        {/* Left tab nav */}
        <div className="w-52 bg-white border-r border-gray-200 py-4 px-3 flex flex-col gap-0.5 flex-shrink-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                activeTab === id
                  ? "bg-orange-50 text-orange-600 border border-orange-100"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-xl">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">General Settings</h2>
                  <p className="text-sm text-gray-500">Basic information about your organization.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                  <Input
                    label="Organization Name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                  <Input
                    label="Organization Slug"
                    value={currentOrg.slug}
                    disabled
                  />
                  <Input
                    label="Slogan"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="Your brand tagline"
                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                    </span>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === "branding" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">Branding</h2>
                  <p className="text-sm text-gray-500">Customize how your org looks inside Baselyne.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Primary Color</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          style={{ backgroundColor: c }}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all hover:scale-110",
                            color === c && "ring-2 ring-offset-2 ring-gray-900 scale-110"
                          )}
                        />
                      ))}
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer"
                        title="Custom color"
                      />
                    </div>
                    <div className="mt-3 rounded-xl p-3 text-white text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: color }}>
                      <span>Preview:</span> {currentOrg.name}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Logo</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-gray-400">
                        {currentOrg.name.charAt(0)}
                      </div>
                      <p className="text-xs text-gray-500">Drag and drop or</p>
                      <button className="text-xs text-orange-500 font-medium hover:text-orange-600">browse files</button>
                      <p className="text-xs text-gray-400 mt-1">PNG, SVG up to 2MB</p>
                    </div>
                  </div>

                  <Button>Save Branding</Button>
                </div>
              </div>
            )}

            {activeTab === "tabs" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">Tab Visibility</h2>
                  <p className="text-sm text-gray-500">Control which tabs are visible to your team. Core tabs can only be changed by system admins.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {CORE_TABS.map((tab, i) => (
                    <div key={tab.id} className={cn("flex items-center justify-between px-5 py-3.5", i > 0 && "border-t border-gray-100")}>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">{tab.label}</span>
                        {tab.locked && (
                          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                            Core
                          </span>
                        )}
                      </div>
                      <label className={cn("relative inline-flex items-center cursor-pointer", tab.locked && "opacity-50 cursor-not-allowed")}>
                        <input
                          type="checkbox"
                          checked={tabVisibility[tab.id]}
                          onChange={(e) => !tab.locked && setTabVisibility(prev => ({ ...prev, [tab.id]: e.target.checked }))}
                          disabled={tab.locked}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  Core tabs (Dashboard, Jobs, Leads, Settings) are always visible and can only be toggled by your platform administrator.
                </p>
              </div>
            )}

            {(activeTab === "notifications" || activeTab === "security") && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  {activeTab === "notifications" ? <Bell className="w-5 h-5 text-gray-400" /> : <Shield className="w-5 h-5 text-gray-400" />}
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {activeTab === "notifications" ? "Notification Settings" : "Security Settings"}
                </p>
                <p className="text-xs text-gray-500">Coming soon — this section is in development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
