import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Role = "admin" | "merchant" | "customer" | "rider";

export default function ReviewsTableLoading({ role }: { role: Role }) {
  const showCustomer = role === "admin" || role === "merchant" || role === "rider";
  const showMerchant = role === "admin" || role === "customer";
  const showRider = role === "admin" || role === "customer" || role === "merchant";
  const showAction = role === "admin" || role === "customer";

  const cols =
    4 +
    (showCustomer ? 1 : 0) +
    (showMerchant ? 1 : 0) +
    (showRider ? 1 : 0) +
    (showAction ? 1 : 0);

  return (
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
          {Array.from({ length: 6 }).map((_, i) => (
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
