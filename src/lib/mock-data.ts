import { Org, Member, Customer, Job } from "@/types";

export const ORGS: Org[] = [
  {
    id: "org_1",
    name: "Apex Roofing Co.",
    slug: "apex-roofing",
    slogan: "Top-quality roofs, top-notch service.",
    primaryColor: "#f97316",
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: "org_2",
    name: "BlueWave Plumbing",
    slug: "bluewave-plumbing",
    slogan: "Flow with confidence.",
    primaryColor: "#3b82f6",
    active: true,
    createdAt: "2024-03-22",
  },
];

export const MEMBERS: Member[] = [
  { id: "m1", orgId: "org_1", userId: "u1", name: "Jordan Mills", email: "jordan@apexroofing.com", role: "owner", joinedAt: "2024-01-15" },
  { id: "m2", orgId: "org_1", userId: "u2", name: "Casey Torres", email: "casey@apexroofing.com", role: "admin", joinedAt: "2024-02-01" },
  { id: "m3", orgId: "org_1", userId: "u3", name: "Riley Chen", email: "riley@apexroofing.com", role: "member", joinedAt: "2024-03-10" },
  { id: "m4", orgId: "org_1", userId: "u4", name: "Morgan Davis", email: "morgan@apexroofing.com", role: "member", joinedAt: "2024-04-05" },
  { id: "m5", orgId: "org_2", userId: "u5", name: "Alex Kim", email: "alex@bluewave.com", role: "owner", joinedAt: "2024-03-22" },
];

// ── Customers ───────────────────────────────────────────────
export const CUSTOMERS: Customer[] = [
  { id: "cust_001", orgId: "org_1", name: "Henderson Family", phone: "(555) 210-4400", email: "hendersons@email.com", createdAt: "2026-01-10" },
  { id: "cust_002", orgId: "org_1", name: "Park Ridge HOA", phone: "(555) 330-9900", email: "manager@parkridge.com", notes: "12-unit complex, main contact: Diana", createdAt: "2026-01-15" },
  { id: "cust_003", orgId: "org_1", name: "Pinnacle Warehousing LLC", phone: "(555) 440-7788", email: "ops@pinnaclewh.com", createdAt: "2026-02-01" },
  { id: "cust_004", orgId: "org_1", name: "Raj Sharma", phone: "(555) 112-3344", email: "raj.sharma@gmail.com", createdAt: "2026-02-10" },
  { id: "cust_005", orgId: "org_1", name: "Linwood Builders", phone: "(555) 880-2244", email: "bids@linwoodbuilders.com", notes: "Commercial builder, repeat client", createdAt: "2026-02-15" },
  { id: "cust_006", orgId: "org_1", name: "Maria Gomez", phone: "(555) 660-1122", email: "mgomez@yahoo.com", createdAt: "2026-02-20" },
  { id: "cust_007", orgId: "org_1", name: "Douglas Whitfield", phone: "(555) 990-3344", email: "dwhitfield@work.net", createdAt: "2026-02-25" },
  { id: "cust_008", orgId: "org_1", name: "Westfield Property Mgmt", phone: "(555) 110-5566", email: "maint@westfield.com", notes: "Manages 40+ properties in Austin area", createdAt: "2026-01-05" },
  { id: "cust_009", orgId: "org_1", name: "Hernandez Residence", phone: "(555) 224-8890", email: "tony.h@gmail.com", createdAt: "2026-03-01" },
  { id: "cust_010", orgId: "org_1", name: "Summit Dental Group", phone: "(555) 445-7700", email: "office@summitdental.com", createdAt: "2026-03-05" },
];

// ── Jobs ────────────────────────────────────────────────────
export const JOBS: Job[] = [
  {
    id: "job_001",
    orgId: "org_1",
    customerId: "cust_001",
    customerName: "Henderson Family",
    title: "Full Roof Replacement - 3,200 sq ft",
    description: "Replacing asphalt shingles with architectural. Fascia boards need repair too.",
    address: "142 Oak Creek Dr, Austin TX 78701",
    status: "in_progress",
    quotedAmount: 18500,
    approvedAmount: 18500,
    createdAt: "2026-02-28",
    updatedAt: "2026-03-08",
  },
  {
    id: "job_002",
    orgId: "org_1",
    customerId: "cust_002",
    customerName: "Park Ridge HOA",
    title: "Storm Damage Repair - 12 Units",
    description: "Hail damage across 12 units. Insurance claim #INC-20240115.",
    address: "800 Park Ridge Blvd, Austin TX 78702",
    status: "quoted",
    quotedAmount: 42000,
    createdAt: "2026-03-01",
    updatedAt: "2026-03-05",
  },
  {
    id: "job_003",
    orgId: "org_1",
    customerId: "cust_003",
    customerName: "Pinnacle Warehousing LLC",
    title: "Flat Roof Coating - Commercial",
    address: "2200 Industrial Pkwy, Round Rock TX 78665",
    status: "approved",
    quotedAmount: 11200,
    approvedAmount: 11200,
    createdAt: "2026-03-03",
    updatedAt: "2026-03-10",
  },
  {
    id: "job_004",
    orgId: "org_1",
    customerId: "cust_004",
    customerName: "Raj Sharma",
    title: "Roof Inspection + Minor Repair",
    address: "304 Willow Bend Ct, Cedar Park TX 78613",
    status: "completed",
    quotedAmount: 850,
    approvedAmount: 850,
    createdAt: "2026-03-02",
    updatedAt: "2026-03-04",
  },
  {
    id: "job_005",
    orgId: "org_1",
    customerId: "cust_005",
    customerName: "Linwood Builders",
    title: "New Construction Roof - 4BD Home",
    address: "5511 Sunrise Meadow, Pflugerville TX 78660",
    status: "new",
    quotedAmount: 22400,
    createdAt: "2026-03-07",
    updatedAt: "2026-03-07",
  },
  {
    id: "job_006",
    orgId: "org_1",
    customerId: "cust_006",
    customerName: "Maria Gomez",
    title: "Gutter Replacement + Downspouts",
    address: "712 Blue Sage Dr, Austin TX 78749",
    status: "quoted",
    quotedAmount: 3200,
    notes: "Customer wants white aluminum gutters to match fascia.",
    createdAt: "2026-02-25",
    updatedAt: "2026-02-28",
  },
  {
    id: "job_007",
    orgId: "org_1",
    customerId: "cust_007",
    customerName: "Douglas Whitfield",
    title: "Emergency Leak Repair",
    address: "89 Clearwater Pass, Austin TX 78703",
    status: "invoiced",
    quotedAmount: 1400,
    approvedAmount: 1400,
    createdAt: "2026-03-04",
    updatedAt: "2026-03-06",
  },
  {
    id: "job_008",
    orgId: "org_1",
    customerId: "cust_008",
    customerName: "Westfield Property Mgmt",
    title: "Multi-Unit Roof Repair - 6 Townhomes",
    address: "300-360 Westfield Row, Austin TX 78704",
    status: "in_progress",
    quotedAmount: 28600,
    approvedAmount: 28600,
    createdAt: "2026-02-25",
    updatedAt: "2026-03-08",
  },
  {
    id: "job_009",
    orgId: "org_1",
    customerId: "cust_009",
    customerName: "Hernandez Residence",
    title: "Skylight Installation x3",
    address: "455 Creekwood Dr, Bastrop TX 78602",
    status: "quoted",
    quotedAmount: 7800,
    createdAt: "2026-03-08",
    updatedAt: "2026-03-09",
  },
  {
    id: "job_010",
    orgId: "org_1",
    customerId: "cust_010",
    customerName: "Summit Dental Group",
    title: "Commercial Roof Inspection",
    address: "920 Medical Dr, Austin TX 78756",
    status: "new",
    quotedAmount: 450,
    createdAt: "2026-03-10",
    updatedAt: "2026-03-10",
  },
  {
    id: "job_011",
    orgId: "org_1",
    customerId: "cust_005",
    customerName: "Linwood Builders",
    title: "Garage Roof Repair",
    address: "5511 Sunrise Meadow, Pflugerville TX 78660",
    status: "completed",
    quotedAmount: 2200,
    approvedAmount: 2200,
    createdAt: "2026-02-10",
    updatedAt: "2026-02-20",
  },
  {
    id: "job_012",
    orgId: "org_1",
    customerId: "cust_001",
    customerName: "Henderson Family",
    title: "Gutter Cleaning",
    address: "142 Oak Creek Dr, Austin TX 78701",
    status: "invoiced",
    quotedAmount: 350,
    approvedAmount: 350,
    createdAt: "2026-01-15",
    updatedAt: "2026-01-20",
  },
];

// ── Revenue data ────────────────────────────────────────────
export const MONTHLY_REVENUE = [
  { month: "Oct", revenue: 52000, jobs: 11 },
  { month: "Nov", revenue: 44000, jobs: 9 },
  { month: "Dec", revenue: 29000, jobs: 6 },
  { month: "Jan", revenue: 35000, jobs: 7 },
  { month: "Feb", revenue: 61000, jobs: 13 },
  { month: "Mar", revenue: 54000, jobs: 10 },
];

// ── Helpers ─────────────────────────────────────────────────
export function getOrgJobs(orgId: string): Job[] {
  return JOBS.filter((j) => j.orgId === orgId);
}

export function getOrgCustomers(orgId: string): Customer[] {
  return CUSTOMERS.filter((c) => c.orgId === orgId);
}

export function getOrgMembers(orgId: string): Member[] {
  return MEMBERS.filter((m) => m.orgId === orgId);
}

export function getCustomerJobs(customerId: string): Job[] {
  return JOBS.filter((j) => j.customerId === customerId);
}

export function getDashboardStats(orgId: string) {
  const jobs = getOrgJobs(orgId);
  const today = new Date().toISOString().slice(0, 10);

  const todaysJobs = jobs.filter(
    (j) => j.status === "in_progress" || j.status === "approved"
  ).length;

  const completedOrInvoiced = jobs.filter(
    (j) => j.status === "completed" || j.status === "invoiced"
  );
  const revenue = completedOrInvoiced.reduce(
    (sum, j) => sum + (j.approvedAmount ?? j.quotedAmount),
    0
  );

  const quoted = jobs.filter((j) => j.status === "quoted");
  const pendingQuotesValue = quoted.reduce((sum, j) => sum + j.quotedAmount, 0);

  const totalQuoted = jobs.filter(
    (j) => j.status !== "new"
  ).length;
  const approved = jobs.filter(
    (j) =>
      j.status === "approved" ||
      j.status === "in_progress" ||
      j.status === "completed" ||
      j.status === "invoiced"
  ).length;
  const closeRate = totalQuoted > 0 ? Math.round((approved / totalQuoted) * 100) : 0;

  const activeJobs = jobs.filter(
    (j) => j.status === "in_progress" || j.status === "approved"
  ).length;

  return {
    todaysJobs,
    revenue,
    pendingQuotes: quoted.length,
    pendingQuotesValue,
    closeRate,
    activeJobs,
  };
}
