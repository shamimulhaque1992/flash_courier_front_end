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
import { useSuspenseGetAllRiders } from "@/hooks";
import type { RiderParams } from "@/types";

interface Props extends RiderParams {
  handleReview: Dispatch<SetStateAction<string>>;
  handlePageChange: Dispatch<SetStateAction<number>>;
}

const statusBadge: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function RiderRequestsTable({
  handleReview,
  handlePageChange,
  ...params
}: Props) {
  const { data } = useSuspenseGetAllRiders(params);

  const riders = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const isEmpty = riders.length === 0;

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vehicle Type</TableHead>
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
                    <p className="font-medium">No rider applications found</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      {params.searchTerm
                        ? `No results for "${params.searchTerm}".`
                        : "There are no applications in this view yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              riders.map((rider) => (
                <TableRow key={rider.id}>
                  <TableCell className="font-medium">{rider.name}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate text-muted-foreground"
                    title={rider.email}
                  >
                    {rider.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {rider.contactNumber}
                  </TableCell>
                  <TableCell>{rider.vehicleType}</TableCell>
                  <TableCell>{rider.district}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[rider.verificationStatus] ?? ""}`}
                    >
                      {rider.verificationStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {rider.user.emailVerified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(rider.id)}
                        disabled={rider.verificationStatus !== "PENDING"}
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
