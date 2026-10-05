// Billing integration points. Everything here is optional; with no env vars
// BillMint runs in demo mode where "Activate Pro" just flips localStorage billmint_pro=true.
const env = import.meta.env;

export const billing = {
  paymentLink: env.VITE_STRIPE_PAYMENT_LINK || '',
  gumroadUrl: env.VITE_GUMROAD_URL || '',
  publishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  priceId: env.VITE_STRIPE_PRICE_ID || 'price_REPLACE_ME', // STRIPE_PRICE_ID placeholder
  checkoutEndpoint: env.VITE_CHECKOUT_ENDPOINT || '',
};

export const hasRealCheckout = () =>
  Boolean(billing.paymentLink || billing.gumroadUrl || (billing.checkoutEndpoint && billing.priceId !== 'price_REPLACE_ME'));

/**
 * Starts checkout. Priority: Stripe Payment Link → Stripe Checkout Session endpoint → Gumroad → demo.
 * Returns 'demo' when no provider is configured so the UI can offer the demo toggle.
 */
export async function startCheckout(): Promise<'redirected' | 'demo' | 'error'> {
  try {
    if (billing.paymentLink) {
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
        window.location.href = data.url;
        return 'redirected';
      }
      return 'error';
    }
    if (billing.gumroadUrl) {
      window.location.href = billing.gumroadUrl;
      return 'redirected';
    }
    return 'demo';
  } catch {
    return 'error';
  }
}
