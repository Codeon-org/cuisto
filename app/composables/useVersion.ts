export const useVersion = () =>
{
    const config = useRuntimeConfig().public;
    return config.appVersion;
};
