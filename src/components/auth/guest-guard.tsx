"use client";

import { useGetMe } from "@/hooks";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import AuthLoading from "./auth-loading";

export default function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, fetchStatus } = useGetMe();
  const user = data?.data;
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (user) {
      setRedirecting(true);
      router.replace("/");
    }
  }, [isPending, user, router]);

  if (isPending || fetchStatus === "fetching" || redirecting)
    return <AuthLoading />;
  if (user) return <AuthLoading label="Redirecting..." />;

  return <>{children}</>;
}
