"use client";

import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentJobs } from "@/components/dashboard/recent-jobs";
import { PipelineOverview } from "@/components/dashboard/pipeline-overview";
import { getDashboardStats, getOrgJobs, getOrgLeads } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  UserCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  const { currentOrg } = useOrg();
  const stats = getDashboardStats(currentOrg.id);
  const jobs = getOrgJobs(currentOrg.id);
  const leads = getOrgLeads(currentOrg.id);

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
            change="2 added this week"
            changePositive
            icon={Briefcase}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
          />
          <StatCard
            title="Revenue (MTD)"
            value={formatCurrency(stats.totalRevenue)}
            change="11% vs last month"
            changePositive
            icon={DollarSign}
            iconColor="text-green-600"
            iconBg="bg-green-50"
          />
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(stats.pendingRevenue)}
            subtitle={`${stats.activeJobs} open jobs`}
            icon={TrendingUp}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="New Leads"
            value={String(stats.newLeads)}
            subtitle={`${stats.conversionRate}% conversion rate`}
            icon={UserCircle}
            iconColor="text-violet-600"
            iconBg="bg-violet-50"
          />
        </div>

        {/* Secondary KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Completed Jobs"
            value={String(stats.completedJobs)}
            subtitle="All time"
            icon={CheckCircle2}
            iconColor="text-green-600"
            iconBg="bg-green-50"
          />
          <StatCard
            title="Avg Job Value"
            value={formatCurrency(stats.avgJobValue)}
            subtitle="Completed jobs"
            icon={DollarSign}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Total Jobs"
            value={String(stats.totalJobs)}
            subtitle="All statuses"
            icon={Briefcase}
            iconColor="text-gray-600"
            iconBg="bg-gray-100"
          />
          <StatCard
            title="Leads This Month"
            value={String(leads.length)}
            change="3 this week"
            changePositive
            icon={Clock}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-50"
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
