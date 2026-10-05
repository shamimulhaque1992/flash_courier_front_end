import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CalculatePricePayload,
  CreateShipmentPayload,
  Merchant,
  PricingResult,
  Shipment,
  ShipmentParams,
} from "@/types";

export function calculateShipmentPrice(payload: CalculatePricePayload) {
  return apiClient<ApiResponse<PricingResult>>("/shipments/calculate-price", {
    method: "POST",
    body: payload,
  });
}

export function createShipment(payload: CreateShipmentPayload) {
  return apiClient<ApiResponse<{ shipment: Shipment; bkashURL: string }>>(
    "/shipments/create-shipment",
    { method: "POST", body: payload },
  );
}

export function getMyShipments(params: ShipmentParams) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments/my-shipments", { params });
}

export function getAllShipments(params: ShipmentParams) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments/all", { params });
}

export function updateShipmentStatus(payload: {
  shipmentId: string;
  status: string;
  remarks?: string;
}) {
  const { shipmentId, ...body } = payload;
  return apiClient<ApiResponse<Shipment>>(`/shipments/status/${shipmentId}`, {
    method: "PATCH",
    body,
  });
}

export function assignShipment(payload: {
  shipmentId: string;
  scheduleId: string;
}) {
  return apiClient<ApiResponse<Shipment>>("/shipments/assign", {
    method: "POST",
    body: payload,
  });
}

export function repayShipment(shipmentId: string) {
  return apiClient<ApiResponse<{ bkashURL: string }>>("/shipments/re-pay", {
    method: "POST",
    body: { shipmentId },
  });
}

export function cancelShipment(shipmentId: string) {
  return apiClient("/shipments/cancel", {
    method: "PATCH",
    body: { shipmentId },
  });
}

export function getMyMerchantProfile() {
  return apiClient<ApiResponse<Merchant>>("/merchants/my-profile");
}
