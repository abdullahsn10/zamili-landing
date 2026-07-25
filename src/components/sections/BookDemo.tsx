"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { LEAD_TYPE_SLUGS, HONEYPOT_FIELD, type LeadTypeSlug } from "@/lib/leadTypes";

type Status = "idle" | "submitting" | "success" | "error" | "rate_limited";

export function BookDemo() {
  const { t, locale } = useLocale();
  const b = t.bookDemo;
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      organization: String(form.get("organization") || ""),
      type: String(form.get("type") || "other"),
      contact: String(form.get("contact") || ""),
      problem: String(form.get("problem") || ""),
      locale,
      [HONEYPOT_FIELD]: String(form.get(HONEYPOT_FIELD) || ""),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="book-demo" className="bg-brand-950 py-24">
        <div className="mx-auto max-w-lg px-5 text-center sm:px-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/15 text-2xl text-teal-500">
            ✓
          </div>
          <p className="balance text-xl font-semibold text-white">{b.success}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="book-demo" className="bg-brand-950 py-24">
      <div className="mx-auto max-w-lg px-5 sm:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-ember-400">
            {b.eyebrow}
          </p>
          <h2 className="balance text-3xl font-bold text-white sm:text-4xl">{b.heading}</h2>
          <p className="mt-4 text-base text-white/60">{b.sub}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-glow sm:p-8">
          {/* Honeypot — hidden from sighted & keyboard users, bots often fill every field. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={HONEYPOT_FIELD}>Company website</label>
            <input
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <Field label={b.nameLabel}>
            <input
              name="name"
              required
              minLength={2}
              maxLength={120}
              placeholder={b.namePlaceholder}
              className="input"
            />
          </Field>

          <Field label={b.orgLabel}>
            <input
              name="organization"
              required
              minLength={2}
              maxLength={160}
              placeholder={b.orgPlaceholder}
              className="input"
            />
          </Field>

          <Field label={b.typeLabel}>
            <select name="type" required defaultValue="" className="input">
              <option value="" disabled>
                {b.typeLabel}
              </option>
              {LEAD_TYPE_SLUGS.map((slug: LeadTypeSlug, i) => (
                <option key={slug} value={slug}>
                  {b.typeOptions[i]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={b.contactLabel}>
            <input
              name="contact"
              required
              minLength={5}
              maxLength={160}
              placeholder={b.contactPlaceholder}
              className="input"
            />
          </Field>

          <Field label={b.problemLabel}>
            <textarea
              name="problem"
              maxLength={2000}
              rows={3}
              placeholder={b.problemPlaceholder}
              className="input resize-none"
            />
          </Field>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="focus-ring w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {status === "submitting" ? b.submitting : b.submit}
          </button>

          {status === "error" && (
            <p role="alert" className="text-center text-sm text-red-600">
              {b.errorGeneric}
            </p>
          )}
          {status === "rate_limited" && (
            <p role="alert" className="text-center text-sm text-red-600">
              {b.errorRateLimit}
            </p>
          )}

          <p className="text-center text-xs text-ink-3">{b.privacyNote}</p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      {children}
    </label>
  );
}
