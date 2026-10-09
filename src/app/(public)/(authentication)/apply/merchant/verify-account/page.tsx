import Link from "next/link";
import { Suspense } from "react";
import Logo from "@/assets/svg/Logo";
import AuthPromoPanel from "@/components/auth/auth-promo-panel";
import VerifyAccountForm from "@/components/form/verify-account-form";

export default function VerifyMerchantAccountPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo />
            <span>Flash Courier</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense fallback={<p>Loading...</p>}>
              <VerifyAccountForm mode="merchant" />
            </Suspense>
          </div>
        </div>
      </div>
      <AuthPromoPanel
        alt="Flash Courier email verification"
        src="/verify-account.png"
      />
    </div>
  );
}
