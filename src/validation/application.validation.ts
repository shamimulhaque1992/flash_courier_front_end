import z from "zod";

export const MAX_FILE_SIZE = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;
export const MAX_ADDITIONAL_FILES = 5;

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

export function isAcceptedFileSize(fileSize: number) {
  return fileSize <= MAX_FILE_SIZE_BYTES;
}

export function isAcceptedFileType(fileType: string) {
  return ACCEPTED_FILE_TYPES.includes(fileType);
}

export const getCustomFileSchema = <T>(message: string) =>
  z.custom<T>(
    (value) =>
      value === null ||
      (value instanceof File &&
        isAcceptedFileSize(value.size) &&
        isAcceptedFileType(value.type)),
    { message },
  );

const DIVISIONS = [
  "DHAKA",
  "CHATTOGRAM",
  "RAJSHAHI",
  "KHULNA",
  "BARISAL",
  "SYLHET",
  "RANGPUR",
  "MYMENSINGH",
] as const;

// ── Customer Registration ─────────────────────────────────────────────────────

export const customerRegistrationSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100)
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    division: z.enum(DIVISIONS, { error: "Please select a division" }),
    contactNumber: z.string(),
    thana: z.string(),
    district: z.string(),
    address: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Merchant Application ──────────────────────────────────────────────────────

export const merchantApplicationSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100)
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z
      .string()
      .trim()
      .min(10, "Contact number must be at least 10 digits"),
    thana: z.string().trim().min(2, "Thana is required"),
    district: z.string().trim().min(2, "District is required"),
    division: z.enum(DIVISIONS, { error: "Please select a division" }),
    address: z.string().trim().min(2, "Address is required"),
    tradeLicenseNumber: z
      .string()
      .trim()
      .min(2, "Trade license number is required"),
    businessLicenseNumber: z
      .string()
      .trim()
      .min(2, "Business license number is required"),
    businessType: z.string().trim().min(2, "Business type is required"),
    businessDescription: z
      .string()
      .trim()
      .min(2, "Business description is required"),
    businessLicenseDocument: getCustomFileSchema<File | null>(
      `Business license document must be a PDF or image under ${MAX_FILE_SIZE}MB`,
    ).refine((value) => value instanceof File, {
      message: "Business license document is required",
    }),
    additionalDocuments: z
      .array(z.custom<File>((value) => value instanceof File))
      .max(
        MAX_ADDITIONAL_FILES,
        `You can attach at most ${MAX_ADDITIONAL_FILES} documents`,
      )
      .refine(
        (files) =>
          files.every(
            (file) =>
              isAcceptedFileSize(file.size) && isAcceptedFileType(file.type),
          ),
        {
          message: `Each file must be a PDF or image under ${MAX_FILE_SIZE}MB`,
        },
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Rider Application ─────────────────────────────────────────────────────────

export const riderApplicationSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100)
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z
      .string()
      .trim()
      .min(10, "Contact number must be at least 10 digits"),
    nidNumber: z
      .string()
      .trim()
      .min(10, "NID number must be at least 10 digits"),
    thana: z.string().trim().min(2, "Thana is required"),
    district: z.string().trim().min(2, "District is required"),
    division: z.enum(DIVISIONS, { error: "Please select a division" }),
    address: z.string().trim().min(2, "Address is required"),
    vehicleType: z.string().trim().min(2, "Vehicle type is required"),
    licenseNumber: z.string().trim(),
    vehicleRegistrationNumber: z.string().trim(),
    nidDocument: getCustomFileSchema<File | null>(
      `NID document must be a PDF or image under ${MAX_FILE_SIZE}MB`,
    ).refine((value) => value instanceof File, {
      message: "NID document is required",
    }),
    additionalDocuments: z
      .array(z.custom<File>((value) => value instanceof File))
      .max(
        MAX_ADDITIONAL_FILES,
        `You can attach at most ${MAX_ADDITIONAL_FILES} documents`,
      )
      .refine(
        (files) =>
          files.every(
            (file) =>
              isAcceptedFileSize(file.size) && isAcceptedFileType(file.type),
          ),
        {
          message: `Each file must be a PDF or image under ${MAX_FILE_SIZE}MB`,
        },
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
