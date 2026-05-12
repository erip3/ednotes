/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_APP_MOCK_API_PORT: string;
  readonly VITE_ENABLE_API_MOCKING?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
