"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MONTHLY_REVENUE } from "@/lib/mock-data";

const formatK = (v: number) => `$${(v / 1000).toFixed(0)}k`;

export function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Monthly Revenue</h3>
          <p className="text-xs text-gray-500">Completed + invoiced jobs</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={MONTHLY_REVENUE} barSize={28} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatK} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
            cursor={{ fill: "#fff7ed" }}
          />
          <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
