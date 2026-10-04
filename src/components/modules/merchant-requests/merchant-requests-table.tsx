import { SearchX } from "lucide-react";
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
import { useSuspenseGetAllMerchants } from "@/hooks";
import type { MerchantParams } from "@/types";

interface Props extends MerchantParams {
  handleReview: Dispatch<SetStateAction<string>>;
  handlePageChange: Dispatch<SetStateAction<number>>;
}

const statusBadge: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function MerchantRequestsTable({
  handleReview,
  handlePageChange,
  ...params
}: Props) {
  const { data } = useSuspenseGetAllMerchants(params);

  const merchants = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const isEmpty = merchants.length === 0;

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                    <span className="rounded-full bg-muted p-3">
                      <SearchX className="size-5 text-muted-foreground" />
                    </span>
                    <p className="font-medium">No merchant applications found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "There are no applications in this view yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              merchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">{merchant.name}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate text-muted-foreground"
                    title={merchant.email}
                  >
                    {merchant.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {merchant.contactNumber}
                  </TableCell>
                  <TableCell>{merchant.businessType}</TableCell>
                  <TableCell>{merchant.district}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[merchant.verificationStatus] ?? ""}`}
                    >
                      {merchant.verificationStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {merchant.user.emailVerified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(merchant.id)}
                        disabled={merchant.verificationStatus !== "PENDING"}
                      >
                        Review
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Not Verified
                      </Button>
                    )}
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
