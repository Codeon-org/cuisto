import type { Prisma } from "@prisma/client";

export const userSelect = {
    id: true,
    username: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    roles: true
} satisfies Prisma.UserSelect;
