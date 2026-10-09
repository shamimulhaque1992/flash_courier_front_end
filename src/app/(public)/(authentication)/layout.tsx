import GuestGuard from "@/components/auth/guest-guard";
import type { ReactNode } from "react";

export default function AuthenticationLayout({ children }: { children: ReactNode }) {
  return <GuestGuard>{children}</GuestGuard>;
}
