# BillMint launch checklist: real money

Status (6 Oct 2026): the app is live at https://nikfuz.github.io/billmint/, but **payments are NOT live.**
There's no Stripe account or Payment Link yet, so the Upgrade button says "Pro checkout opens soon".
Production has no free Pro unlock: the demo toggle exists only in dev builds, and `?checkout=success` does nothing unless checkout is configured and was started in that browser.
The free watermark and the 3-documents-per-month limit are enforced.

The only blocker left is the Stripe setup below, which needs Nicola's account.

## Nicola: one-time Stripe setup (~15 min)

- [ ] **Stripe account** activated at https://dashboard.stripe.com (business details, bank account for payouts, ID check).
- [ ] **Product:** `BillMint Pro`, **$12.00 USD / month**, recurring.
- [ ] **Payment Link** for that price:
  - After payment → *Redirect customers to your website* →
    `https://nikfuz.github.io/billmint/?checkout=success`
    (recommended variant: `https://nikfuz.github.io/billmint/?checkout=success&session_id={CHECKOUT_SESSION_ID}`)
  - Copy the `https://buy.stripe.com/...` URL.
- [ ] **Customer portal** (so people can cancel, which the pricing FAQ promises): Settings → Billing → Customer portal → enable. Make sure receipt emails include the portal / manage-subscription link.
- [ ] **Support / reply-to email** set in Stripe (Settings → Public details). The `#/upgrade/unverified` page tells customers to reply to their receipt.

## Rebuild with the Payment Link

```bash
cd billmint
# edit .env.production:
#   VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxxx   (public URL; OK to commit. Never put sk_ keys here)
npm install
npm run deploy                      # builds + pushes dist/ to gh-pages
git add .env.production && git commit -m "Enable Stripe Payment Link" && git push
```

One-off alternative without editing the file: `VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxxx npm run deploy`

## Smoke test (do it first with a TEST-mode Payment Link, then again with the live one)

- [ ] https://nikfuz.github.io/billmint/ returns 200 and loads.
- [ ] In a fresh/incognito window, open `https://nikfuz.github.io/billmint/?checkout=success` directly. You should land on "We couldn't confirm your upgrade here", with the Plan still **Free**.
- [ ] Pricing page shows "Cancel anytime · Secure checkout by Stripe" (proves the link is in the build).
- [ ] Click **Upgrade to Pro**. You should reach the Stripe page for BillMint Pro at $12/mo.
- [ ] Pay (test card `4242 4242 4242 4242`, any future date and CVC, in test mode). You should be redirected to `#/upgrade/success`, and Settings → Plan shows **Pro**.
- [ ] As Pro: the PDF has no watermark, logo/colours/templates are unlocked, and a 4th document can be created.
- [ ] The payment and subscription show up in the Stripe dashboard. The receipt email arrives with a manage/cancel link.
- [ ] Switch the link to **live mode**, run `npm run deploy` again, and repeat the Upgrade click (you can refund your own live payment).

## Known limits (honest)

- Pro is unlocked client-side, in localStorage, per browser. It isn't verified against Stripe, and cancellations don't remove Pro in the app. That's fine for a first sale. Add a Stripe webhook / session check or license keys before scaling (see README → Known gaps).
- No revenue has been made yet. Don't quote MRR until Stripe shows real charges.
