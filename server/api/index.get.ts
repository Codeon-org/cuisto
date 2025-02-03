import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>
{
    return prisma.post.findMany();
});
