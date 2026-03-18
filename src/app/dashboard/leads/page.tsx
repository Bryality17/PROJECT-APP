"use client";

import { Topbar } from "@/components/layout/topbar";
import { useOrg } from "@/components/layout/org-context";

export default function LeadsPage() {
  const { currentOrg } = useOrg();
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar currentOrg={currentOrg} title="Leads" subtitle="Coming soon" />
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p className="text-sm">Leads module coming in V2</p>
      </div>
    </div>
  );
}
