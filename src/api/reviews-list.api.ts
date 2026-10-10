import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export interface ReviewRecord {
  id: string;
  shipmentId: string;
  merchantId: string;
  riderId: string;
  customerId: string;
  merchantRating: number;
  riderRating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  shipment: { trackingNumber: string; receiverName: string };
  merchant?: { name: string; email?: string } | null;
  rider?: { name: string; email?: string } | null;
  customer?: { name: string; email: string } | null;
}

export interface ReviewParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export function getMyReviews(params: ReviewParams) {
  return apiClient<ApiResponse<ReviewRecord[]>>("/reviews/my-reviews", { params });
}

export function getMerchantReviews(params: ReviewParams) {
  return apiClient<ApiResponse<ReviewRecord[]>>("/reviews/merchant-reviews", { params });
}

export function getRiderReviews(params: ReviewParams) {
  return apiClient<ApiResponse<ReviewRecord[]>>("/reviews/rider-reviews", { params });
}

export function getAllReviews(params: ReviewParams) {
  return apiClient<ApiResponse<ReviewRecord[]>>("/reviews/all", { params });
}

export function deleteReview(reviewId: string) {
  return apiClient(`/reviews/${reviewId}`, { method: "DELETE" });
}
