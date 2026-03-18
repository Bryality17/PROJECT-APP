"use client";

import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrgJobs } from "@/lib/mock-data";
import {
  formatCurrency,
  formatDate,
  daysSince,
  cn,
} from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function QuotesPage() {
  const { currentOrg } = useOrg();
  const allJobs = getOrgJobs(currentOrg.id);
  const quotedJobs = allJobs
    .filter((j) => j.status === "quoted")
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

  const totalValue = quotedJobs.reduce((sum, j) => sum + j.quotedAmount, 0);
  const staleCount = quotedJobs.filter((j) => daysSince(j.updatedAt) > 7).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Quote Tracking"
        subtitle={`${quotedJobs.length} pending quotes · ${formatCurrency(totalValue)} total`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{quotedJobs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>

          <div className={cn(
            "rounded-xl border shadow-sm p-5",
            staleCount > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                staleCount > 0 ? "bg-red-100" : "bg-gray-100"
              )}>
                <AlertTriangle className={cn("w-5 h-5", staleCount > 0 ? "text-red-600" : "text-gray-400")} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stale Quotes</p>
                <p className={cn("text-2xl font-bold", staleCount > 0 ? "text-red-700" : "text-gray-900")}>
                  {staleCount}
                </p>
                <p className="text-xs text-gray-500">7+ days without follow-up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-semibold text-gray-900">All Pending Quotes</h3>
            <p className="text-xs text-gray-500">Sorted by oldest first — follow up on stale quotes</p>
          </div>

          {quotedJobs.length === 0 ? (
            <div className="px-5 pb-8 pt-4 text-center">
              <p className="text-sm text-gray-400">No pending quotes. Nice work!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {quotedJobs.map((job) => {
                const days = daysSince(job.updatedAt);
                const isStale = days > 7;
                const isWarning = days > 3 && days <= 7;

                return (
                  <div
                    key={job.id}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 transition-colors",
                      isStale && "bg-red-50/50"
                    )}
                  >
                    {/* Stale indicator */}
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      isStale ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-green-400"
                    )} />

                    {/* Job info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{job.title}</p>
                      <p className="text-xs text-gray-500">{job.customerName}</p>
                    </div>

                    {/* Days since quote */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Clock className={cn(
                        "w-3.5 h-3.5",
                        isStale ? "text-red-500" : isWarning ? "text-amber-500" : "text-gray-400"
                      )} />
                      <span className={cn(
                        "text-xs font-semibold",
                        isStale ? "text-red-600" : isWarning ? "text-amber-600" : "text-gray-500"
                      )}>
                        {days === 0 ? "Today" : days === 1 ? "1 day" : `${days} days`}
                      </span>
                    </div>

                    {/* Quote amount */}
                    <p className="text-sm font-bold text-gray-900 w-24 text-right flex-shrink-0">
                      {formatCurrency(job.quotedAmount)}
                    </p>

                    {/* Action */}
                    <Button size="sm" variant={isStale ? "primary" : "secondary"} className="flex-shrink-0">
                      Follow Up <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
