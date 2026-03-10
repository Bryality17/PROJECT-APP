"use client";

import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrgMembers } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/utils";
import { Plus, Mail, Crown, Shield, User } from "lucide-react";

const ROLE_CONFIG = {
  owner: { label: "Owner", icon: Crown, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  admin: { label: "Admin", icon: Shield, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  member: { label: "Member", icon: User, color: "text-gray-700", bg: "bg-gray-50", border: "border-gray-200" },
};

const AVATAR_COLORS = [
  "bg-orange-500", "bg-blue-500", "bg-violet-500", "bg-green-500", "bg-pink-500", "bg-cyan-500",
];

export default function TeamPage() {
  const { currentOrg } = useOrg();
  const members = getOrgMembers(currentOrg.id);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Team"
        subtitle={`${members.length} members in ${currentOrg.name}`}
        action={
          <Button size="sm">
            <Plus className="w-3.5 h-3.5" /> Invite Member
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Members</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {members.map((member, i) => {
                const roleCfg = ROLE_CONFIG[member.role];
                const RoleIcon = roleCfg.icon;
                return (
                  <div key={member.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0", AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                      {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                    </div>
                    <div className="hidden md:block text-xs text-gray-400">
                      Joined {formatDate(member.joinedAt)}
                    </div>
                    <Badge color={roleCfg.color} bg={roleCfg.bg} border={roleCfg.border}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {roleCfg.label}
                    </Badge>
                    <button className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors">
                      Manage
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invite card */}
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-900">Invite team members</p>
              <p className="text-xs text-orange-700 mt-0.5">
                Collaborate with your team inside {currentOrg.name}
              </p>
            </div>
            <Button size="sm">
              <Plus className="w-3.5 h-3.5" /> Send Invite
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
