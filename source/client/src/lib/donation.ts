/**
 * Donation handoff.
 *
 * A static frontend cannot take card details — but it does not need to. Almost
 * every nonprofit routes giving through a hosted page (Donorbox, Every.org,
 * Givebutter, PayPal, Zeffy), which handles PCI compliance, receipts and
 * recurring billing. This module hands off to that page with the visitor's
 * choices already filled in.
 *
 * Set VITE_DONATE_URL to your hosted donation page. Until it is set, the form
 * records the pledge through the normal delivery path and tells the donor that
 * payment instructions will follow — which is honest, rather than showing a
 * success screen for money that was never collected.
 */

const DONATE_URL = import.meta.env.VITE_DONATE_URL as string | undefined;

export const hasDonationPlatform = Boolean(DONATE_URL);

export interface DonationIntent {
  amount: number;
  frequency: 'one-time' | 'monthly';
  fund?: string;
  name?: string;
  email?: string;
}

/**
 * Builds the hosted-page URL. The parameter names below are the ones Donorbox,
 * Every.org and Givebutter all read; unknown params are ignored by every
 * platform, so passing them is safe.
 */
export function donationUrl(intent: DonationIntent): string | null {
  if (!DONATE_URL) return null;
  const url = new URL(DONATE_URL);
  url.searchParams.set('amount', String(intent.amount));
  if (intent.frequency === 'monthly') {
    url.searchParams.set('recurring', 'true');
    url.searchParams.set('frequency', 'monthly');
  }
  if (intent.fund) url.searchParams.set('designation', intent.fund);
  if (intent.name) url.searchParams.set('name', intent.name);
  if (intent.email) url.searchParams.set('email', intent.email);
  return url.toString();
}

/** Sends the donor to the hosted page. Returns false when none is configured. */
export function goToDonationPlatform(intent: DonationIntent): boolean {
  const url = donationUrl(intent);
  if (!url) return false;
  window.location.href = url;
  return true;
}
