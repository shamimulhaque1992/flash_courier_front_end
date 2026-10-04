import {
  calculateShipmentPrice,
  cancelShipment,
  createShipment,
  getMyMerchantProfile,
  getMyShipments,
  repayShipment,
} from "@/api";
import type { ShipmentParams } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useCalculateShipmentPrice() {
  return useMutation({ mutationFn: calculateShipmentPrice });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-shipments"] });
    },
  });
}

export function useSuspenseGetMyShipments(params: ShipmentParams) {
  return useSuspenseQuery({
    queryKey: ["my-shipments", params],
    queryFn: () => getMyShipments(params),
  });
}

export function useRepayShipment() {
  return useMutation({ mutationFn: repayShipment });
}

export function useCancelShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-shipments"] });
    },
  });
}

export function useGetMyMerchantProfile() {
  return useQuery({
    queryKey: ["my-merchant-profile"],
    queryFn: getMyMerchantProfile,
  });
}
