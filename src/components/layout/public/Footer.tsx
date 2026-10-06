import Link from "next/link";
import Logo from "@/assets/svg/Logo";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
            <span>Flash Courier</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Fast, reliable parcel delivery across all divisions of Bangladesh.
          </p>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-sm">Quick Links</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li><Link href="/track" className="hover:text-foreground transition-colors">Track Parcel</Link></li>
            <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-sm">Join Us</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/apply/merchant" className="hover:text-foreground transition-colors">Apply as Merchant</Link></li>
            <li><Link href="/apply/rider" className="hover:text-foreground transition-colors">Apply as Rider</Link></li>
            <li><Link href="/register" className="hover:text-foreground transition-colors">Register</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-medium text-sm">Coverage</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet", "Barisal", "Rangpur", "Mymensingh"].map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Flash Courier. All rights reserved.
      </div>
    </footer>
  );
}
