import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { ReactNode } from "react";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["MERCHANT"]}>
      <DashboardShell role="MERCHANT">{children}</DashboardShell>
    </RoleGuard>
  );
}
