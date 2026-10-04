"use client";

import {
  BadgeCheck,
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useApproveMerchant, useGetMerchantById } from "@/hooks";
import { toast } from "@/components/ui/toast";
import type { ApproveMerchantPayload } from "@/types";

interface Props {
  selectedId: string;
  onClose: () => void;
}

export default function MerchantReviewSheet({ selectedId, onClose }: Props) {
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading } = useGetMerchantById(selectedId);
  const { mutate: approve, isPending } = useApproveMerchant();

  const merchant = data?.data;

  const handleClose = () => {
    setConfirmRejection(false);
    setRejectionReason("");
    onClose();
  };

  const handleReviewAction = (status: "VERIFIED" | "REJECTED") => {
    const payload: ApproveMerchantPayload = {
      merchantId: selectedId,
      verificationStatus: status,
      ...(status === "REJECTED" ? { rejectionReason } : {}),
    };

    approve(payload, {
      onSuccess: () => {
        toast.add({
          title: status === "VERIFIED" ? "Application Approved" : "Application Rejected",
          description: `Merchant application has been ${status.toLowerCase()}.`,
          type: "success",
        });
        handleClose();
      },
      onError: (err) => {
        toast.add({
          title: "Action Failed",
          description: err.message || "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const detailRow = (label: string, value?: string | null) => (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium break-all">
        {value ?? <span className="font-normal text-muted-foreground">—</span>}
      </span>
    </div>
  );

  return (
    <Sheet open={!!selectedId} onOpenChange={handleClose}>
      <SheetContent side="left" className="gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Review merchant application</SheetTitle>
          <SheetDescription>
            Verify the details below before approving or rejecting. This action cannot be undone.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : merchant ? (
            <>
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-primary/10 p-2.5">
                  <Building2 className="size-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{merchant.name}</p>
                  <p className="text-sm text-muted-foreground">{merchant.businessType}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Contact
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate" title={merchant.email}>{merchant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  <span>{merchant.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 shrink-0 text-muted-foreground" />
                  <span>{merchant.address}, {merchant.thana}, {merchant.district}, {merchant.division}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Business Details
                </p>
                {detailRow("Trade License No.", merchant.tradeLicenseNumber)}
                {detailRow("Business License No.", merchant.businessLicenseNumber)}
                {detailRow("Business Description", merchant.businessDescription)}
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Documents
                </p>
                <a
                  href={merchant.businessLicenseDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary underline underline-offset-4"
                >
                  <FileText className="size-4 shrink-0" />
                  View Business License Document
                </a>
                {merchant.additionalDocuments?.length > 0 && (
                  <div className="space-y-1">
                    {merchant.additionalDocuments.map((doc, i) => (
                      <a
                        key={doc.publicId}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary underline underline-offset-4"
                      >
                        <FileText className="size-4 shrink-0" />
                        Additional Document {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Verification
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                  <span>{merchant.verificationStatus}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="size-4 shrink-0 text-muted-foreground" />
                  <span>
                    {merchant.user.emailVerified ? "Email verified" : "Email not verified"}
                  </span>
                </div>
                {merchant.rejectionReason && (
                  <p className="text-sm text-destructive">
                    Rejection reason: {merchant.rejectionReason}
                  </p>
                )}
              </div>
            </>
          ) : null}
        </div>

        <SheetFooter className="border-t">
          {confirmRejection ? (
            <div className="flex w-full flex-col gap-3">
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Tell the merchant why this application is being rejected…"
                rows={4}
                disabled={isPending}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReviewAction("REJECTED")}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                  disabled={!rejectionReason.trim() || isPending}
                >
                  {isPending && <Spinner />}
                  {isPending ? "Rejecting…" : "Confirm Rejection"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex w-full gap-2">
              <Button
                onClick={() => setConfirmRejection(true)}
                variant="destructive"
                size="lg"
                className="flex-1"
                disabled={isPending || isLoading}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleReviewAction("VERIFIED")}
                variant="default"
                size="lg"
                className="flex-1"
                disabled={isPending || isLoading}
              >
                {isPending && <Spinner />}
                {isPending ? "Approving…" : "Approve"}
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
