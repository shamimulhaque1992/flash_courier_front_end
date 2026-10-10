"use client";

import { format } from "date-fns";
import { SearchX } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
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

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-600",
};

interface Props extends PaymentParams {
  role: "admin" | "merchant";
  handlePageChange: Dispatch<SetStateAction<number>>;
}

export default function PaymentsTable({ role, handlePageChange, ...params }: Props) {
  const { data } =
    role === "admin"
      ? useSuspenseGetAllPayments(params)
      : useSuspenseGetMyPayments(params);

  const payments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const colSpan = role === "admin" ? 7 : 6;

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
            {payments.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan}>
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                    <span className="rounded-full bg-muted p-3">
                      <SearchX className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-medium">No payments found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "No payments in this view yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs font-medium">
                    {p.shipment.trackingNumber}
                  </TableCell>
                  {role === "admin" && (
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{p.shipment.merchant?.name ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.shipment.merchant?.email}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{p.shipment.receiverName}</span>
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
