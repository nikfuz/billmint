# BillMint launch post

> **Status: ready to copy, but don't publish the discount yet.**
> The Upgrade button says "Pro checkout opens soon" until the Stripe Payment Link goes live (see `LAUNCH_CHECKLIST.md`).
> Two ways to use this:
> - **Before Stripe:** delete the "Launch offer" section and post it as a free tool.
> - **After Stripe:** create the `LAUNCH50` promo code in Stripe (Payment Link → "Allow promotion codes" on), fill in the `[…]` terms, and keep the section.
>
> No revenue or user numbers here, on purpose. Don't add any until they're real.

---

## Long version (blog, LinkedIn, Indie Hackers, Product Hunt description)

**Title:** BillMint: good-looking invoices and quotes in 60 seconds, no signup

Most freelancers I know put a lot of care into their work and then send it off with an invoice made from a Word template, a spreadsheet export, or an accounting tool that's way more than they need. The invoice is the last thing a client sees from you, and it's the one document that decides when you get paid.

So I built **BillMint**: a small web app for freelancers and small studios who just want a clean, professional invoice or quote without a signup or a monthly accounting bill.

**What it does**

- **Invoices and quotes.** Turn a quote into an invoice in one click once the job is approved. Numbering is handled for you.
- **Live preview that matches the PDF exactly.** What you see is what your client gets: a clean A4 PDF, multi-page when it needs to be.
- **Tax/VAT and multiple currencies.** EUR, USD and GBP, a default tax rate you can override on each invoice, and a field for your VAT/tax ID. It works for EU and US clients alike.
- **Private by default.** No account, no server. Your documents and client list stay in your browser. You can export a JSON backup any time.
- **Track what's outstanding.** Mark documents as draft, sent or paid, and see your outstanding and paid totals at a glance.

**Pricing**

| | Free | Pro: $12/month |
| --- | --- | --- |
| Documents | 3 per month | Unlimited |
| PDF | Small "BillMint · Free" watermark | No watermark |
| Branding | n/a | Your logo + brand colour |
| Templates | Mint | Mint, Classic, Bold |
| Client list | n/a | Saved clients, one-click fill |
| CSV export (for your accountant) | n/a | ✓ |

Pro is month-to-month and you can cancel any time from the link in your Stripe receipt.

**Try it:** https://nikfuz.github.io/billmint/
No signup. Open it, fill in your details, download the PDF.

**Launch offer** *(enable after Stripe: delete this section until the `LAUNCH50` code exists)*
Use code **LAUNCH50** at checkout for **50% off [first month / first 3 months: set in Stripe]**, valid until **[date]**.

I'd really like feedback, especially on what your invoices need that BillMint doesn't do yet. Reply here or email me at [your email].

: Nicola

---

## Short version (X / Bluesky / Mastodon / Threads)

> I built BillMint: clean invoices & quotes for freelancers in about a minute.
> No signup, your data stays in your browser, EUR/USD/GBP + VAT.
> Free for 3 docs/month · Pro $12/mo for unlimited, no watermark, your logo.
> https://nikfuz.github.io/billmint/
> *(enable after Stripe)* Launch code LAUNCH50: 50% off [terms].

## One-liner (bios, directory listings, forum signatures)

> BillMint: professional invoices & quotes in 60 seconds. Free to start, no signup. https://nikfuz.github.io/billmint/

---

## Pre-publish checklist

- [ ] Stripe Payment Link live and `npm run deploy` done (Upgrade no longer says "opens soon")
- [ ] `LAUNCH50` created in Stripe with the terms above, and "Allow promotion codes" on in the Payment Link
- [ ] `[…]` placeholders filled in (discount terms, end date, contact email)
- [ ] Opened the live link in a private window and created one test invoice
