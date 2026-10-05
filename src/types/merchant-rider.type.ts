import type { User } from "./user.type";
import type { Division } from "./application.type";

export type MerchantVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type RiderVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface Merchant {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  thana: string;
  district: string;
  division: Division;
  address: string;
  tradeLicenseNumber: string;
  businessLicenseNumber: string;
  businessType: string;
  businessDescription: string;
  businessLicenseDocument: string;
  businessLicenseDocumentPublicId: string;
  additionalDocuments: { url: string; publicId: string }[];
  verificationStatus: MerchantVerificationStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
}

export interface MerchantParams {
  verificationStatus?: MerchantVerificationStatus;
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortOrder?: "desc" | "asc";
}

export interface ApproveMerchantPayload {
  merchantId: string;
  verificationStatus: "VERIFIED" | "REJECTED";
  rejectionReason?: string;
}

export interface Rider {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  nidNumber: string;
  thana: string;
  district: string;
  division: Division;
  address: string;
  licenseNumber?: string | null;
  vehicleType: string;
  vehicleRegistrationNumber?: string | null;
  nidDocument: string;
  nidDocumentPublicId: string;
  additionalDocuments: { url: string; publicId: string }[];
  verificationStatus: RiderVerificationStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
}

export interface RiderParams {
  verificationStatus?: RiderVerificationStatus;
  division?: Division;
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortOrder?: "desc" | "asc";
}

export interface ApproveRiderPayload {
  riderId: string;
  verificationStatus: "VERIFIED" | "REJECTED";
  rejectionReason?: string;
}
