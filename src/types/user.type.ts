export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MERCHANT" | "RIDER" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  needPasswordChange: boolean;
  imageUrl: null | string;
  createdAt: string;
  updatedAt: string;
}
