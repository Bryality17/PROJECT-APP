export type OrgRole = "owner" | "admin" | "member";

export type JobStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export type LeadSource =
  | "website"
  | "referral"
  | "google"
  | "facebook"
  | "yelp"
  | "door_knock"
  | "other";

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

export interface Job {
  id: string;
  orgId: string;
  title: string;
  description?: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  address?: string;
  status: JobStatus;
  value: number;
  source: LeadSource;
  assignedTo?: string;
  assignedName?: string;
  scheduledDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  orgId: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  value?: number;
  notes?: string;
  createdAt: string;
}

export type ProductCategory =
  | "roofing_materials"
  | "gutters"
  | "service_packages"
  | "addons";

export interface Product {
  id: string;
  orgId: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalRevenue: number;
  pendingRevenue: number;
  newLeads: number;
  conversionRate: number;
  avgJobValue: number;
}
