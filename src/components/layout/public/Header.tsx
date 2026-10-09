"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import type { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

const dashboardRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/super-admin",
  ADMIN: "/admin",
  MERCHANT: "/merchant",
  RIDER: "/rider",
  CUSTOMER: "/customer",
};

const navLinks = [
  { name: "Home", url: "/" },
  { name: "Track Parcel", url: "/track" },
  { name: "About Us", url: "/about-us" },
];

export default function Header() {
  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const role = data?.data?.role as UserRole | undefined;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Logged out",
          description: "Logged out successfully",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-4">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Logo />
          <span>Flash Courier</span>
        </Link>

        <nav className="flex gap-6">
          {navLinks.map((route) => (
            <Link
              key={route.url}
              href={route.url}
              className="text-sm hover:text-primary transition-colors"
            >
              {route.name}
            </Link>
          ))}
          {role && (
            <Link
              href={dashboardRoute[role]}
              className="text-sm hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isLoading && !data && (
            <>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/apply/merchant" />}
                nativeButton={false}
              >
                Apply as Merchant
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/apply/rider" />}
                nativeButton={false}
              >
                Apply as Rider
              </Button>
              <Button
                variant="default"
                size="sm"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Login
              </Button>
            </>
          )}
          {!isLoading && data && (
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
