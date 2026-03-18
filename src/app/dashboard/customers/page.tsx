"use client";

import { useState } from "react";
import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrgCustomers, getCustomerJobs } from "@/lib/mock-data";
import { Customer, Job } from "@/types";
import {
  JOB_STATUS_CONFIG,
  formatCurrency,
  formatDate,
  cn,
} from "@/lib/utils";
import {
  Search,
  Phone,
  Mail,
  ChevronRight,
  Users,
  X,
  Briefcase,
} from "lucide-react";

export default function CustomersPage() {
  const { currentOrg } = useOrg();
  const customers = getOrgCustomers(currentOrg.id);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Customers"
        subtitle={`${customers.length} total customers`}
      />

      <div className="flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Customer List */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Jobs</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Since</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((customer) => {
                  const jobs = getCustomerJobs(customer.id);
                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className={cn(
                        "cursor-pointer hover:bg-orange-50/50 transition-colors",
                        selectedCustomer?.id === customer.id && "bg-orange-50"
                      )}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                            {customer.name.charAt(0)}
                          </div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="space-y-0.5">
                          {customer.phone && (
                            <p className="text-xs text-gray-500">{customer.phone}</p>
                          )}
                          {customer.email && (
                            <p className="text-xs text-gray-500">{customer.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-xs font-semibold text-gray-700">{jobs.length} jobs</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(customer.createdAt)}</span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <ChevronRight className="w-4 h-4 text-gray-400 inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-sm font-medium">No customers found</p>
              </div>
            )}
          </div>

          {/* Customer Detail Panel */}
          {selectedCustomer && (
            <CustomerDetail
              customer={selectedCustomer}
              onClose={() => setSelectedCustomer(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Customer Detail Panel ─────────────────────────────────── */

function CustomerDetail({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const jobs = getCustomerJobs(customer.id);
  const totalSpend = jobs
    .filter((j) => j.status === "completed" || j.status === "invoiced")
    .reduce((sum, j) => sum + (j.approvedAmount ?? j.quotedAmount), 0);

  return (
    <div className="w-96 border-l border-gray-200 bg-white flex flex-col overflow-hidden flex-shrink-0">
      <div className="flex items-start justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{customer.name}</h2>
            <p className="text-xs text-gray-500">Customer since {formatDate(customer.createdAt)}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Contact */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
          {customer.email && (
            <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 mb-1">
              <Mail className="w-3 h-3" /> {customer.email}
            </a>
          )}
          {customer.phone && (
            <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600">
              <Phone className="w-3 h-3" /> {customer.phone}
            </a>
          )}
        </div>

        {/* Total Spend */}
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
          <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Total Spend</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpend)}</p>
          <p className="text-xs text-gray-500 mt-0.5">{jobs.length} total jobs</p>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Notes</p>
            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100 leading-relaxed">{customer.notes}</p>
          </div>
        )}

        {/* Job History */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Job History</p>
          {jobs.length === 0 ? (
            <p className="text-xs text-gray-400">No jobs yet</p>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => {
                const cfg = JOB_STATUS_CONFIG[job.status];
                return (
                  <div key={job.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{job.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{formatDate(job.createdAt)}</p>
                      </div>
                      <Badge color={cfg.color} bg={cfg.bg} border={cfg.border} className="text-[10px] flex-shrink-0">
                        {cfg.label}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 mt-1">
                      {formatCurrency(job.quotedAmount)}
                    </p>
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
