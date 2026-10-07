import apiClient from "@/lib/apiClient";
import type {
  AdminAnalytics,
  ApiResponse,
  CustomerAnalytics,
  MerchantAnalytics,
  RiderAnalytics,
} from "@/types";

export function getAdminAnalytics() {
  return apiClient<ApiResponse<AdminAnalytics>>("/analytics/admin");
}

export function getMerchantAnalytics() {
  return apiClient<ApiResponse<MerchantAnalytics>>("/analytics/merchant");
}

export function getRiderAnalytics() {
  return apiClient<ApiResponse<RiderAnalytics>>("/analytics/rider");
}

export function getCustomerAnalytics() {
  return apiClient<ApiResponse<CustomerAnalytics>>("/analytics/customer");
}
