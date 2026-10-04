import z from "zod";

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

export const createShipmentSchema = z.object({
  receiverName: z.string().trim().min(2, "Receiver name is required"),
  receiverEmail: z.email("Invalid receiver email"),
  receiverContactNumber: z
    .string()
    .trim()
    .min(7, "Contact number must be at least 7 digits"),
  receiverThana: z.string().trim().min(2, "Thana is required"),
  receiverDistrict: z.string().trim().min(2, "District is required"),
  receiverDivision: z.enum(DIVISIONS, { error: "Please select a division" }),
  receiverAddress: z.string().trim().optional(),
  packageDescription: z.string().trim().optional(),
  packageWeight: z
    .number({ error: "Package weight is required" })
    .positive("Weight must be greater than 0"),
  packageDimensions: z.string().trim().optional(),
  isFragile: z.boolean().optional().default(false),
  note: z.string().trim().optional(),
});
