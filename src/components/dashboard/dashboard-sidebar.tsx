"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/assets/svg/Logo";
import type { UserRole, SidebarItems } from "@/types";
import {
  superAdminRoutes,
  adminRoutes,
  merchantRoutes,
  riderRoutes,
  customerRoutes,
} from "@/routes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetMe, useLogout } from "@/hooks";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "../ui/toast";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
  SUPER_ADMIN: superAdminRoutes,
  ADMIN: adminRoutes,
  MERCHANT: merchantRoutes,
  RIDER: riderRoutes,
  CUSTOMER: customerRoutes,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();
  const routes: SidebarItems = sidebarRoutes[role] || [];

  const { data: me } = useGetMe();
  const { mutate: logout, isPending } = useLogout();

  const user = (me as { data?: { name?: string; email?: string } })?.data;

  function handleLogout() {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Logged out",
          description: "Logged out successfully",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
        router.push("/");
      },
    });
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-medium">Flash Courier</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={pathname === item.url}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold uppercase text-sidebar-accent-foreground">
            {user?.name?.[0] ?? "?"}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{user?.name ?? "—"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email ?? "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-50 group-data-[collapsible=icon]:hidden"
            title="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
