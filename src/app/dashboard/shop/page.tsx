"use client";

import { Topbar } from "@/components/layout/topbar";
import { useOrg } from "@/components/layout/org-context";

export default function ShopPage() {
  const { currentOrg } = useOrg();
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar currentOrg={currentOrg} title="Shop" subtitle="Coming soon" />
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p className="text-sm">Shop module coming in V2</p>
      </div>
    </div>
  );
}
