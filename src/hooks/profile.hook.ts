import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyCustomerProfile,
  getMyMerchantProfile,
  getMyRiderProfile,
  updateCustomerProfile,
  updateMerchantProfile,
  updateRiderProfile,
  uploadProfileImage,
} from "@/api";

export function useGetMyCustomerProfile() {
  return useQuery({
    queryKey: ["my-customer-profile"],
    queryFn: getMyCustomerProfile,
  });
}

export function useGetMyRiderProfile() {
  return useQuery({
    queryKey: ["my-rider-profile"],
    queryFn: getMyRiderProfile,
  });
}

export function useGetMyMerchantProfileFull() {
  return useQuery({
    queryKey: ["my-merchant-profile-full"],
    queryFn: getMyMerchantProfile,
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-customer-profile"] });
    },
  });
}

export function useUpdateMerchantProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMerchantProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-merchant-profile-full"] });
      queryClient.invalidateQueries({ queryKey: ["my-merchant-profile"] });
    },
  });
}

export function useUpdateRiderProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRiderProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rider-profile"] });
    },
  });
}

export function useUploadProfileImage(queryKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}
