import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export interface Payment {
  id: string;
  shipmentId: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  bkashTrxId?: string | null;
  bkashPaymentId?: string | null;
  payerReference?: string | null;
  paidAt?: string | null;
  refundTrxId?: string | null;
  refundAmount?: number | null;
  createdAt: string;
  updatedAt: string;
  shipment: {
    trackingNumber: string;
    receiverName: string;
    receiverDistrict: string;
    receiverDivision: string;
    shipmentStatus: string;
    merchant?: { name: string; email: string } | null;
  };
}

export interface PaymentParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
  merchantEmail?: string;
}

export function getMyPayments(params: PaymentParams) {
  return apiClient<ApiResponse<Payment[]>>("/payments/my-payments", { params });
}

export function getAllPayments(params: PaymentParams) {
  return apiClient<ApiResponse<Payment[]>>("/payments/all", { params });
}

export function getSinglePayment(paymentId: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${paymentId}`);
}
