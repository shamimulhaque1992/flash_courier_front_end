import { ArrowUpRight, House, PackageSearch } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-background px-6 py-7 md:px-12 md:py-10">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center bg-primary text-primary-foreground">
          <PackageSearch aria-hidden="true" className="size-5" />
        </span>
        <span className="font-heading text-lg font-bold">Flash Courier</span>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div className="max-w-xl">
          <p className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase text-primary">
            <span className="h-px w-8 bg-primary" />
            Delivery status: not found
          </p>
          <p className="font-heading text-[9rem] font-bold leading-[0.8] text-foreground sm:text-[11rem]">
            404
          </p>
          <h1 className="mt-9 max-w-lg font-heading text-4xl font-bold leading-tight sm:text-5xl">
            This route went nowhere.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            We couldn&apos;t find the page you were trying to reach. The address
            may be out of date, or the page may have moved.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              href="/"
            >
              <House aria-hidden="true" className="size-4" />
              Back to home
            </Link>
            <Link
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
              href="/track"
            >
              Track a shipment
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center border border-border bg-muted/40"
        >
          <div className="absolute inset-5 border border-dashed border-border" />
          <div className="absolute left-0 top-1/2 h-px w-[38%] -translate-y-1/2 bg-primary" />
          <div className="absolute right-0 top-1/2 h-px w-[38%] -translate-y-1/2 bg-destructive" />
          <span className="absolute left-[28%] top-1/2 size-3 -translate-y-1/2 border-2 border-primary bg-background" />
          <span className="absolute right-[28%] top-1/2 size-3 -translate-y-1/2 border-2 border-destructive bg-background" />
          <div className="relative flex size-36 items-center justify-center border border-foreground bg-background sm:size-44">
            <PackageSearch className="size-16 text-primary sm:size-20" />
            <span className="absolute -right-3 -top-3 bg-destructive px-2 py-1 font-mono text-xs font-bold text-white">
              LOST
            </span>
          </div>
          <span className="absolute bottom-8 font-mono text-xs uppercase text-muted-foreground">
            Route unavailable / 404
          </span>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground">
        <span>FLASH COURIER</span>
        <span>Every parcel has a destination.</span>
      </footer>
    </main>
  );
}
