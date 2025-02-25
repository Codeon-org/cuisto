import { z } from "zod";

export default {
    common: {
        id: z.string().uuid("ID must be a valid UUID")
    },
    pagination: {
        page: z.number()
            .int()
            .min(1, "Page must be at least 1"),

        itemsPerPage: z.number()
            .int()
            .min(1, "Limit must be at least 1")
            .max(100, "Limit must be at most 100"),

        sort: z.string(),
        order: z.enum(["asc", "desc"])
    },
    user: {
        username: z.string()
            .min(3, "Username must be at least 3 characters long")
            .max(20, "Username must be at most 20 characters long")
            .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, and underscores"),

        email: z.string()
            .email("Email must be a valid email"),

        password: z.string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    },
    house: {
        name: z.string()
            .min(3, "House name must be at least 3 characters long")
            .max(50, "House name must be at most 50 characters long"),
    }
};
