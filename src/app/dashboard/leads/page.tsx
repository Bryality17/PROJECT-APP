"use client";

import { useState } from "react";
import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrgLeads } from "@/lib/mock-data";
import { Lead } from "@/types";
import { LEAD_SOURCE_CONFIG, LEAD_STATUS_CONFIG, formatCurrency, formatDate, cn } from "@/lib/utils";
import { Plus, Search, Phone, Mail, TrendingUp } from "lucide-react";

const STATUS_ORDER = ["new", "contacted", "qualified", "converted", "lost"] as const;

export default function LeadsPage() {
  const { currentOrg } = useOrg();
  const leads = getOrgLeads(currentOrg.id);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const newCount = leads.filter((l) => l.status === "new").length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;
  const conversionRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;
  const totalPipelineValue = leads
    .filter((l) => ["new", "contacted", "qualified"].includes(l.status))
    .reduce((s, l) => s + (l.value ?? 0), 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Leads"
        subtitle={`${leads.length} total · ${newCount} new · ${conversionRate}% conversion`}
        action={
          <Button size="sm">
            <Plus className="w-3.5 h-3.5" /> Add Lead
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Stats bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: leads.length, color: "text-gray-900" },
            { label: "New", value: leads.filter((l) => l.status === "new").length, color: "text-violet-600" },
            { label: "Conversion Rate", value: `${conversionRate}%`, color: "text-green-600" },
            { label: "Pipeline Value", value: formatCurrency(totalPipelineValue), color: "text-orange-600" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads…"
              className="pl-9 pr-4 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-48"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                statusFilter === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              )}
            >
              All
            </button>
            {STATUS_ORDER.map((s) => {
              const cfg = LEAD_STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                    statusFilter === s
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} border`
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lead cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm">No leads match your filters</div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const statusCfg = LEAD_STATUS_CONFIG[lead.status];
  const sourceCfg = LEAD_SOURCE_CONFIG[lead.source];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{lead.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{sourceCfg.icon} {sourceCfg.label}</p>
        </div>
        <Badge color={statusCfg.color} bg={statusCfg.bg} border={statusCfg.border}>
          {statusCfg.label}
        </Badge>
      </div>

      <div className="space-y-1.5">
        {lead.email && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Mail className="w-3 h-3" /> {lead.email}
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Phone className="w-3 h-3" /> {lead.phone}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formatDate(lead.createdAt)}</span>
        {lead.value && (
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
            <TrendingUp className="w-3 h-3 text-orange-500" />
            {formatCurrency(lead.value)}
          </div>
        )}
      </div>

      {lead.notes && (
        <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded p-2 border border-gray-100 leading-relaxed">
          {lead.notes}
        </p>
      )}
    </div>
  );
}
