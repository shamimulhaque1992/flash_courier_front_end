import apiClient from "@/lib/apiClient";
import type { ApiResponse, Customer, Merchant, Rider } from "@/types";

export function updateCustomerProfile(payload: {
  name?: string;
  contactNumber?: string;
  thana?: string;
  district?: string;
  address?: string;
}) {
  return apiClient<ApiResponse<Customer>>("/customers/my-profile", {
    method: "PATCH",
    body: payload,
  });
}

export function updateMerchantProfile(payload: {
  name?: string;
  contactNumber?: string;
  thana?: string;
  district?: string;
  address?: string;
  businessDescription?: string;
}) {
  return apiClient<ApiResponse<Merchant>>("/merchants/my-profile", {
    method: "PATCH",
    body: payload,
  });
}

export function updateRiderProfile(payload: {
  name?: string;
  contactNumber?: string;
  thana?: string;
  district?: string;
  address?: string;
  vehicleType?: string;
  vehicleRegistrationNumber?: string;
  licenseNumber?: string;
}) {
  return apiClient<ApiResponse<Rider>>("/riders/my-profile", {
    method: "PATCH",
    body: payload,
  });
}

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("profileImage", file);
  return apiClient("/users/profile-image", {
    method: "PATCH",
    body: formData,
  });
}
