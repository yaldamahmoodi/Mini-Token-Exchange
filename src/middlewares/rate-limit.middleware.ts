import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 20,
    message: {
        status: 429,
        error: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
