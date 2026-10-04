import {
  approveMerchant,
  approveRider,
  applyAsMerchant,
  applyAsRider,
  getAllMerchants,
  getAllRiders,
  getMerchantById,
  getRiderById,
  verifyMerchantEmail,
  verifyRiderEmail,
} from "@/api";
import type { MerchantParams, RiderParams } from "@/types";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export function useApplyAsMerchant() {
  return useMutation({ mutationFn: applyAsMerchant });
}

export function useVerifyMerchantEmail() {
  return useMutation({ mutationFn: verifyMerchantEmail });
}

export function useGetAllMerchants(params: MerchantParams) {
  return useQuery({
    queryKey: ["merchants", params],
    queryFn: () => getAllMerchants(params),
  });
}

export function useSuspenseGetAllMerchants(params: MerchantParams) {
  return useSuspenseQuery({
    queryKey: ["merchants", params],
    queryFn: () => getAllMerchants(params),
  });
}

export function useGetMerchantById(merchantId: string) {
  return useQuery({
    queryKey: ["merchant", merchantId],
    queryFn: () => getMerchantById(merchantId),
    enabled: !!merchantId,
  });
}

export function useApproveMerchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveMerchant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
  });
}

export function useApplyAsRider() {
  return useMutation({ mutationFn: applyAsRider });
}

export function useVerifyRiderEmail() {
  return useMutation({ mutationFn: verifyRiderEmail });
}

export function useGetAllRiders(params: RiderParams) {
  return useQuery({
    queryKey: ["riders", params],
    queryFn: () => getAllRiders(params),
  });
}

export function useSuspenseGetAllRiders(params: RiderParams) {
  return useSuspenseQuery({
    queryKey: ["riders", params],
    queryFn: () => getAllRiders(params),
  });
}

export function useGetRiderById(riderId: string) {
  return useQuery({
    queryKey: ["rider", riderId],
    queryFn: () => getRiderById(riderId),
    enabled: !!riderId,
  });
}

export function useApproveRider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveRider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riders"] });
    },
  });
}
