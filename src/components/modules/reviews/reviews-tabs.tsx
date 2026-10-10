"use client";

import { type ChangeEvent, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/debounce.hook";
import type { ReviewParams } from "@/api/reviews-list.api";
import ReviewsTableLoading from "./reviews-table-loading";
import ReviewsTable from "./reviews-table";

type Role = "admin" | "merchant" | "customer" | "rider";

export default function ReviewsTabs({ role }: { role: Role }) {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchInput);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const queryParams: ReviewParams = {
    page,
    limit: 10,
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  return (
    <>
      <div className="flex flex-col gap-4 my-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            onChange={handleSearch}
            type="search"
            placeholder="Search by tracking #…"
            className="sm:max-w-sm"
          />
        </div>
      </div>

      <Suspense fallback={<ReviewsTableLoading role={role} />}>
        <ReviewsTable {...queryParams} role={role} handlePageChange={setPage} />
      </Suspense>
    </>
  );
}
