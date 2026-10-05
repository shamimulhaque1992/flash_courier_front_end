"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useMarkShipmentDelivered } from "@/hooks/shipment.hook";

interface Props {
  shipmentId: string | null;
  trackingNumber: string;
  onClose: () => void;
}

export default function DeliverOtpDialog({
  shipmentId,
  trackingNumber,
  onClose,
}: Props) {
  const [otp, setOtp] = useState("");
  const { mutate, isPending } = useMarkShipmentDelivered();

  const handleConfirm = () => {
    if (!shipmentId || !otp.trim()) return;
    mutate(
      { shipmentId, otp: otp.trim() },
      {
        onSuccess: () => {
          toast.add({
            title: "Delivered!",
            description: `Shipment ${trackingNumber} marked as delivered.`,
            type: "success",
          });
          setOtp("");
          onClose();
        },
        onError: (err) =>
          toast.add({
            title: "Invalid OTP",
            description: err.message,
            type: "error",
          }),
      },
    );
  };

  return (
    <Dialog open={!!shipmentId} onOpenChange={() => { setOtp(""); onClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Delivery</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Ask the customer for their OTP and enter it below to confirm delivery
          of <span className="font-mono font-medium">{trackingNumber}</span>.
        </p>
        <Input
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="tracking-widest text-center text-lg font-semibold"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => { setOtp(""); onClose(); }}>
            Cancel
          </Button>
          <Button
            disabled={isPending || otp.trim().length < 6}
            onClick={handleConfirm}
          >
            {isPending ? "Confirming…" : "Confirm Delivery"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
