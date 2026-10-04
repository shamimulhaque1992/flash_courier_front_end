import type { Division } from "./application.type";

export type ShipmentStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "READY_FOR_ASSIGNMENT"
  | "ASSIGNED"
  | "ACCEPTED_BY_RIDER"
  | "REJECTED_BY_RIDER"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED_BY_MERCHANT";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Shipment {
  id: string;
  trackingNumber: string;
  receiverName: string;
  receiverEmail: string;
  receiverContactNumber: string;
  receiverThana: string;
  receiverDistrict: string;
  receiverDivision: Division;
  receiverAddress?: string | null;
  packageDescription?: string | null;
  packageWeight: number;
  packageDimensions?: string | null;
  isFragile: boolean;
  deliveryFee: number;
  note?: string | null;
  shipmentStatus: ShipmentStatus;
  paymentStatus: PaymentStatus;
  probableDeliveryTime?: string | null;
  actualDeliveryTime?: string | null;
  pickedUpAt?: string | null;
  merchantId: string;
  riderId?: string | null;
  scheduleId?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  payment?: {
    id: string;
    amount: number;
    status: PaymentStatus;
    bkashTrxId?: string | null;
    paidAt?: string | null;
    refundTrxId?: string | null;
    refundAmount?: number | null;
  } | null;
  rider?: {
    name: string;
    email: string;
    contactNumber: string;
  } | null;
  schedule?: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  } | null;
}

export interface ShipmentParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  shipmentStatus?: ShipmentStatus;
  paymentStatus?: PaymentStatus;
  sortOrder?: "asc" | "desc";
}

export interface CreateShipmentPayload {
  receiverName: string;
  receiverEmail: string;
  receiverContactNumber: string;
  receiverThana: string;
  receiverDistrict: string;
  receiverDivision: Division;
  receiverAddress?: string;
  packageDescription?: string;
  packageWeight: number;
  packageDimensions?: string;
  isFragile?: boolean;
  note?: string;
}

export interface CalculatePricePayload {
  senderDivision: Division;
  receiverDivision: Division;
  packageWeight: number;
  isFragile?: boolean;
}

export interface PricingResult {
  baseRate: number;
  weightSurcharge: number;
  fragileSurcharge: number;
  totalFee: number;
  breakdown: {
    isIntraDivision: boolean;
    weightBracket: string;
  };
}
