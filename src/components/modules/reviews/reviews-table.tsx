"use client";

import { format } from "date-fns";
import { SearchX, Star, Trash2 } from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import useDebounce from "@/hooks/debounce.hook";

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

function ReviewsTableInner({
  params,
  role,
  onPageChange,
}: {
  params: ReviewParams;
  role: Role;
  onPageChange: (p: number) => void;
}) {
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

  const handleDelete = (id: string) => {
    del(id, {
      onSuccess: () => toast.add({ title: "Review deleted", type: "success" }),
      onError: (err) => toast.add({ title: "Failed", description: err.message, type: "error" }),
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <span className="rounded-full bg-muted p-3">
          <SearchX className="size-5 text-muted-foreground" />
        </span>
        <p className="font-medium">No reviews found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tracking #</TableHead>
              {(role === "admin" || role === "merchant" || role === "rider") && (
                <TableHead>Customer</TableHead>
              )}
              {(role === "admin" || role === "customer") && (
                <TableHead>Merchant</TableHead>
              )}
              {(role === "admin" || role === "customer" || role === "merchant") && (
                <TableHead>Rider</TableHead>
              )}
              <TableHead>Merchant ★</TableHead>
              <TableHead>Rider ★</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
              {(role === "admin" || role === "customer") && (
                <TableHead className="text-right">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs font-medium">
                  {r.shipment.trackingNumber}
                </TableCell>
                {(role === "admin" || role === "merchant" || role === "rider") && (
                  <TableCell className="text-sm">
                    {r.customer?.name ?? "—"}
                  </TableCell>
                )}
                {(role === "admin" || role === "customer") && (
                  <TableCell className="text-sm">
                    {r.merchant?.name ?? "—"}
                  </TableCell>
                )}
                {(role === "admin" || role === "customer" || role === "merchant") && (
                  <TableCell className="text-sm">
                    {r.rider?.name ?? "—"}
                  </TableCell>
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
                {(role === "admin" || role === "customer") && (
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
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="my-5">
          <TablePagination
            page={params.page ?? 1}
            totalPages={totalPages}
            handlePageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {Array.from({ length: 6 }).map((_, i) => (
              <TableHead key={i}><Skeleton className="h-4 w-20" /></TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ReviewsTable({ role }: { role: Role }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const params: ReviewParams = {
    page,
    limit: 10,
    searchTerm: debouncedSearch || undefined,
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by tracking #…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="max-w-sm"
      />
      <Suspense fallback={<TableSkeleton />}>
        <ReviewsTableInner params={params} role={role} onPageChange={setPage} />
      </Suspense>
    </div>
  );
}
