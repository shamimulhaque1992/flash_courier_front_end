"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateReview } from "@/hooks/review.hook";
import type { Shipment } from "@/types";

interface Props {
  shipment: Shipment | null;
  onClose: () => void;
}

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <Star
              className={`size-7 transition-colors ${
                star <= (hovered || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewDialog({ shipment, onClose }: Props) {
  const [merchantRating, setMerchantRating] = useState(0);
  const [riderRating, setRiderRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate, isPending } = useCreateReview();

  const reset = () => {
    setMerchantRating(0);
    setRiderRating(0);
    setComment("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!shipment) return;
    if (merchantRating === 0 || riderRating === 0) {
      toast.add({
        title: "Rating required",
        description: "Please rate both the merchant and the rider.",
        type: "error",
      });
      return;
    }
    mutate(
      {
        shipmentId: shipment.id,
        merchantRating,
        riderRating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Review submitted!",
            description: "Thank you for your feedback.",
            type: "success",
          });
          handleClose();
        },
        onError: (err) =>
          toast.add({ title: "Failed", description: err.message, type: "error" }),
      },
    );
  };

  return (
    <Dialog open={!!shipment} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Delivery</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Tracking:{" "}
          <span className="font-mono font-medium">
            {shipment?.trackingNumber}
          </span>
        </p>

        <div className="space-y-5 py-2">
          <StarRating
            label="Merchant Rating"
            value={merchantRating}
            onChange={setMerchantRating}
          />
          <StarRating
            label="Rider Rating"
            value={riderRating}
            onChange={setRiderRating}
          />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Comment (optional)</p>
            <Textarea
              placeholder="Share your experience…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending || merchantRating === 0 || riderRating === 0}
            onClick={handleSubmit}
          >
            {isPending ? "Submitting…" : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
