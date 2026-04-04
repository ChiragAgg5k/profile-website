/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_SPREE_URL?: string;
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  readonly VITE_UMAMI_SRC?: string;
  readonly VITE_UMAMI_HOST_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
