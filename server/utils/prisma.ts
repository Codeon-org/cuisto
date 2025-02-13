import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const userSelectExtension = Prisma.defineExtension({
    query: {
        user: {
            $allOperations: ({ args, query }) => query({
                ...args,
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    email: true,
                    username: true,
                    roles: true
                }
            })
        },
    },
});

export default prisma
    .$extends(userSelectExtension);
