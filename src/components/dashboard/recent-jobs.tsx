import Link from "next/link";
import { Job } from "@/types";
import { Badge } from "@/components/ui/badge";
import { JOB_STATUS_CONFIG, formatCurrency, formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface RecentJobsProps {
  jobs: Job[];
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  const recent = [...jobs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Recent Jobs</h3>
          <p className="text-xs text-gray-500">Latest activity</p>
        </div>
        <Link
          href="/dashboard/jobs"
          className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {recent.map((job) => {
          const cfg = JOB_STATUS_CONFIG[job.status];
          return (
            <div key={job.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                <p className="text-xs text-gray-500 truncate">{job.customerName}</p>
              </div>
              <Badge color={cfg.color} bg={cfg.bg} border={cfg.border}>{cfg.label}</Badge>
              <p className="text-sm font-semibold text-gray-900 w-20 text-right">
                {formatCurrency(job.quotedAmount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
