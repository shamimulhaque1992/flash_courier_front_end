import apiClient from "@/lib/apiClient";
import type { MerchantApplicationPayload, RiderApplicationPayload } from "@/types";

export function applyAsMerchant(payload: MerchantApplicationPayload) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload.data));
  formData.append("businessLicenseDocument", payload.businessLicenseDocument);
  for (const file of payload.additionalDocuments) {
    formData.append("additionalDocuments", file);
  }
  return apiClient("/merchants/apply-as-merchant", {
    method: "POST",
    body: formData,
  });
}

export function verifyMerchantEmail(payload: { email: string; otp: string }) {
  return apiClient("/merchants/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function applyAsRider(payload: RiderApplicationPayload) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload.data));
  formData.append("nidDocument", payload.nidDocument);
  for (const file of payload.additionalDocuments) {
    formData.append("additionalDocuments", file);
  }
  return apiClient("/riders/apply-as-rider", {
    method: "POST",
    body: formData,
  });
}

export function verifyRiderEmail(payload: { email: string; otp: string }) {
  return apiClient("/riders/verify-email", {
    method: "POST",
    body: payload,
  });
}
