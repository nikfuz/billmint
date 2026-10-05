// Optional Vercel serverless function: creates a Stripe Checkout Session for the Pro plan.
// Not used unless VITE_CHECKOUT_ENDPOINT + VITE_STRIPE_PRICE_ID are set in the frontend env
// and STRIPE_SECRET_KEY is set in the Vercel project env. No npm dependency needed.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const priceId = process.env.STRIPE_PRICE_ID || body.priceId;
  const appUrl = process.env.APP_URL || `https://${req.headers.host}`;
  const params = new URLSearchParams({
    mode: 'subscription',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: `${appUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/#/pricing`,
    allow_promotion_codes: 'true',
  });
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const data = await r.json();
  if (!r.ok) return res.status(400).json({ error: data.error?.message || 'Stripe error' });
  return res.status(200).json({ url: data.url });
}
