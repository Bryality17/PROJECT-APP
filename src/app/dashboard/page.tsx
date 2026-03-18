"use client";

import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentJobs } from "@/components/dashboard/recent-jobs";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { getDashboardStats, getOrgJobs } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  FileText,
  CheckCircle2,
  Target,
} from "lucide-react";

export default function DashboardPage() {
  const { currentOrg } = useOrg();
  const stats = getDashboardStats(currentOrg.id);
  const jobs = getOrgJobs(currentOrg.id);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title={`Welcome back, Jordan`}
        subtitle={`${currentOrg.name} · ${currentOrg.slogan}`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Jobs"
            value={String(stats.activeJobs)}
            subtitle="Approved + In Progress"
            icon={Briefcase}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(stats.revenue)}
            subtitle="Completed + Invoiced"
            icon={DollarSign}
            iconColor="text-green-600"
            iconBg="bg-green-50"
          />
          <StatCard
            title="Pending Quotes"
            value={`${stats.pendingQuotes} (${formatCurrency(stats.pendingQuotesValue)})`}
            subtitle="Waiting for approval"
            icon={FileText}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Close Rate"
            value={`${stats.closeRate}%`}
            subtitle="Quoted → Approved"
            icon={Target}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <PipelineOverview jobs={jobs} />
        </div>

        {/* Recent Jobs */}
        <RecentJobs jobs={jobs} />
      </div>
    </div>
  );
}
