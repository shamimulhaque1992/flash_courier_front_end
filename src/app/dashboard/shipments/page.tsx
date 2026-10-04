import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function ShipmentPaymentCallbackPage({ searchParams }: Props) {
  const { status } = await searchParams;

  const isSuccess = status === "success";
  const isCancelled = status === "cancel" || status === "failure";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {isSuccess ? (
          <>
            <span className="rounded-full bg-green-100 p-5">
              <CheckCircle2 className="size-12 text-green-600" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your shipment has been created and payment confirmed. A
                confirmation email with your invoice has been sent to your
                registered email address.
              </p>
            </div>
          </>
        ) : isCancelled ? (
          <>
            <span className="rounded-full bg-yellow-100 p-5">
              <XCircle className="size-12 text-yellow-600" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Payment Cancelled</h1>
              <p className="text-muted-foreground">
                Your payment was cancelled. Your shipment is still saved with a
                pending payment status. You can retry the payment from your
                shipments dashboard.
              </p>
            </div>
          </>
        ) : (
          <>
            <span className="rounded-full bg-red-100 p-5">
              <AlertCircle className="size-12 text-red-600" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Payment Failed</h1>
              <p className="text-muted-foreground">
                Something went wrong with your payment. Your shipment is saved
                with a pending payment status. Please retry from your shipments
                dashboard.
              </p>
            </div>
          </>
        )}

        <Button render={<Link href="/merchant/shipments" />}>
          Go to My Shipments
        </Button>
      </div>
    </div>
  );
}
