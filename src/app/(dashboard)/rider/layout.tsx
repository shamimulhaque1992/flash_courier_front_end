import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { ReactNode } from "react";

export default function RiderLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["RIDER"]}>
      <DashboardShell role="RIDER">{children}</DashboardShell>
    </RoleGuard>
  );
}
