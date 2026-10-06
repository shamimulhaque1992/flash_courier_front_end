import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export interface CreateReviewPayload {
  shipmentId: string;
  merchantRating: number;
  riderRating: number;
  comment?: string;
}

export function createReview(payload: CreateReviewPayload) {
  return apiClient<ApiResponse<unknown>>("/reviews", {
    method: "POST",
    body: payload,
  });
}
