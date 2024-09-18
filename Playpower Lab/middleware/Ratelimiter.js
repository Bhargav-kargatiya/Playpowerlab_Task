import { Client } from "../app/app.js";

export const Ratelimiter = (TIMEOUT, MAXREQUESTS) => async (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    const key = `rateLimiter:${ip}`;
    await Client.incr(key);
    const currentLimit = Number(await Client.get(key));

    if (currentLimit === 1) {
        await Client.set(key, 1, 'EX', TIMEOUT);
    }

    if (currentLimit > MAXREQUESTS) {
        const ttl = await Client.ttl(key);
        res.status(429).json({
            message: "Too many requests",
            ttl: ttl,
            maxRequests: MAXREQUESTS,
            timeout: TIMEOUT,
        });
    }
    else { next(); }
} 