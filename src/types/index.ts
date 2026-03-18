export type OrgRole = "owner" | "admin" | "member";

export type JobStatus =
  | "new"
  | "quoted"
  | "approved"
  | "in_progress"
  | "completed"
  | "invoiced";

export interface Org {
  id: string;
  name: string;
  slug: string;
  slogan?: string;
  logo?: string;
  primaryColor: string;
  active: boolean;
  createdAt: string;
}

export interface Member {
  id: string;
  orgId: string;
  userId: string;
  name: string;
  email: string;
  role: OrgRole;
  avatar?: string;
  joinedAt: string;
}

export interface Customer {
  id: string;
  orgId: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  orgId: string;
  customerId: string;
  customerName: string;
  title: string;
  description?: string;
  status: JobStatus;
  quotedAmount: number;
  approvedAmount?: number;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobStatusChange {
  id: string;
  jobId: string;
  status: JobStatus;
  changedAt: string;
}

export interface DashboardStats {
  todaysJobs: number;
  revenue: number;
  pendingQuotes: number;
  pendingQuotesValue: number;
  closeRate: number;
  activeJobs: number;
}
