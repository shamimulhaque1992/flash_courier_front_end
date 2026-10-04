import {
  applyAsMerchant,
  applyAsRider,
  verifyMerchantEmail,
  verifyRiderEmail,
} from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useApplyAsMerchant() {
  return useMutation({ mutationFn: applyAsMerchant });
}

export function useVerifyMerchantEmail() {
  return useMutation({ mutationFn: verifyMerchantEmail });
}

export function useApplyAsRider() {
  return useMutation({ mutationFn: applyAsRider });
}

export function useVerifyRiderEmail() {
  return useMutation({ mutationFn: verifyRiderEmail });
}
