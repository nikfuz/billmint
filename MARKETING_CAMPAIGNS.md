# BillMint marketing campaigns

> **Gate: run none of these until the Phase 0 exit in `BUSINESS_PROGRAM.md` passes.** That means a Stripe Payment Link is live, the smoke test in `LAUNCH_CHECKLIST.md` has passed, analytics events work, and `LAUNCH50` exists in Stripe.
> Before that, the most we do is ask for feedback on a free tool, with no offer (see the "Before Stripe" note in `LAUNCH_POST.md`).
>
> **House rules for every campaign**
> - No invented numbers: no user counts, revenue, testimonials or "trusted by". Quote someone only with written permission.
> - Copy comes from `LAUNCH_POST.md` (public) and `OUTREACH_5.md` (personal). Same facts everywhere: Free = 3 docs/month + watermark; Pro = $12/month, unlimited, branding, 3 templates, client list, CSV; cancel anytime.
> - `LAUNCH50` = **50% off the first 3 months**, expires **14 days after public launch day**, max 100 redemptions (recommended terms; see `BUSINESS_PROGRAM.md` §3). Fill in the real date before posting.
> - Always disclose "I built this". Read each community's self-promotion rules before posting.
> - Nicola sends or posts from his own accounts; the CEO drafts and tracks.
> - Every success metric below is a **target to check against**, not a forecast.

---

## Timeline at a glance

Week 1 = the first week after the Phase 0 exit.

| Week | A: Warm network | B: Niche communities | C: LinkedIn + SEO | D: Launch week |
| --- | --- | --- | --- | --- |
| 0 | Build contact list | Map communities + rules | Write the first 3 posts | Prep assets |
| 1 | **Send wave 1** (soft launch) | Start participating (no links) | Post 1–2 | Final checks |
| 2 | Follow-ups | — | Launch-week posts | **Public launch** |
| 3 | Wave 2 (referrals from wave 1) | First showcase posts | Post 2/week + SEO page 1 | Wrap-up, LAUNCH50 expires end of week |
| 4–7 | Close loop, ask for intros | 1 community/week | 2 posts/week, 1 SEO page every 2 weeks | — |
| 8–12 | — | Repeat what worked | Keep cadence; directory listings | — |

---

## Tracking: UTM convention

The app uses hash routes, so put the query **before** the `#`:
`https://nikfuz.github.io/billmint/?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN`

| Campaign | utm_campaign | utm_source examples | utm_medium |
| --- | --- | --- | --- |
| A Warm network | `warm` | `email`, `linkedin_dm`, `whatsapp` | `direct` |
| B Communities | `community` | `reddit_sideproject`, `indiehackers`, `hn`, `<community-slug>` | `community` |
| C Content/SEO | `content` | `linkedin`, `blog`, `directory_<name>` | `social` / `organic` / `referral` |
| D Launch week | `launch` | `producthunt`, `x`, `bluesky`, `linkedin`, `hn` | `social` / `community` |

Stripe doesn't receive UTMs from a Payment Link by default, so attribute paid customers by the activation path in analytics (`checkout_success` with UTM) and by asking new Pro customers "where did you hear about BillMint?" in the welcome reply.

Log every send/post in the tracking sheet: date, campaign, channel, exact link, visits, activations, upgrade clicks, paid.

---

## Campaign A: Warm network (soft launch)

| | |
| --- | --- |
| **Audience** | People Nicola actually knows who match or sit next to the ICP: freelance designers, developers and copywriters he has worked with, ex-colleagues who went freelance, small-studio owners, founder friends who can give pricing feedback. |
| **Channel** | One-to-one email, LinkedIn DM or messenger. Templates 1–5 in `OUTREACH_5.md`. No bulk sends, no BCC lists. |
| **Creative angle** | "I built this, and I'd value your honest opinion." Asking for feedback first, the product second. Use the template that fits their role (designer = look and typography, dev = no-backend/privacy, copywriter = quote → invoice wording, founder = pricing). |
| **CTA** | Primary: "Try it on your next invoice and tell me what's missing." Secondary (optional line): `LAUNCH50` if they want Pro. |
| **Budget** | $0. ~3 hours of Nicola's time across 3 weeks. |
| **Success metric (targets)** | 30 personal messages → ≥10 replies → ≥8 activated users (via `utm_campaign=warm`) → **≥3 paying** · ≥5 feedback conversations logged · ≥3 intros to other freelancers. |

**Week-by-week**
- **Week 0:** CEO builds a contact sheet from the list Nicola provides (name, role, how he knows them, the `[personal line]`). Nicola drops anyone he can't write a real personal line for, as `OUTREACH_5.md` requires. Aim for 30–40 names.
- **Week 1 (soft launch):** Nicola sends ~6 messages a day, Monday to Friday, using the matching template with a personal UTM link. CEO logs sends and replies the same day.
- **Week 2:** One follow-up only to non-repliers from Week 1 (as `OUTREACH_5.md` allows): a short "no worries if not, any one-line reaction helps". Book 15-minute calls with anyone who replied with substance.
- **Week 3:** Wave 2: send to the people wave-1 contacts introduced. Ask each paying or engaged contact one question: "Who else do you know who'd want this?"
- **Week 4:** Close the loop. Thank everyone who gave feedback, tell them what changed because of it, and ask happy users whether they'd allow a short quote (written permission, stored in the feedback log).

---

## Campaign B: Niche community posts

| | |
| --- | --- |
| **Audience** | Freelancers and indie builders in public communities: maker/side-project communities, freelancer forums and subreddits, designer and copywriter communities, and EU/Italian freelancer groups Nicola already belongs to. |
| **Channel** | Candidates to verify (rules change; read them first): r/SideProject, r/webdev's "Showoff Saturday", freelancer subreddits via their weekly/self-promo threads only, Indie Hackers (product + post), Show HN, Designer News, and Slack/Discord/Facebook freelancer groups Nicola is already a member of. |
| **Creative angle** | Per community, not one blast: **Makers/devs:** "No backend, no signup, PDF generated in the browser, here's how." **Designers:** "Your invoice is the last thing a client sees, so here are 3 templates; tear the typography apart." **Freelancers:** a useful post first (e.g. "What I learned about quote → invoice workflows and late payments"), with BillMint as a disclosed footnote. |
| **CTA** | "Try it without signing up, then tell me what your invoices need that it doesn't do." Mention `LAUNCH50` only where the community allows offers, and only while it's valid. |
| **Budget** | $0. ~1.5 h/week. |
| **Success metric (targets)** | Per post: ≥5 substantive comments, ≥15 activated users via `utm_campaign=community`. Over Weeks 3–8: **≥5 paying** from this campaign, zero removals/bans. Kill a community after one post with < 5 activations. |

**Week-by-week**
- **Week 0:** CEO builds a community map: name, link, audience fit (1–5), self-promo rule (quoted), best day/time, whether Nicola is already a member. Keep the top 8.
- **Week 1:** Nicola participates without links: 3–5 helpful comments per target community (answers about invoicing, quoting, getting paid). This is what earns the right to post.
- **Week 2:** No community posts (launch week uses Show HN/Indie Hackers; see Campaign D). Keep commenting.
- **Week 3:** First 2 showcase posts in the highest-fit communities, written for each audience. Nicola answers every comment within 24 hours.
- **Weeks 4–7:** One new community per week. Each week, the CEO compares activations per post and drafts the next post from the angle that worked best.
- **Week 8:** Review: keep the top 2–3 communities on a monthly cadence (e.g. a "what I changed based on your feedback" update), drop the rest.

---

## Campaign C: LinkedIn cadence + SEO foundation

| | |
| --- | --- |
| **Audience** | **LinkedIn:** Nicola's network plus second-degree freelancers and small-studio owners in the EU/US. **SEO:** freelancers searching for things like "freelance invoice template", "quote to invoice", "invoice generator no signup", "invoice with VAT number EU freelancer". |
| **Channel** | Nicola's personal LinkedIn (personal profiles get more reach than company pages); static guide pages; free directory listings (e.g. AlternativeTo, SaaSHub, Product Hunt product page). |
| **Creative angle** | **Build in public, honestly:** what was built, what feedback changed, what's next. No vanity numbers until they're real and meaningful. **Practical freelancer advice** that BillMint fits into naturally: what to put on an EU invoice to a client in another country, why quotes should become invoices, payment terms that get you paid faster. |
| **CTA** | LinkedIn: "Link in the first comment: make your next invoice in a minute, no signup." SEO pages: "Make this invoice now" button into the editor. |
| **Budget** | $0 base. Optional: custom domain (~$10–15/year), which helps SEO a lot compared with a github.io subpath. Decide before publishing SEO pages so links don't break later. |
| **Success metric (targets)** | LinkedIn: 2 posts/week for 10 weeks; ≥20 activated users/month via `utm_source=linkedin` by Week 8. SEO: 5 guide pages live by Week 12, indexed in Google Search Console; first organic activations by Week 12 (SEO is slow, so judge it at ~6 months). |

**Technical note for SEO:** the app is a hash-routed single-page app on GitHub Pages, so search engines see very little text. Guide pages need to be **static HTML pages** (e.g. built into `public/guides/…`) with their own title and description. Set up Google Search Console (free) on whichever domain is final.

**Week-by-week**
- **Week 0:** CEO drafts the first 3 LinkedIn posts and an outline for 5 guide pages. Nicola approves the voice. Decide on the custom domain.
- **Week 1:** LinkedIn post 1, the founder story: "Why I built BillMint" (adapted from the long `LAUNCH_POST.md`, without the offer). Post 2: a 30-second screen recording of quote → invoice → PDF.
- **Week 2 (launch week):** LinkedIn launch post (long version of `LAUNCH_POST.md` *with* the `LAUNCH50` section) on launch day, plus one follow-up post at the end of the week about what people asked for.
- **Week 3:** Two posts (advice + build-in-public). Publish guide page 1: "Freelance invoice template: what to include (EU & US)". Submit to 2 directories.
- **Weeks 4–7:** Two posts/week (alternate advice / build-in-public / product tip). One guide page every 2 weeks (e.g. "Quote vs invoice", "Invoicing a client in another EU country: VAT ID basics", "Payment terms that get freelancers paid", "Invoice generator without signup"). Two more directory listings.
- **Weeks 8–12:** Keep the cadence. Make the best-performing post format the default. Review Search Console queries and write the next page for the query with the most impressions.

---

## Campaign D: Launch week

| | |
| --- | --- |
| **Audience** | Everyone reachable in one concentrated week: Campaign A contacts (as first supporters), Nicola's social followers, maker communities, Product Hunt and Hacker News audiences. |
| **Channel** | Product Hunt, Show HN, Indie Hackers, LinkedIn, X / Bluesky / Mastodon / Threads, plus a reply to Campaign A contacts: "it's public today". |
| **Creative angle** | "Good-looking invoices and quotes in 60 seconds, no signup, your data stays in your browser." The launch-week hook is `LAUNCH50`, a clear time limit with real terms. |
| **CTA** | "Try it free, no signup. If you need unlimited invoices and your own branding, `LAUNCH50` gives 50% off your first 3 months, until [date]." |
| **Budget** | $0. Optional: under $20 for a short screen-recording tool or stock mockup, only if needed. |
| **Success metric (targets)** | Launch week: ≥300 visitors via `utm_campaign=launch`, ≥60 activated, ≥15 upgrade clicks, **≥5 paying**, ≥25 pieces of feedback. Plus: zero unanswered comments after 24 h, and zero checkout failures. |

**Week-by-week**
- **Week 0 (prep):**
  - Run the `LAUNCH_POST.md` pre-publish checklist: Stripe live, `LAUNCH50` created, `[…]` placeholders filled (terms, end date, contact email), private-window test invoice.
  - Prepare assets: 3–5 screenshots (`screenshots/` folder has a start), a 30–60 s demo video, the Product Hunt tagline (use the one-liner from `LAUNCH_POST.md`), first comment / maker comment, Show HN text (technical angle: client-side PDF, no backend, localStorage).
  - Pick launch day: **Tuesday–Thursday**. Block that day and the next one in Nicola's calendar for replying to comments.
  - Make sure the Product Hunt and Hacker News accounts exist and have some history; brand-new accounts tend to be restricted or ignored.
- **Week 1 (Campaign A soft launch runs):** Fix anything warm users report. Freeze features 48 h before launch; bug fixes only.
- **Week 2 (launch week):**
  - **Mon:** Final smoke test of checkout + `LAUNCH50` in live mode (refund yourself). Schedule the Product Hunt launch.
  - **Launch day (Tue/Wed):** Product Hunt goes live at 00:01 PT (09:01 Rome time most of the year; check the gap in late Oct/March when the US and EU change clocks on different dates). In the morning, post Show HN and the LinkedIn long post; short posts on X/Bluesky/Mastodon/Threads; Indie Hackers post. Message Campaign A contacts with a short note that it's public, **without asking for upvotes** (against Product Hunt and HN rules). Nicola replies to every comment the same day.
  - **Day +1:** Reply round; CEO logs every feature request in the feedback log; fix any blocking bug and deploy.
  - **Day +2:** "Day 2: here's what you asked for" short post; thank-you replies.
  - **Fri:** Launch review: scorecard from Stripe + analytics by UTM source; the top 5 requests; decide what ships next.
- **Week 3 (wrap-up):** Final reminder post 2 days before `LAUNCH50` expires (one post, no countdown spam). After expiry, deactivate the promotion code in Stripe and remove the Launch offer section from public copy, as `LAUNCH_POST.md` describes. Write a short public "what we learned" post with real, permission-safe numbers only, or none.

---

## After Week 12

Re-rank channels by **paid customers per hour of effort** (from the tracking sheet), keep the best two, and follow the Phase 3 plan in `BUSINESS_PROGRAM.md`. No paid ads until organic conversion rates are known; then at most a $100 capped test.
