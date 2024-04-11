/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_API_URL: string
    readonly VITE_APP_KEY: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_PORT: number
    readonly VITE_APP_SESSION_TIME: string
    readonly VITE_APP_REFRESH_TOKEN_TIME: number
    readonly VITE_APP_ENV: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}