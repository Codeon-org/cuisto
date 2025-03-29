import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id,
});

const bodySchema = z.object({
    name: validation.unit.name,
    symbol: validation.unit.symbol,
    formula: validation.unit.formula,
    baseUnitId: validation.common.id.optional(),
});

export default defineEventHandler(async (event) =>
{
    const { id: userId } = event.context.user;
    const url = await getValidatedRouterParams(event, urlSchema.parse);

    const house = await prisma.house.findFirst({
        where: {
            AND: [
                { id: url.houseId },
                {
                    OR: [
                        { ownerId: userId },
                        { users: { some: { id: userId } } }
                    ]
                }
            ],
        }
    });

    if (!house)
    {
        throw createError({
            statusCode: 404,
            statusMessage: "House not found"
        });
    }

    const body = await readValidatedBody(event, bodySchema.parse);

    // Check if the base unit exists
    if (body.baseUnitId)
    {
        const baseUnit = await prisma.unit.findUnique({
            where: {
                id: body.baseUnitId,
                houseId: url.houseId,
            },
        });

        if (!baseUnit)
        {
            throw createError({
                statusCode: 404,
                statusMessage: "Base unit not found"
            });
        }
    }

    if (!isFormulaValid(body.formula, { x: 1 }))
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid formula"
        });
    }

    const unit = await prisma.unit.create({
        data: {
            name: body.name,
            symbol: body.symbol,
            formula: body.formula,
            houseId: url.houseId,
            baseUnitId: body.baseUnitId ?? null,
        },
    });

    return unit;
});
