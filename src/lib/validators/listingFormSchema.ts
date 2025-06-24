import { z } from "zod"

export const listingFormSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  category: z.string(),
  subcategory: z.string(),
  roomType: z.string().optional(),
  genderAllowed: z.enum(["Male", "Female", "All"]),
  price: z.union([z.number().min(0), z.literal(null)]),
  isFree: z.boolean(),
  amenities: z.array(z.string()),
  locality: z.string().min(2),
  area: z.string().optional(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  availableFrom: z.date().optional(),
  images: z.array(z.string()).optional(), // 👈 Add this line
})