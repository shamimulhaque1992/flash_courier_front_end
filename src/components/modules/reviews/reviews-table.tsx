"use client";

import { format } from "date-fns";
import { SearchX, Star, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { toast } from "@/components/ui/toast";
import {
  useDeleteReview,
  useSuspenseGetAllReviews,
  useSuspenseGetMerchantReviews,
  useSuspenseGetMyReviews,
  useSuspenseGetRiderReviews,
} from "@/hooks/reviews-list.hook";
import type { ReviewParams } from "@/api/reviews-list.api";

type Role = "admin" | "merchant" | "customer" | "rider";

const QUERY_KEY: Record<Role, string> = {
  admin: "all-reviews",
  merchant: "merchant-reviews",
  customer: "my-reviews",
  rider: "rider-reviews",
};

function StarDisplay({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${i < value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      ))}
    </span>
  );
}

interface Props extends ReviewParams {
  role: Role;
  handlePageChange: Dispatch<SetStateAction<number>>;
}

export default function ReviewsTable({ role, handlePageChange, ...params }: Props) {
  const hookMap = {
    admin: useSuspenseGetAllReviews,
    merchant: useSuspenseGetMerchantReviews,
    customer: useSuspenseGetMyReviews,
    rider: useSuspenseGetRiderReviews,
  };
  const { data } = hookMap[role](params);
  const { mutate: del, isPending: isDeleting } = useDeleteReview(QUERY_KEY[role]);

  const reviews = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const showCustomer = role === "admin" || role === "merchant" || role === "rider";
  const showMerchant = role === "admin" || role === "customer";
  const showRider = role === "admin" || role === "customer" || role === "merchant";
  const showAction = role === "admin" || role === "customer";

  const colSpan =
    4 +
    (showCustomer ? 1 : 0) +
    (showMerchant ? 1 : 0) +
    (showRider ? 1 : 0) +
    (showAction ? 1 : 0);

  const handleDelete = (id: string) => {
    del(id, {
      onSuccess: () => toast.add({ title: "Review deleted", type: "success" }),
      onError: (err) => toast.add({ title: "Failed", description: err.message, type: "error" }),
    });
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tracking #</TableHead>
              {showCustomer && <TableHead>Customer</TableHead>}
              {showMerchant && <TableHead>Merchant</TableHead>}
              {showRider && <TableHead>Rider</TableHead>}
              <TableHead>Merchant ★</TableHead>
              <TableHead>Rider ★</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              {showAction && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan}>
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                    <span className="rounded-full bg-muted p-3">
                      <SearchX className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-medium">No reviews found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "No reviews in this view yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {r.shipment.trackingNumber}
                  </TableCell>
                  {showCustomer && (
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{r.customer?.name ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">{r.customer?.email}</span>
                      </div>
                    </TableCell>
                  )}
                  {showMerchant && (
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{r.merchant?.name ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">{r.merchant?.email}</span>
                      </div>
                    </TableCell>
                  )}
                  {showRider && (
                    <TableCell className="text-sm">{r.rider?.name ?? "—"}</TableCell>
                  )}
                  <TableCell>
                    <StarDisplay value={r.merchantRating} />
                  </TableCell>
                  <TableCell>
                    <StarDisplay value={r.riderRating} />
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-sm text-muted-foreground">
                    {r.comment ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(r.createdAt), "PP")}
                  </TableCell>
                  {showAction && (
                    <TableCell className="text-right">
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
