# BillMint business program: from now to the first $1k MRR

> **Owner:** Nicola Fuzio (100% of earnings; owns Stripe, bank, personal channels).
> **Operator:** BillMint CEO (runs planning, drafting, analysis, product fixes, weekly reporting).
> **Status on 6 Oct 2026:** app live at https://nikfuz.github.io/billmint/. **Payments are not live** (no Stripe Payment Link yet). **No revenue and no measured users.** This plan contains targets and assumptions only. Nothing in here is a result.
>
> Companion files: `LAUNCH_CHECKLIST.md` (Stripe setup + smoke test), `LAUNCH_POST.md` (public copy), `OUTREACH_5.md` (personal messages), `MARKETING_CAMPAIGNS.md` (campaigns to run once Stripe works).

---

## 1. The goal in numbers

| | Value |
| --- | --- |
| Target | **$1,000 net MRR**, measured in Stripe (real recurring charges after discounts, before Stripe fees and tax) |
| Price | Pro $12/month |
| Paying customers needed | **84** at full price (84 × $12 = $1,008) |
| During LAUNCH50 | A discounted customer counts as $6 MRR until the discount ends. Report **net MRR** (what Stripe actually charges) and **list MRR** (subs × $12) separately, and never quote list MRR as revenue. |
| Target date | ~24 weeks after Stripe goes live (planning target, not a forecast) |

The only source of truth for revenue is the Stripe dashboard. Usage numbers come only from analytics we actually install (section 7). Until then, we report "unknown", not estimates.

---

## 2. Positioning

**For** solo freelance designers, developers and copywriters in the EU and US who bill 2–10 clients a month,
**who** want invoices and quotes that look as good as their work but don't want an accounting suite,
**BillMint is** a browser-based invoice and quote maker
**that** produces a polished, branded PDF in about a minute, with no signup, and keeps client data in the user's own browser.
**Unlike** full accounting tools (more setup and features than a solo freelancer needs) and free online generators (generic look, no saved clients or branding),
**BillMint** is quick, private and on-brand.

**Three message pillars** (use the same ones everywhere: landing, posts, outreach):
1. **Looks like your work.** Your logo, your colour, three templates, a live preview that matches the PDF exactly.
2. **One minute, no signup.** Open the link, fill it in, download the PDF. Quote → invoice in one click.
3. **Private by default.** No account, no server. Client data stays in your browser. JSON backup any time.

**Proof we can honestly use today:** live product, no-signup flow, EUR/USD/GBP + VAT/tax ID, quote → invoice, A4 multi-page PDF. **Proof we cannot use yet:** user counts, testimonials, "trusted by", revenue. We add these only once real and with permission.

**What we don't claim:** accounting, tax compliance, e-invoicing (e.g. SDI in Italy, Peppol), payment collection, multi-device sync. These are gaps, not features.

---

## 3. Offer and pricing

| | Free | Pro |
| --- | --- | --- |
| Price | $0 | **$12/month**, month-to-month, cancel anytime (Stripe customer portal) |
| Documents | 3 per month | Unlimited |
| PDF | "BillMint · Free" watermark | No watermark |
| Branding | No | Logo + brand colour |
| Templates | Mint | Mint, Classic, Bold |
| Client list, CSV export | No | Yes |

**Why the split works for this ICP:** someone billing 2–10 clients a month hits the 3-document limit in a normal month, and the watermark is visible to *their* clients, the people they want to impress. The upgrade trigger is built into real use, not a nag.

**Launch offer: `LAUNCH50`.** Recommended terms (consistent with the README's suggested launch post):
- 50% off for the **first 3 months** (Stripe coupon: 50%, duration "repeating", 3 months), then $12/month.
- Promotion code `LAUNCH50`, **expires 14 days after public launch day**, max 100 redemptions.
- Create it only after the Payment Link is live, with "Allow promotion codes" on. Fill the exact terms and date into `LAUNCH_POST.md` before posting.

**Pricing rules for this phase:**
- **Don't change the $12 price before ~300 activated free users or 10 paying customers.** Below that, any conversion signal is noise.
- **Annual plan** ($120/year, "2 months free") is a Phase 3 option, added once there are ≥15 monthly subscribers and we see churn data. It improves cash and retention without lowering the monthly price.
- **EUR price:** half the ICP is in the EU. Add a €12/month price on the same Stripe product in Phase 2 if EU visitors are a large share of checkouts (Stripe supports multi-currency prices).
- **No lifetime deals.** They cap revenue and attract the wrong buyers for a $12 product.

---

## 4. Funnel: free → Pro

```
Visit landing  →  Open editor  →  Create 1st doc  →  Download PDF  →  Hit 3-doc limit / touch Pro feature  →  Click Upgrade  →  Stripe checkout  →  Pro
   (reach)          (intent)       (activation)       (value)            (upgrade trigger)                   (intent to pay)     (conversion)
```

**Definitions** (use these exact terms in reports):
- **Visitor:** unique visit to the landing or app.
- **Activated user:** created *and* downloaded at least one PDF.
- **Upgrade trigger:** hit the 3-doc limit or opened the upgrade modal from a Pro feature.
- **Paying customer:** active Stripe subscription (in Stripe, not in localStorage).

**Planning assumptions, to be replaced by real data as soon as we have it.** These are typical ranges for small freemium tools, not BillMint data:

| Step | Assumption | Implication |
| --- | --- | --- |
| Visitor → activated | 20–35% | No signup helps. Watch this first. |
| Activated → paying (within 60 days) | 2–5% | 84 paying ⇒ roughly **1,700–4,200 activated users** |
| Visitor → paying | ~0.5–1.5% | ⇒ roughly **6,000–17,000 visitors** over the period |
| Monthly churn | 5–8% | We need slightly more than 84 gross sign-ups to *hold* 84 |

If real numbers come in below the low end after ~300 activated users, use the decision rules in section 9 instead of just pushing more traffic.

**Conversion levers, in priority order (cheap first):**
1. **Upgrade-modal copy at the moment of the trigger** (already feature-specific). Test lines that talk about the client seeing the watermark and the 4th invoice of the month.
2. **Founder follow-up.** Every Upgrade click that doesn't finish checkout can't be reached (no email). So the landing and the post-limit screen should offer a "send me feedback / questions" email link to Nicola.
3. **Trust signals on pricing:** "Secure checkout by Stripe", "Cancel anytime", a real contact email, and later a custom domain.
4. **LAUNCH50** for launch weeks only. No permanent discounting.

---

## 5. Phase plan

### Phase 0: Payment-ready (Week 0, before any campaign)
**Goal:** a stranger can pay, and we can measure what happens.

| # | Task | Owner | Done when |
| --- | --- | --- | --- |
| 0.1 | Stripe account, product, Payment Link, customer portal, support email: everything in `LAUNCH_CHECKLIST.md` | **Nicola** | Smoke test passes in test mode and live mode |
| 0.2 | **Tax/VAT decision before the first live sale.** Selling a digital subscription to EU consumers can bring EU VAT (OSS) obligations, and selling from Italy needs the right business registration. Options: (a) enable Stripe Tax + register as needed, (b) switch to a merchant of record (Lemon Squeezy / Paddle) who handles VAT. Ask a commercialista. This is not legal advice. | **Nicola** (CEO prepares the comparison) | Written decision; Stripe/MoR configured accordingly |
| 0.3 | Privacy-friendly analytics with custom events (e.g. GoatCounter, free for small sites, or Plausible, ~$9/mo): `landing_view`, `editor_open`, `doc_created`, `pdf_downloaded`, `limit_hit`, `upgrade_modal_open`, `upgrade_click`, `checkout_success` | CEO (code), Nicola approves the tool | Events visible in the dashboard from a test run |
| 0.4 | Update the privacy note/FAQ to mention cookie-less analytics (keeps "private by default" honest) | CEO | FAQ updated, deployed |
| 0.5 | Visible contact email in footer, pricing FAQ and `#/upgrade/unverified` | CEO + Nicola picks the address | Deployed |
| 0.6 | UTM convention adopted (see `MARKETING_CAMPAIGNS.md`) and a simple tracking sheet (date, channel, link, visits, activations, paid) | CEO | Sheet exists |
| 0.7 | Optional: custom domain (~$10–15/year). If done, update the Stripe redirect URL and all copy *before* launch, not after. | Nicola decides | Decided either way |
| 0.8 | `LAUNCH50` created in Stripe with the terms in section 3 | **Nicola** | Code works at checkout in test mode |

**Exit:** one live charge (Nicola's own card, refunded) went through end to end, analytics shows the full event path, and the tax decision is written down.

### Phase 1: First 10 paying customers (Weeks 1–4)
**Goal:** prove strangers and friends-of-friends will pay $12/month, and learn why or why not.
- Week 1: **Campaign A** (warm network) as a soft launch: personal messages from `OUTREACH_5.md`.
- Week 2: **Campaign D** (public launch week) using `LAUNCH_POST.md`.
- Weeks 2–4: start **Campaign B** (communities) at a slow cadence; set up the **Campaign C** content baseline.
- Talk to people: at least **15 feedback conversations** (calls, DMs, email replies) with ICP freelancers, written up in a feedback log.
- Fix what blocks payment or trust within 48 h. Everything else goes into the backlog.

**Exit criteria (all three):** ≥10 paying customers in Stripe · ≥15 logged conversations · the measured funnel replaces at least the first two assumptions in section 4.

### Phase 2: Find one repeatable channel (Weeks 5–10)
**Goal:** one channel that brings activated users every week without a fresh launch.
- Run Campaign B (communities) and Campaign C (LinkedIn + SEO) on a fixed weekly cadence. Compare **activated users and paid conversions per hour spent** by channel, via UTM.
- **Product work driven by Phase 1 feedback.** Likely candidates already known from the README:
  - Server-side payment verification or license keys (closes the localStorage hole and fixes "Pro on one browser only").
  - An embedded Unicode font for PDFs (Polish, Czech, Greek etc. don't render today, which matters for the EU ICP).
  - EUR price in Stripe.
- Directory listings (free): see Campaign C.

**Exit:** ≥35 paying customers, and one channel that delivers ≥40% of new activated users at a cost Nicola/CEO can keep up weekly.

### Phase 3: Scale to $1k MRR (Weeks 11–24)
**Goal:** 84+ full-price-equivalent subscribers, churn under control.
- Double down on the winning channel; cut the weakest one.
- Add the **annual plan** ($120/year) once ≥15 monthly subs exist.
- **Referral loop:** the free-tier watermark and footer badge already put BillMint in front of every client who receives a free PDF. Make the badge a clickable link with `utm_source=pdf_badge` so it can be measured. Then test a referral offer (e.g. 1 free month for both sides via Stripe coupon) if Phase 2 shows word-of-mouth.
- **Retention:** a 3-question cancel survey in Stripe's customer portal; monthly email to Pro users only if we've collected emails through Stripe and the customer agreed.
- Small paid test only if organic conversion is known: max **$100**, one channel, stop if cost per paying customer > 3 months of revenue ($36).

**Exit:** ≥$1,000 net MRR in Stripe for two consecutive weeks.

---

## 6. Roles: who does what

| Only Nicola (account/identity owner) | BillMint CEO |
| --- | --- |
| Stripe, bank, tax registration, refunds | Draft every post, message, page and email for Nicola to approve |
| Sending messages from Nicola's personal email/LinkedIn/communities (CEO drafts, Nicola sends) | Analytics setup, product fixes, deploys |
| Final yes on price changes, paid spend, tax setup | Weekly scorecard and recommendations |
| Customer calls where a human face matters | Feedback log, support triage, FAQ updates |

Nothing goes out under Nicola's name without his approval.

---

## 7. Metrics

**North star:** paying Pro subscribers (Stripe), with net MRR alongside it.

**Weekly scorecard** (filled every Monday; "n/a" until the tool exists, never guessed):

| Metric | Source | This week | Last week |
| --- | --- | --- | --- |
| Visitors | Analytics | | |
| Activated users (PDF downloaded) | Analytics events | | |
| Activation rate | calc | | |
| Limit hits / upgrade modal opens | Analytics | | |
| Upgrade clicks | Analytics | | |
| New paying customers | Stripe | | |
| Cancellations | Stripe | | |
| Active subscriptions | Stripe | | |
| Net MRR / list MRR | Stripe | | |
| Top channel by activations (UTM) | Analytics | | |
| Conversations logged | Feedback log | | |
| Support issues open | Inbox | | |

**Leading indicators to watch first:** activation rate (product/landing problem if low), limit-hit rate (free limit or ICP-fit problem if low), upgrade-click → paid (checkout/trust/price problem if low).

---

## 8. Weekly operating calendar

Assumes ~6–8 hours/week of Nicola's time during Phases 1–2, mostly approving and sending. The CEO does the rest.

| Day | Block | What happens |
| --- | --- | --- |
| **Mon** | Review (45 min) | Fill scorecard from Stripe + analytics. Pick the week's 3 priorities. Send Nicola a 5-line update: numbers, what worked, what's next, decisions needed. |
| **Tue** | Distribution (1–1.5 h) | Campaign B community post or reply round; 5 warm/semi-warm personal messages (Campaign A cadence). |
| **Wed** | Content (1–1.5 h) | Campaign C: one LinkedIn post + drafting one SEO page or guide. |
| **Thu** | Product (CEO, 2–4 h) | Fix the top item from the feedback log; deploy; smoke-test checkout. |
| **Fri** | Customers (1 h) | Answer support, reply to every comment, follow up once on unanswered messages from the week before, update feedback log. |
| **Monthly, 1st Mon** | Strategy (1 h) | Phase exit-criteria check; channel keep/kill decision; pricing/offer decisions (only per section 9 rules). |

---

## 9. Decision rules (so we don't guess)

| Signal (after enough data) | Decision |
| --- | --- |
| Activation < 15% after 500 visitors | Fix landing → editor path before more traffic (headline, first-screen CTA, sample data). |
| Activation OK but limit hits rare | ICP mismatch or limit too generous. Check who's arriving (channel mix) before touching the limit. |
| Upgrade clicks OK but < 20% complete checkout | Trust/checkout issue: domain, contact info, currency (EUR), tax display. |
| < 3 paying after 300 activated users | Offer problem. Run 10 interviews on "what would make this worth $12?", then test one change at a time (annual plan, EUR, feature gating). |
| Monthly churn > 10% | Retention before acquisition: cancel-survey reasons, multi-device/data-loss fixes. |
| A channel gives 0 paid and < 10 activations after 4 weeks of steady effort | Stop it; move the hours to the best channel. |

---

## 10. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Stripe not live / delayed** | No revenue possible; campaigns burn goodwill | Campaigns A–D are gated on the Phase 0 exit. Before then, at most "free tool, feedback wanted" posts with no offer. |
| **EU VAT / Italian tax compliance** | Fines, forced refunds | Phase 0.2 decision before the first live sale; MoR option if setup is too heavy. |
| **Client-side Pro unlock** (localStorage, not verified against Stripe) | Some leakage; cancelled users keep Pro | Acceptable for the first sales (per `LAUNCH_CHECKLIST.md`). Server verification/license keys in Phase 2 before scaling paid acquisition. |
| **Pro is per browser; data doesn't sync** | Support load, "I paid but don't have Pro" tickets, data-loss complaints | Clear FAQ, reply within 24 h, manual fix process; prominent JSON backup reminder; sync is a future Pro+ upsell. |
| **PDF font is Latin-1 only** | Broken PDFs for some EU users (PL, CZ, GR…) | Say it in the FAQ now; embed a Unicode font in Phase 2. |
| **Strong free competitors** (free invoice generators, free tiers of accounting tools) | Low willingness to pay | Compete on look, speed and privacy, not on features. Validate $12 with real conversions before changing anything. |
| **Community self-promo rules** | Bans, reputational damage | Read each community's rules first; contribute before posting; disclose "I built this"; one post per community per launch. |
| **Founder time** | Cadence collapses | Fixed weekly calendar; the CEO drafts everything; Nicola approves in batches. |
| **Fake-traction temptation** | Trust damage | No invented numbers, testimonials or logos. Quotes only with written permission. |
| **GitHub Pages subpath domain** | Lower trust and SEO | Optional custom domain in Phase 0.7 or Phase 2; update the Stripe redirect at the same time. |

---

## 11. What happens next (in order)

1. Nicola: Stripe setup + tax decision (Phase 0.1, 0.2, 0.8).
2. CEO: analytics events, contact email, FAQ updates, UTM sheet (Phase 0.3–0.6), then deploy and smoke test.
3. Once the Phase 0 exit passes: run `MARKETING_CAMPAIGNS.md` starting with Campaign A in Week 1.
