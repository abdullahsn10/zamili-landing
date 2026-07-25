import { z } from "zod";
import { LEAD_TYPE_SLUGS } from "./leadTypes";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  type: z.enum(LEAD_TYPE_SLUGS),
  contact: z.string().trim().min(5).max(160),
  problem: z.string().trim().max(2000).optional().default(""),
  locale: z.enum(["ar", "en"]).optional().default("ar"),
});

export type LeadPayload = z.infer<typeof leadSchema>;
