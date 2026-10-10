import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  deleteReview,
  getAllReviews,
  getMerchantReviews,
  getMyReviews,
  getRiderReviews,
} from "@/api";
import type { ReviewParams } from "@/api/reviews-list.api";

export function useSuspenseGetMyReviews(params: ReviewParams) {
  return useSuspenseQuery({
    queryKey: ["my-reviews", params],
    queryFn: () => getMyReviews(params),
  });
}

export function useSuspenseGetMerchantReviews(params: ReviewParams) {
  return useSuspenseQuery({
    queryKey: ["merchant-reviews", params],
    queryFn: () => getMerchantReviews(params),
  });
}

export function useSuspenseGetRiderReviews(params: ReviewParams) {
  return useSuspenseQuery({
    queryKey: ["rider-reviews", params],
    queryFn: () => getRiderReviews(params),
  });
}

export function useSuspenseGetAllReviews(params: ReviewParams) {
  return useSuspenseQuery({
    queryKey: ["all-reviews", params],
    queryFn: () => getAllReviews(params),
  });
}

export function useDeleteReview(queryKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}
