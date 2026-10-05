# BillMint 🌿

**Beautiful invoices & quotes in 60 seconds.**
For freelancers and small agencies who hate ugly invoices.

BillMint is a ready-to-sell micro-SaaS: a polished web app where someone fills in their details, sees a live preview, and downloads a professional PDF invoice or quote. It's free to start (3 documents/month, watermarked), and **Pro costs $12/month**.

No server, no database, no login. Everything is saved in the user's browser, so it's cheap to host (free on Vercel) and private for your customers.

---

## What's inside

| Area | What it does |
| --- | --- |
| **Landing page** (`#/`) | Hero, live sample invoice, features, template showcase, how-it-works, pricing, call to action |
| **Pricing page** (`#/pricing`) | Free $0 vs Pro $12/mo, FAQ, demo Pro switch |
| **Editor** (`#/app/new`) | Invoice **or** quote · business details + logo · client details · line items (description, qty, rate) with live totals · tax % · currency (EUR/USD/GBP) · issue & due dates · notes · template & brand colour |
| **Live preview** | Pixel-matched to the PDF (both use the same layout engine) |
| **PDF download** | Professional A4 layout, multi-page for long invoices, 3 templates (Mint, Classic, Bold) |
| **Documents** (`#/app`) | Lists saved invoices and quotes · search & filter · status (draft/sent/paid) · edit · duplicate · convert quote → invoice · delete · download PDF · outstanding/paid totals |
| **Clients** (`#/app/clients`, Pro) | Saved client list, one-click fill in the editor |
| **Settings** (`#/app/settings`) | Business profile, logo, brand colour, default tax/currency/template/notes, payment terms, numbering, JSON backup, reset |
| **Upgrade modal** | Opens whenever a free user touches a Pro feature, with text written for that feature |

### Free vs Pro (enforced in the app)

| | Free | Pro ($12/mo) |
| --- | --- | --- |
| Documents per month | **3** (duplicates count, and deleting one doesn't give it back) | Unlimited |
| PDF watermark | "BillMint · FREE" + footer badge | None |
| Logo & brand colour | Locked | ✓ |
| Templates | Mint | Mint, Classic, Bold |
| Client list | Locked | ✓ |
| CSV export | Locked | ✓ |

**Demo mode:** flip the **Demo Pro** switch in the app header (or click "Activate Pro (demo)" in the upgrade modal). It sets `localStorage.billmint_pro = "true"`. Flip it off to see the free tier again.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
cd billmint
npm install && npm run dev
```

Open the URL it prints (usually http://localhost:5173).

Other scripts:

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
```

---

## Deploy (free, about 5 minutes) on Vercel

**Option 1: no terminal**
1. Put this folder in a GitHub repo (GitHub Desktop works: "Add local repository" → Publish).
2. Go to https://vercel.com → **Add New… → Project** → import the repo.
3. Vercel detects Vite automatically (`vercel.json` is already included). Click **Deploy**.
4. Optional: **Settings → Domains** to add `billmint.yourdomain.com`.

**Option 2: CLI**
```bash
npm i -g vercel
vercel        # first time: answer the prompts
vercel --prod
```

Netlify or Cloudflare Pages also work. Use build command `npm run build` and output folder `dist`.

---

## 💸 How to make money with it

The app already has the upgrade flow. You only need a way for people to pay. There are three ways to do that, from simplest to most robust:

### Path A: Stripe Payment Link (recommended, no code)
1. Create a Stripe account at https://dashboard.stripe.com and finish activation (bank account + ID).
2. **Product catalogue → Add product**: "BillMint Pro", **$12.00 USD, Recurring, Monthly**.
3. **Payment Links → New** → pick BillMint Pro.
   - In **After payment**, choose "Don't show confirmation page → Redirect to your website" and enter
     `https://YOUR-DOMAIN/?checkout=success`
   - Turn on "Allow promotion codes" (useful for launch discounts).
4. Copy the link (`https://buy.stripe.com/...`).
5. In Vercel → Project → **Settings → Environment Variables**, add
   `VITE_STRIPE_PAYMENT_LINK = https://buy.stripe.com/...` and **redeploy**.
6. Every "Upgrade to Pro" button now goes to Stripe. When payment succeeds, Stripe sends the user back and Pro switches on automatically.
7. Let customers cancel on their own: Stripe → **Settings → Billing → Customer portal** → enable, then paste the portal link into your receipt emails.

### Path B: Gumroad (easiest if you don't want Stripe)
1. At https://gumroad.com create a **Membership** product: "BillMint Pro", $12/month.
2. In the product's content / receipt, add a button: **"Activate Pro" → `https://YOUR-DOMAIN/?checkout=success`**.
3. Set `VITE_GUMROAD_URL = https://yourname.gumroad.com/l/billmint` in Vercel and redeploy.

### Path C: Stripe Checkout Sessions (for when you outgrow A)
A ready-made serverless function lives at `api/create-checkout-session.js`. Vercel deploys it automatically.
Set these in Vercel:
- `STRIPE_SECRET_KEY` = `sk_live_...` (server only, never prefix with `VITE_`)
- `STRIPE_PRICE_ID` = `price_...` (from the product page in Stripe)
- `APP_URL` = `https://YOUR-DOMAIN`
- `VITE_STRIPE_PRICE_ID` = same `price_...`
- `VITE_CHECKOUT_ENDPOINT` = `/api/create-checkout-session`

The code that decides which path to use is `src/lib/billing.ts`. It tries Payment Link first, then the Checkout endpoint, then Gumroad. If none is set, it falls back to demo mode.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_STRIPE_PAYMENT_LINK` | Frontend | Stripe Payment Link URL (Path A) |
| `VITE_GUMROAD_URL` | Frontend | Gumroad product URL (Path B) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Frontend | Reserved for future Stripe.js use |
| `VITE_STRIPE_PRICE_ID` | Frontend | Price ID sent to the checkout endpoint (`STRIPE_PRICE_ID` placeholder) |
| `VITE_CHECKOUT_ENDPOINT` | Frontend | e.g. `/api/create-checkout-session` (Path C) |
| `STRIPE_SECRET_KEY` | Server (Vercel) | Secret key for Path C |
| `STRIPE_PRICE_ID` | Server (Vercel) | Price for Path C |
| `APP_URL` | Server (Vercel) | Your public URL, used for redirect URLs |

Copy `.env.example` to `.env.local` for local testing. Changes to `VITE_*` variables only take effect after a rebuild/redeploy.

### Suggested launch post

> **I got tired of ugly invoices, so I built BillMint 🌿**
>
> Beautiful invoices & quotes in 60 seconds, made for freelancers and small studios.
>
> • Live preview that matches the PDF exactly
> • Quotes → invoices in one click
> • EUR / USD / GBP, tax, notes, 3 designer templates
> • No signup. Your data never leaves your browser.
>
> Free for 3 invoices a month. Pro is $12/mo for unlimited invoices, your logo & colours, and no watermark.
> 🎁 Launch week: code **LAUNCH50** for 50% off your first 3 months.
>
> Try it → https://YOUR-DOMAIN
> Feedback very welcome. What would make you switch from your current invoice tool?

Post it on: X/Twitter, LinkedIn, r/freelance, r/smallbusiness (check each subreddit's self-promo rules), Indie Hackers, Product Hunt (Tue–Thu launch), and freelancer Slack/Discord groups. Create the `LAUNCH50` coupon in Stripe → Product catalogue → Coupons.

---

## Project structure

```
billmint/
├─ api/create-checkout-session.js   optional Stripe Checkout function (Vercel)
├─ src/
│  ├─ lib/
│  │  ├─ layout.ts    ← one layout engine for both the preview (SVG) and the PDF
│  │  ├─ pdf.ts       jsPDF renderer + download
│  │  ├─ billing.ts   checkout integration (Payment Link / Gumroad / Checkout API / demo)
│  │  ├─ storage.ts   localStorage persistence, free-tier usage counter, Pro flag
│  │  ├─ pro.tsx      Pro context + requirePro() gate + upgrade modal host
│  │  └─ docs.ts, actions.ts, format.ts, csv.ts, image.ts …
│  ├─ components/     DocPreview, UpgradeModal, PricingCards, Shell (nav), Form, Icons
│  └─ pages/          Landing, Pricing, Dashboard, Editor, Settings, Clients, UpgradeSuccess
├─ vercel.json
└─ .env.example
```

localStorage keys: `billmint_docs`, `billmint_settings`, `billmint_clients`, `billmint_usage`, `billmint_pro`.

---

## Known gaps (honest MVP notes)

- **Pro unlock happens in the browser.** Anyone who knows about `localStorage` can flip it on, and that's fine for an MVP. Before scaling, add license keys (Gumroad and Lemon Squeezy both offer license-key APIs) or a small backend with accounts plus a Stripe webhook.
- **Data lives in one browser.** Nothing syncs across devices, and clearing browser data erases it (users can download a JSON backup from Settings). Accounts and cloud sync would be a natural Pro+ upsell.
- **No email sending.** Users download the PDF and attach it themselves.
- **PDF fonts are the standard Helvetica/Times.** They cover Western European characters (€, £, accents). Characters outside Latin-1 (e.g. Polish ł, Greek, CJK) won't render in the PDF until a custom TTF font is embedded.
- The free-tier counter is per browser, and the CSV export has no date-range filter.
