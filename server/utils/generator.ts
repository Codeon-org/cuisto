import type { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";

export const generateNanoId = (model: keyof PrismaClient, field: string, options: { length: number }) => generate(model, field, () => nanoid(options.length));
export const generateUuid = (model: keyof PrismaClient, field: string) => generate(model, field, () => uuidv4());

export const generate = async <T>(model: keyof PrismaClient, field: string, generator: (iteration: number) => T, preTransformer?: (rawValue: T) => T, postTransformer?: (rawValue: T) => T) =>
{
    if (!(model in prisma))
    {
        throw new Error(`Model "${String(model)}" does not exist in Prisma.`);
    }

    let tries = 0;
    let alreadyExists;
    let value: T;

    do
    {
        const rawValue = generator(tries);

        value = preTransformer ? preTransformer(rawValue) : rawValue;

        try
        {
            // @ts-ignore
            alreadyExists = await prisma[model].findFirst({ where: { [field]: value } }) !== null;
        }
        catch
        {
            throw new Error(`Can not compare value with the database`);
        }

        tries++;
    } while (alreadyExists);

    return postTransformer ? postTransformer(value) : value;
};
