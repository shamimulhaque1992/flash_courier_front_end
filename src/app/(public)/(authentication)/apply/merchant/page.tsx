import Logo from "@/assets/svg/Logo";
import MerchantApplyForm from "@/components/form/merchant-apply-form";
import Link from "next/link";

export default function ApplyAsMerchantPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="flex flex-col col-span-2 gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo />
            <span>Flash Courier</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <MerchantApplyForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
          <div className="text-center text-white px-8">
            <h2 className="text-3xl font-bold mb-4">Become a Merchant</h2>
            <p className="text-base opacity-90">
              Grow your business with our reliable delivery network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
