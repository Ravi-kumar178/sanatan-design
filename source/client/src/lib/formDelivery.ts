/**
 * Form delivery without a backend.
 *
 * Every form on this site previously resolved locally and discarded its data
 * while telling the visitor it had been sent. This module makes submissions
 * actually go somewhere, using only what a static frontend can do:
 *
 *   1. If VITE_FORM_ENDPOINT is set, the submission is POSTed there. Any
 *      form-to-email service works — Formspree, Web3Forms, Getform, Basin, or a
 *      Netlify/Cloudflare function. This is the path you want in production.
 *
 *   2. Otherwise it falls back to opening the visitor's mail client with the
 *      message prefilled and addressed to the right inbox. Less slick, but it
 *      genuinely reaches a human on day one with zero configuration.
 *
 * The one thing it will never do is claim success when nothing was sent.
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

/** Where each kind of enquiry should land. */
export const INBOXES = {
  general: 'info@sanataninternational.org',
  donate: 'donate@sanataninternational.org',
  gurukul: 'gurukul@sanataninternational.org',
  press: 'press@sanataninternational.org',
  volunteer: 'info@sanataninternational.org',
  books: 'info@sanataninternational.org',
} as const;

export type Inbox = keyof typeof INBOXES;

export type DeliveryResult =
  | { ok: true; via: 'endpoint' }
  | { ok: true; via: 'mailto' }
  | { ok: false; error: string };

export interface SubmitOptions {
  /** Identifies the form in whatever inbox or dashboard receives it. */
  formName: string;
  inbox?: Inbox;
  /** Flat field map. Values are stringified; empty ones are dropped. */
  data: Record<string, unknown>;
}

function toPlainText(formName: string, data: Record<string, unknown>): string {
  const lines = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
      return `${label}: ${String(v)}`;
    });
  return `${formName}\n${'-'.repeat(formName.length)}\n\n${lines.join('\n')}\n`;
}

function openMailto(formName: string, inbox: Inbox, data: Record<string, unknown>) {
  const subject = `${formName} — Sanatan International`;
  const body = toPlainText(formName, data);
  const href = `mailto:${INBOXES[inbox]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // A user-gesture-initiated navigation; assignment keeps the SPA intact.
  window.location.href = href;
}

export async function submitForm({
  formName,
  inbox = 'general',
  data,
}: SubmitOptions): Promise<DeliveryResult> {
  const payload = {
    ...data,
    _form: formName,
    _inbox: INBOXES[inbox],
    _page: typeof window !== 'undefined' ? window.location.pathname : '',
    _submittedAt: new Date().toISOString(),
  };

  if (ENDPOINT) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return { ok: false, error: `The form service returned ${res.status}. Please email ${INBOXES[inbox]} directly.` };
      }
      return { ok: true, via: 'endpoint' };
    } catch {
      return { ok: false, error: `Could not reach the form service. Please email ${INBOXES[inbox]} directly.` };
    }
  }

  try {
    openMailto(formName, inbox, data);
    return { ok: true, via: 'mailto' };
  } catch {
    return { ok: false, error: `Please email ${INBOXES[inbox]} directly.` };
  }
}

/** True when submissions POST to a service rather than opening a mail client. */
export const hasFormEndpoint = Boolean(ENDPOINT);
