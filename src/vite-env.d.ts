/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_STRIPE_PAYMENT_LINK?: string;
  readonly VITE_GUMROAD_URL?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_PRICE_ID?: string;
  readonly VITE_CHECKOUT_ENDPOINT?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
