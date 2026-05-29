"use client";

import { useState } from "react";
import { Check, Mail, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  intent: "newsletter" | "premium-waitlist";
  title: string;
  description: string;
  ctaLabel?: string;
  className?: string;
}

/**
 * Reusable email capture for newsletter & Yosurf+ waitlist.
 *
 * Persists captured emails to localStorage as a fallback (works without backend).
 * When NEXT_PUBLIC_NEWSLETTER_ENDPOINT is set, POSTs to that URL (Buttondown, Brevo,
 * Resend, custom API…). Otherwise it just confirms locally and persists.
 *
 * The captured list is exfiltrated to the operator via a /api/leads route
 * (to be wired in production).
 */
export function EmailCapture({ intent, title, description, ctaLabel, className }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");

    const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
    try {
      if (endpoint) {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, intent, source: "yosurf-web" }),
        });
      }
      // local fallback log
      try {
        const k = `yosurf-leads-${intent}`;
        const prev = JSON.parse(localStorage.getItem(k) || "[]");
        localStorage.setItem(k, JSON.stringify([...prev, { email, at: new Date().toISOString() }]));
      } catch {}
    } catch { /* never block UX on network error */ }
    trackEvent(intent === "premium-waitlist" ? "premium_waitlist_signup" : "newsletter_signup");
    setStatus("done");
  }

  return (
    <div className={`rounded-2xl border border-white/[0.07] bg-gradient-to-br from-ocean-950/40 via-depth-950 to-depth-950 p-5 ${className ?? ""}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-coral-500 to-sunset-500">
          <Mail className="h-3.5 w-3.5 text-white" />
        </span>
        <h3 className="font-display text-base font-bold">{title}</h3>
      </div>
      <p className="mb-4 text-sm text-white/65">{description}</p>

      {status === "done" ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-200">
          <Check className="h-4 w-4" />
          Merci, on te tient au courant — check ta boîte 🌊
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton.email@exemple.fr"
            className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm placeholder-white/35 outline-none focus:border-ocean-400"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="tap-target inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-coral-500 via-sunset-500 to-sand-400 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {status === "submitting" ? "…" : ctaLabel ?? "Je m'inscris"}
          </button>
        </form>
      )}
    </div>
  );
}
