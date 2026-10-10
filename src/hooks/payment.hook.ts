import { useSuspenseQuery } from "@tanstack/react-query";
import { getAllPayments, getMyPayments } from "@/api";
import type { PaymentParams } from "@/api/payment.api";

export function useSuspenseGetMyPayments(params: PaymentParams) {
  return useSuspenseQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
  });
}

export function useSuspenseGetAllPayments(params: PaymentParams) {
  return useSuspenseQuery({
    queryKey: ["all-payments", params],
    queryFn: () => getAllPayments(params),
  });
}
