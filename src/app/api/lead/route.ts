import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/leadSchema";
import { LEAD_TYPE_LABELS_AR, HONEYPOT_FIELD } from "@/lib/leadTypes";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

function isEmailish(value: string): boolean {
  return /.+@.+\..+/.test(value);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: a bot that fills this hidden field gets a normal-looking
  // success response, so it never learns the field is a trap.
  const honeypotValue = raw[HONEYPOT_FIELD];
  if (typeof honeypotValue === "string" && honeypotValue.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const lead = parsed.data;
  const leadEmail = process.env.LEAD_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!leadEmail || !apiKey) {
    console.error("zamili-landing: LEAD_EMAIL or RESEND_API_KEY is not configured");
    return NextResponse.json({ ok: false, error: "server_misconfigured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const typeLabel = LEAD_TYPE_LABELS_AR[lead.type];

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Zamili Leads <onboarding@resend.dev>",
      to: leadEmail,
      replyTo: isEmailish(lead.contact) ? lead.contact : undefined,
      subject: `عرض Zamili تجريبي جديد — ${lead.organization}`,
      text: [
        `الاسم: ${lead.name}`,
        `المؤسسة: ${lead.organization}`,
        `النوع: ${typeLabel}`,
        `للتواصل: ${lead.contact}`,
        lead.problem ? `المشكلة: ${lead.problem}` : null,
        "",
        `لغة النموذج: ${lead.locale}`,
        `IP: ${ip}`,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });
  } catch (err) {
    console.error("zamili-landing: Resend send failed", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
