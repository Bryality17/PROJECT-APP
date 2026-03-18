"use client";

import { useState } from "react";
import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrgJobs, getOrgCustomers } from "@/lib/mock-data";
import { Job, JobStatus, Customer } from "@/types";
import {
  JOB_STATUS_CONFIG,
  PIPELINE_ORDER,
  formatCurrency,
  formatDate,
  cn,
} from "@/lib/utils";
import {
  LayoutList,
  LayoutGrid,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";

export default function JobsPage() {
  const { currentOrg } = useOrg();
  const allJobs = getOrgJobs(currentOrg.id);
  const customers = getOrgCustomers(currentOrg.id);

  const [view, setView] = useState<"list" | "kanban">("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = allJobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Job Board"
        subtitle={`${allJobs.length} total jobs`}
        action={
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-3.5 h-3.5" /> New Job
          </Button>
        }
      />

      <div className="flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs or customers..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                statusFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              All ({allJobs.length})
            </button>
            {PIPELINE_ORDER.map((s) => {
              const cfg = JOB_STATUS_CONFIG[s];
              const count = allJobs.filter((j) => j.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                    statusFilter === s
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} border`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cfg.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                view === "list" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                view === "kanban" ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-100"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {view === "list" ? (
            <ListView jobs={filtered} onSelect={setSelectedJob} selectedId={selectedJob?.id} />
          ) : (
            <KanbanView jobs={filtered} onSelect={setSelectedJob} />
          )}

          {selectedJob && (
            <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateJobModal
          customers={customers}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

/* ── List View ─────────────────────────────────────────────── */

function ListView({
  jobs,
  onSelect,
  selectedId,
}: {
  jobs: Job[];
  onSelect: (j: Job) => void;
  selectedId?: string;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <tr>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Job / Customer</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Status</th>
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Created</th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Quoted</th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Approved</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {jobs.map((job) => {
            const cfg = JOB_STATUS_CONFIG[job.status];
            return (
              <tr
                key={job.id}
                onClick={() => onSelect(job)}
                className={cn(
                  "cursor-pointer hover:bg-orange-50/50 transition-colors",
                  selectedId === job.id && "bg-orange-50"
                )}
              >
                <td className="px-6 py-3.5">
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.customerName}</p>
                </td>
                <td className="px-3 py-3.5">
                  <Badge color={cfg.color} bg={cfg.bg} border={cfg.border}>{cfg.label}</Badge>
                </td>
                <td className="px-3 py-3.5">
                  <span className="text-xs text-gray-500">{formatDate(job.createdAt)}</span>
                </td>
                <td className="px-6 py-3.5 text-right font-semibold text-gray-900">
                  {formatCurrency(job.quotedAmount)}
                </td>
                <td className="px-6 py-3.5 text-right font-semibold text-gray-900">
                  {job.approvedAmount ? formatCurrency(job.approvedAmount) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-sm font-medium">No jobs match your filters</p>
        </div>
      )}
    </div>
  );
}

/* ── Kanban View ───────────────────────────────────────────── */

function KanbanView({ jobs, onSelect }: { jobs: Job[]; onSelect: (j: Job) => void }) {
  return (
    <div className="flex-1 overflow-x-auto p-4">
      <div className="flex gap-3 h-full min-w-max">
        {PIPELINE_ORDER.map((status) => {
          const cfg = JOB_STATUS_CONFIG[status];
          const colJobs = jobs.filter((j) => j.status === status);
          const total = colJobs.reduce((s, j) => s + j.quotedAmount, 0);
          return (
            <div key={status} className="w-72 flex flex-col">
              <div className={cn("rounded-t-xl px-3 py-2.5 border border-b-0", cfg.bg, cfg.border)}>
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-bold uppercase tracking-wider", cfg.color)}>{cfg.label}</span>
                  <span className={cn("text-xs font-semibold rounded-full px-2 py-0.5", cfg.bg, cfg.color, "border", cfg.border)}>
                    {colJobs.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(total)}</p>
              </div>
              <div className={cn("flex-1 overflow-y-auto bg-gray-50 rounded-b-xl border", cfg.border, "p-2 space-y-2")}>
                {colJobs.map((job) => (
                  <KanbanCard key={job.id} job={job} onClick={() => onSelect(job)} />
                ))}
                {colJobs.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-xs">No jobs</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-gray-200 p-3 text-left hover:shadow-md hover:border-orange-200 transition-all group"
    >
      <p className="text-sm font-medium text-gray-900 leading-snug group-hover:text-orange-600">{job.title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{job.customerName}</p>
      <div className="flex items-center justify-between mt-2.5">
        <span className="text-xs text-gray-400">{formatDate(job.createdAt)}</span>
        <span className="text-sm font-bold text-gray-900">{formatCurrency(job.quotedAmount)}</span>
      </div>
    </button>
  );
}

/* ── Job Detail Panel ──────────────────────────────────────── */

function JobDetail({ job, onClose }: { job: Job; onClose: () => void }) {
  const cfg = JOB_STATUS_CONFIG[job.status];
  const customer = getOrgCustomers("org_1").find((c) => c.id === job.customerId);

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
      <div className="flex items-start justify-between p-5 border-b border-gray-100">
        <div className="flex-1 min-w-0">
          <Badge color={cfg.color} bg={cfg.bg} border={cfg.border} className="mb-2">{cfg.label}</Badge>
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">{job.title}</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2 text-lg leading-none">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Value */}
        <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
          <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Quoted</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(job.quotedAmount)}</p>
          {job.approvedAmount && (
            <p className="text-xs text-green-600 font-medium mt-1">
              Approved: {formatCurrency(job.approvedAmount)}
            </p>
          )}
        </div>

        {/* Customer info */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
          <p className="text-sm font-medium text-gray-900">{job.customerName}</p>
          {customer?.email && (
            <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 mt-1">
              <Mail className="w-3 h-3" /> {customer.email}
            </a>
          )}
          {customer?.phone && (
            <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 mt-1">
              <Phone className="w-3 h-3" /> {customer.phone}
            </a>
          )}
          {job.address && (
            <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> {job.address}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400 font-medium">Created</p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatDate(job.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Updated</p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatDate(job.updatedAt)}</p>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description</p>
            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100 leading-relaxed">{job.description}</p>
          </div>
        )}

        {/* Notes */}
        {job.notes && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Notes</p>
            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100 leading-relaxed">{job.notes}</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1">Edit Job</Button>
        <Button size="sm" className="flex-1">Update Status</Button>
      </div>
    </div>
  );
}

/* ── Create Job Modal ──────────────────────────────────────── */

function CreateJobModal({
  customers,
  onClose,
}: {
  customers: Customer[];
  onClose: () => void;
}) {
  const [customerMode, setCustomerMode] = useState<"existing" | "new">("existing");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quotedAmount, setQuotedAmount] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Create New Job</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Customer Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">Customer</label>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setCustomerMode("existing")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  customerMode === "existing" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                Existing Customer
              </button>
              <button
                onClick={() => setCustomerMode("new")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  customerMode === "new" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                )}
              >
                New Customer
              </button>
            </div>

            {customerMode === "existing" ? (
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Job Details */}
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">Job Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Roof Replacement"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job details..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">Estimated Value ($)</label>
              <input
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(e.target.value)}
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Job site address"
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1">
            <Plus className="w-4 h-4" /> Create Job
          </Button>
        </div>
      </div>
    </div>
  );
}
