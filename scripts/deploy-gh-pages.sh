#!/usr/bin/env bash
# Build and publish dist/ to the gh-pages branch (served at https://nikfuz.github.io/billmint/).
# Non-destructive: adds a normal commit on top of origin/gh-pages (no force push).
# Usage: npm run deploy        (reads VITE_* from .env.production; a shell env var overrides it, e.g.
#        VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/xxx npm run deploy)
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"

npm run build
touch dist/.nojekyll

if [ -n "${VITE_STRIPE_PAYMENT_LINK:-}" ] || grep -qE '^VITE_STRIPE_PAYMENT_LINK=.+' .env.production 2>/dev/null; then
  echo "Checkout: Stripe Payment Link is configured in this build."
else
  echo "Checkout: NO Stripe Payment Link in this build (Upgrade shows 'checkout opens soon')."
fi

git fetch origin gh-pages
TMP="$(mktemp -d)"
trap 'git -C "$ROOT" worktree remove --force "$TMP" >/dev/null 2>&1 || true' EXIT
git worktree add --detach "$TMP" origin/gh-pages
cd "$TMP"
git rm -rq --ignore-unmatch .
cp -a "$ROOT/dist/." .
git add -A
if git diff --cached --quiet; then
  echo "gh-pages already up to date."
  exit 0
fi
git commit -qm "Deploy BillMint ($(git -C "$ROOT" rev-parse --short HEAD))"
git push origin HEAD:gh-pages
echo "Deployed. Live in ~1 min at https://nikfuz.github.io/billmint/"
