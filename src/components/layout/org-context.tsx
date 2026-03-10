"use client";

import { createContext, useContext, useState } from "react";
import { Org } from "@/types";
import { ORGS } from "@/lib/mock-data";

interface OrgContextValue {
  currentOrg: Org;
  setCurrentOrg: (org: Org) => void;
}

const OrgContext = createContext<OrgContextValue>({
  currentOrg: ORGS[0],
  setCurrentOrg: () => {},
});

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<Org>(ORGS[0]);
  return (
    <OrgContext.Provider value={{ currentOrg, setCurrentOrg }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  return useContext(OrgContext);
}
