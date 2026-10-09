import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import AuthPromoPanel from "@/components/auth/auth-promo-panel";
import RiderApplyForm from "@/components/form/rider-apply-form";

export default function ApplyAsRiderPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 lg:pr-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo />
            <span>Flash Courier</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center lg:justify-end">
          <div className="w-full max-w-xl">
            <RiderApplyForm />
          </div>
        </div>
      </div>
      <AuthPromoPanel
        alt="Flash Courier rider delivering parcels by bicycle"
        src="/apply-as-rider.png"
      />
    </div>
  );
}
