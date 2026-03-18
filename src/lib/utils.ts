import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { JobStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysSince(dateStr: string): number {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  new:         { label: "New",         color: "text-violet-700", bg: "bg-violet-50",  border: "border-violet-200" },
  quoted:      { label: "Quoted",      color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200"  },
  approved:    { label: "Approved",    color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200"   },
  in_progress: { label: "In Progress", color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-200" },
  completed:   { label: "Completed",   color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200"  },
  invoiced:    { label: "Invoiced",    color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

export const PIPELINE_ORDER: JobStatus[] = [
  "new",
  "quoted",
  "approved",
  "in_progress",
  "completed",
  "invoiced",
];
