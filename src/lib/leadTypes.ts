/**
 * Stable, locale-independent slugs for the business-type select. The visible
 * label comes from the dictionary (t.bookDemo.typeOptions, same order) — the
 * slug is what's actually submitted/emailed so the lead record doesn't
 * depend on which UI language was active when the form was filled in.
 */
export const LEAD_TYPE_SLUGS = [
  "university",
  "restaurant",
  "supermarket",
  "shop",
  "gym",
  "clinic",
  "other",
] as const;

export type LeadTypeSlug = (typeof LEAD_TYPE_SLUGS)[number];

/**
 * Honeypot field name, shared by the client form and the server route. A
 * bot that fills it gets a normal-looking success response, not a
 * validation error that would tip it off. See src/app/api/lead/route.ts.
 */
export const HONEYPOT_FIELD = "company_site" as const;

export const LEAD_TYPE_LABELS_AR: Record<LeadTypeSlug, string> = {
  university: "جامعة/مؤسسة",
  restaurant: "مطعم",
  supermarket: "سوبرماركت",
  shop: "محل",
  gym: "جيم",
  clinic: "عيادة",
  other: "أخرى",
};
