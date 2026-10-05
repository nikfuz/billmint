// Billing integration points.
//
// Production: the Upgrade button goes to VITE_STRIPE_PAYMENT_LINK (baked in at build time,
// see .env.production). With no checkout configured, Upgrade just says "checkout opens soon";
// there is NO free unlock in production builds.
// Dev (`npm run dev`): a demo toggle can flip Pro on/off for testing (see DEMO_BILLING).
import { store, DEMO_BILLING } from './storage';

const env = import.meta.env;

export const billing = {
  paymentLink: (env.VITE_STRIPE_PAYMENT_LINK || '').trim(),
  gumroadUrl: (env.VITE_GUMROAD_URL || '').trim(),
  publishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  priceId: env.VITE_STRIPE_PRICE_ID || 'price_REPLACE_ME', // STRIPE_PRICE_ID placeholder
  checkoutEndpoint: env.VITE_CHECKOUT_ENDPOINT || '',
};

export const hasRealCheckout = () =>
  Boolean(billing.paymentLink || billing.gumroadUrl || (billing.checkoutEndpoint && billing.priceId !== 'price_REPLACE_ME'));

/** Set right before we send the user to the payment provider. */
const PENDING_KEY = 'billmint_checkout_started';
const SESSION_KEY = 'billmint_checkout_session';
const PENDING_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function markCheckoutStarted() {
  try {
    localStorage.setItem(PENDING_KEY, String(Date.now()));
  } catch {
    /* storage unavailable: unlock on return simply won't happen */
  }
}

/**
 * Handles the return from checkout (`?checkout=success`).
 *
 * This is still a CLIENT-SIDE honour system, not payment verification. It only stops the
 * trivial "paste ?checkout=success into the URL bar" free unlock:
 *   - it does nothing unless a real checkout (e.g. VITE_STRIPE_PAYMENT_LINK) is configured, and
 *   - it requires that THIS browser clicked Upgrade (and was sent to checkout) in the last 24h.
 * Real verification needs a server: Stripe webhook / Checkout Session lookup by session_id,
 * or license keys. See README "Known gaps".
 */
export function claimCheckoutSuccess(sessionId: string | null): boolean {
  if (DEMO_BILLING) {
    store.setPro(true, 'paid');
    return true;
  }
  if (!hasRealCheckout()) return false;
  const started = Number(localStorage.getItem(PENDING_KEY) || 0);
  if (!started || Date.now() - started > PENDING_MAX_AGE_MS) return false;
  localStorage.removeItem(PENDING_KEY);
  if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) localStorage.setItem(SESSION_KEY, sessionId);
  store.setPro(true, 'paid');
  return true;
}

/**
 * Starts checkout. Priority: Stripe Payment Link → Stripe Checkout Session endpoint → Gumroad.
 * Returns 'unavailable' when no provider is configured (the UI then says checkout opens soon,
 * and in dev builds only, offers the demo toggle).
 */
export async function startCheckout(): Promise<'redirected' | 'unavailable' | 'error'> {
  try {
    if (billing.paymentLink) {
      markCheckoutStarted();
      window.location.href = billing.paymentLink;
      return 'redirected';
    }
    if (billing.checkoutEndpoint && billing.priceId !== 'price_REPLACE_ME') {
      const r = await fetch(billing.checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: billing.priceId }),
      });
      const data = await r.json();
      if (data.url) {
        markCheckoutStarted();
        window.location.href = data.url;
        return 'redirected';
      }
      return 'error';
    }
    if (billing.gumroadUrl) {
      markCheckoutStarted();
      window.location.href = billing.gumroadUrl;
      return 'redirected';
    }
    return 'unavailable';
  } catch {
    return 'error';
  }
}
