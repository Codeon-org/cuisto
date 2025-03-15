declare namespace NodeJS
{
    interface ProcessEnv
    {
        DATABASE_URL: string;
        JWT_SECRET: string;
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_USERNAME: string;
        SMTP_PASSWORD: string;
        SMTP_FROM: string;
        LOG_LEVEL: string;
        NUXT_PUBLIC_WS_URL: string;
        NUXT_PUBLIC_API_BASE_URL: string;
    }
}
