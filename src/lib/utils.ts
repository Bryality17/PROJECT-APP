import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { JobStatus, LeadSource } from "@/types";

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

export const JOB_STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  new:         { label: "New",         color: "text-violet-700", bg: "bg-violet-50",  border: "border-violet-200" },
  contacted:   { label: "Contacted",   color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200"   },
  quoted:      { label: "Quoted",      color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200"  },
  scheduled:   { label: "Scheduled",  color: "text-cyan-700",   bg: "bg-cyan-50",    border: "border-cyan-200"   },
  in_progress: { label: "In Progress", color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-200" },
  completed:   { label: "Completed",  color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200"  },
  cancelled:   { label: "Cancelled",  color: "text-gray-500",   bg: "bg-gray-50",    border: "border-gray-200"   },
};

export const LEAD_SOURCE_CONFIG: Record<LeadSource, { label: string; icon: string }> = {
  website:    { label: "Website",    icon: "🌐" },
  referral:   { label: "Referral",   icon: "🤝" },
  google:     { label: "Google",     icon: "🔍" },
  facebook:   { label: "Facebook",   icon: "📘" },
  yelp:       { label: "Yelp",       icon: "⭐" },
  door_knock: { label: "Door Knock", icon: "🚪" },
  other:      { label: "Other",      icon: "📌" },
};

export const LEAD_STATUS_CONFIG = {
  new:       { label: "New",       color: "text-violet-700", bg: "bg-violet-50",  border: "border-violet-200" },
  contacted: { label: "Contacted", color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200"   },
  qualified: { label: "Qualified", color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200"  },
  converted: { label: "Converted", color: "text-green-700",  bg: "bg-green-50",   border: "border-green-200"  },
  lost:      { label: "Lost",      color: "text-gray-500",   bg: "bg-gray-50",    border: "border-gray-200"   },
};
