"use client";

import { format } from "date-fns";
import { SearchX } from "lucide-react";
import { Suspense, useState } from "react";
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
import {
  useSuspenseGetAllPayments,
  useSuspenseGetMyPayments,
} from "@/hooks/payment.hook";
import type { PaymentParams } from "@/api/payment.api";
import useDebounce from "@/hooks/debounce.hook";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-600",
};

function PaymentsTableInner({
  params,
  role,
  onPageChange,
}: {
  params: PaymentParams;
  role: "admin" | "merchant";
  onPageChange: (p: number) => void;
}) {
  const { data } =
    role === "admin"
      ? useSuspenseGetAllPayments(params)
      : useSuspenseGetMyPayments(params);

  const payments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <span className="rounded-full bg-muted p-3">
          <SearchX className="size-5 text-muted-foreground" />
        </span>
        <p className="font-medium">No payments found</p>
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
              {role === "admin" && <TableHead>Merchant</TableHead>}
              <TableHead>Receiver</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Trx ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs font-medium">
                  {p.shipment.trackingNumber}
                </TableCell>
                {role === "admin" && (
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span>{p.shipment.merchant?.name ?? "—"}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.shipment.merchant?.email}
                      </span>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-sm">
                  <div className="flex flex-col">
                    <span>{p.shipment.receiverName}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {p.shipment.receiverDistrict},{" "}
                      {p.shipment.receiverDivision.toLowerCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{p.amount} BDT</TableCell>
                <TableCell className="font-mono text-xs">
                  {p.bkashTrxId ?? "—"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[p.status] ?? ""}`}
                  >
                    {p.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(p.createdAt), "PP")}
                </TableCell>
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

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {Array.from({ length: cols }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function PaymentsTable({ role }: { role: "admin" | "merchant" }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const params: PaymentParams = {
    page,
    limit: 10,
    searchTerm: debouncedSearch || undefined,
  };

  const cols = role === "admin" ? 7 : 6;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by tracking # or Trx ID…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm"
      />
      <Suspense fallback={<TableSkeleton cols={cols} />}>
        <PaymentsTableInner
          params={params}
          role={role}
          onPageChange={setPage}
        />
      </Suspense>
    </div>
  );
}
