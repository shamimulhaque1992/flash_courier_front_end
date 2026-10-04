import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/toast";

const robotoHeading = Roboto({ subsets: ["latin"], variable: "--font-heading" });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flash Courier",
  description: "Fast, reliable delivery at your fingertips",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        robotoHeading.variable,
      )}
    >
      <Providers>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
