"use client";

import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { getDashboardStats, getOrgJobs, MONTHLY_REVENUE } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { JobStatus } from "@/types";
import { JOB_STATUS_CONFIG } from "@/lib/utils";

const COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#06b6d4", "#f97316", "#22c55e", "#9ca3af"];

const SOURCE_DATA = [
  { name: "Referral", value: 38, revenue: 82000 },
  { name: "Google", value: 27, revenue: 56000 },
  { name: "Website", value: 18, revenue: 37000 },
  { name: "Facebook", value: 9, revenue: 18000 },
  { name: "Yelp", value: 5, revenue: 9000 },
  { name: "Door Knock", value: 3, revenue: 5000 },
];

export default function ReportsPage() {
  const { currentOrg } = useOrg();
  const jobs = getOrgJobs(currentOrg.id);
  const stats = getDashboardStats(currentOrg.id);

  const statusBreakdown = (Object.keys(JOB_STATUS_CONFIG) as JobStatus[]).map((s) => ({
    name: JOB_STATUS_CONFIG[s].label,
    value: jobs.filter((j) => j.status === s).length,
    revenue: jobs.filter((j) => j.status === s).reduce((a, b) => a + b.value, 0),
  })).filter((d) => d.value > 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Reports"
        subtitle="Business performance overview"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Billed", value: formatCurrency(stats.totalRevenue + stats.pendingRevenue * 0.4) },
            { label: "Collected Revenue", value: formatCurrency(stats.totalRevenue) },
            { label: "Jobs Completed", value: stats.completedJobs },
            { label: "Avg Job Value", value: formatCurrency(stats.avgJobValue) },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue over time */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Revenue & Job Volume — Last 7 Months</h3>
          <p className="text-xs text-gray-500 mb-4">Revenue (bars) and job count (line)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_REVENUE} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number, name: string) =>
                  name === "revenue" ? [`$${v.toLocaleString()}`, "Revenue"] : [v, "Jobs"]
                }
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Bar yAxisId="left" dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} barSize={28} />
              <Line yAxisId="right" type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Two-column: Source pie + Status breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Lead sources */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Revenue by Source</h3>
            <p className="text-xs text-gray-500 mb-4">Where your best jobs come from</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={SOURCE_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {SOURCE_DATA.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, "Share"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {SOURCE_DATA.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-xs text-gray-600">{s.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">{formatCurrency(s.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Jobs by Status</h3>
            <p className="text-xs text-gray-500 mb-4">Current pipeline distribution</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusBreakdown} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                  {statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team performance table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Team Performance</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-500 font-semibold pb-2">Team Member</th>
                <th className="text-right text-xs text-gray-500 font-semibold pb-2">Jobs Completed</th>
                <th className="text-right text-xs text-gray-500 font-semibold pb-2">Revenue Generated</th>
                <th className="text-right text-xs text-gray-500 font-semibold pb-2">Avg Job Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: "Riley Chen", jobs: 4, revenue: 22150, avg: 5538 },
                { name: "Morgan Davis", jobs: 3, revenue: 29600, avg: 9867 },
                { name: "Casey Torres", jobs: 2, revenue: 14200, avg: 7100 },
              ].map((row) => (
                <tr key={row.name} className="hover:bg-gray-50">
                  <td className="py-3 text-sm text-gray-900 font-medium">{row.name}</td>
                  <td className="py-3 text-sm text-gray-600 text-right">{row.jobs}</td>
                  <td className="py-3 text-sm font-semibold text-gray-900 text-right">{formatCurrency(row.revenue)}</td>
                  <td className="py-3 text-sm text-gray-600 text-right">{formatCurrency(row.avg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
