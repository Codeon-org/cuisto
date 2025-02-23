import type { H3Event } from "h3";
import { UAParser } from "ua-parser-js";
import { Address4, Address6 } from "ip-address";

export const getIpAddress = (event: H3Event): IpAddress =>
{
    const rawIp = getHeader(event, "x-forwarded-for") // Proxy IP
        || getHeader(event, "cf-connecting-ip") // Cloudflare IP
        || getHeader(event, "x-real-ip") // Nginx proxy IP
        || event.node.req.socket.remoteAddress // Default IP
        || "unknown";

    if (Address4.isValid(rawIp))
    {
        // It's a pure IPv4 address
        return { v4: rawIp, v6: undefined };
    }

    if (Address6.isValid(rawIp))
    {
        const ipv6 = new Address6(rawIp);
        if (ipv6.is4())
        {
            // It's an IPv6-mapped IPv4 address
            return { v4: ipv6.to4().address, v6: ipv6.address };
        }
        // It's a pure IPv6 address
        return { v4: undefined, v6: ipv6.address };
    }

    // Invalid IP case
    return { v4: undefined, v6: undefined };
};

export const getUserAgent = (event: H3Event): UserAgent =>
{
    const device = new UAParser(getHeader(event, "User-Agent"));

    const browserName = device.getBrowser().name;

    const osName = device.getOS().name;
    const osVersion = device.getOS().version;

    return {
        browser: browserName ? browserName : undefined,
        os: osName && osVersion ? `${osName} ${osVersion}` : undefined,
    };
};

export const getIpLocation = async (ip?: string): Promise<IpLocation> =>
{
    if (!ip)
    {
        return {
            country: undefined,
            city: undefined
        };
    }

    try
    {
        const location = await $fetch<IpLocation>(`http://ip-api.com/json/${ip}?fields=country,city`);

        return {
            country: location.country ?? undefined,
            city: location.city ?? undefined,
        };
    }
    catch
    {
        return {
            country: undefined,
            city: undefined,
        };
    }
};
