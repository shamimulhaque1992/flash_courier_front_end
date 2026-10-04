import Logo from "@/assets/svg/Logo";
import RegisterForm from "@/components/form/register-form";
import Link from "next/link";

export default function RegisterPage() {
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
          <div className="w-full max-w-lg">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
          <div className="text-center text-white px-8">
            <h2 className="text-4xl font-bold mb-4">Join Flash Courier</h2>
            <p className="text-lg opacity-90">
              Fast, reliable delivery at your fingertips
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
