import {
  assignShipment,
  calculateShipmentPrice,
  cancelShipment,
  createShipment,
  getAllShipments,
  getCustomerShipments,
  getMyMerchantProfile,
  getMyRiderShipments,
  getMyShipments,
  getSingleCustomerShipment,
  markShipmentDelivered,
  repayShipment,
  respondToShipment,
  trackShipmentPublic,
  updateShipmentStatus,
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

export function useSuspenseGetAllShipments(params: ShipmentParams) {
  return useSuspenseQuery({
    queryKey: ["all-shipments", params],
    queryFn: () => getAllShipments(params),
  });
}

export function useUpdateShipmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShipmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-shipments"] });
    },
  });
}

export function useAssignShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-shipments"] });
    },
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

export function useSuspenseGetMyRiderShipments(params: ShipmentParams) {
  return useSuspenseQuery({
    queryKey: ["my-rider-shipments", params],
    queryFn: () => getMyRiderShipments(params),
  });
}

export function useRespondToShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: respondToShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rider-shipments"] });
    },
  });
}

export function useMarkShipmentDelivered() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markShipmentDelivered,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rider-shipments"] });
    },
  });
}

export function useTrackShipmentPublic(trackingNumber: string) {
  return useQuery({
    queryKey: ["track-shipment", trackingNumber],
    queryFn: () => trackShipmentPublic(trackingNumber),
    enabled: !!trackingNumber,
  });
}

export function useSuspenseGetCustomerShipments(params: ShipmentParams) {
  return useSuspenseQuery({
    queryKey: ["customer-shipments", params],
    queryFn: () => getCustomerShipments(params),
  });
}

export function useGetSingleCustomerShipment(shipmentId: string) {
  return useQuery({
    queryKey: ["customer-shipment", shipmentId],
    queryFn: () => getSingleCustomerShipment(shipmentId),
    enabled: !!shipmentId,
  });
}
