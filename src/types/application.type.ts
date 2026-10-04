export type Division =
  | "DHAKA"
  | "CHATTOGRAM"
  | "RAJSHAHI"
  | "KHULNA"
  | "BARISAL"
  | "SYLHET"
  | "RANGPUR"
  | "MYMENSINGH";

// ── Customer ──────────────────────────────────────────────────────────────────

export interface CustomerRegistrationPayload {
  name: string;
  email: string;
  password: string;
  customer: {
    contactNumber?: string;
    thana?: string;
    district?: string;
    division: Division;
    address?: string;
  };
}

// ── Merchant ──────────────────────────────────────────────────────────────────

export interface MerchantApplicationData {
  user: {
    name: string;
    email: string;
    password: string;
    role: "MERCHANT";
  };
  merchant: {
    contactNumber: string;
    thana: string;
    district: string;
    division: Division;
    address: string;
    tradeLicenseNumber: string;
    businessLicenseNumber: string;
    businessType: string;
    businessDescription: string;
  };
}

export interface MerchantApplicationPayload {
  data: MerchantApplicationData;
  businessLicenseDocument: File;
  additionalDocuments: File[];
}

// ── Rider ─────────────────────────────────────────────────────────────────────

export interface RiderApplicationData {
  user: {
    name: string;
    email: string;
    password: string;
    role: "RIDER";
  };
  rider: {
    contactNumber: string;
    nidNumber: string;
    thana: string;
    district: string;
    division: Division;
    address: string;
    licenseNumber?: string;
    vehicleType: string;
    vehicleRegistrationNumber?: string;
  };
}

export interface RiderApplicationPayload {
  data: RiderApplicationData;
  nidDocument: File;
  additionalDocuments: File[];
}
