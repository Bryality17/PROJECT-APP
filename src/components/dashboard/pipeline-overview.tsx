import { Job, JobStatus } from "@/types";
import { JOB_STATUS_CONFIG, PIPELINE_ORDER } from "@/lib/utils";

interface PipelineOverviewProps {
  jobs: Job[];
}

export function PipelineOverview({ jobs }: PipelineOverviewProps) {
  const counts = PIPELINE_ORDER.map((status) => ({
    status,
    count: jobs.filter((j) => j.status === status).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Job Pipeline</h3>
        <p className="text-xs text-gray-500">Current status breakdown</p>
      </div>
      <div className="space-y-3">
        {counts.map(({ status, count }) => {
          const cfg = JOB_STATUS_CONFIG[status];
          const pct = Math.round((count / max) * 100);
          return (
            <div key={status} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-600 w-24 flex-shrink-0">{cfg.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: getBarColor(status) }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 w-5 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getBarColor(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    new:         "#8b5cf6",
    quoted:      "#f59e0b",
    approved:    "#3b82f6",
    in_progress: "#f97316",
    completed:   "#22c55e",
    invoiced:    "#059669",
  };
  return map[status];
}
