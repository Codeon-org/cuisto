import { z } from "zod";

const urlSchema = z.object({
    houseId: validation.common.id,
    unitId: validation.common.id,
});

const bodySchema = z.object({
    name: validation.unit.name.optional(),
    symbol: validation.unit.symbol.optional(),
    formula: validation.unit.formula.optional(),
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

    // check if the unit exists
    const unit = await prisma.unit.findFirst({
        where: {
            id: url.unitId,
            houseId: url.houseId,
        },
    });

    if (!unit)
    {
        throw createError({
            statusCode: 404,
            statusMessage: "Unit not found"
        });
    }

    const body = await readValidatedBody(event, bodySchema.parse);

    // Check that the unit has a base unit if it has a formula
    if (body.formula && !unit.baseUnitId && !body.baseUnitId)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing base unit"
        });
    }

    if (body.baseUnitId && !unit.formula && !body.formula)
    {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing formula"
        });
    }

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

        if (!isFormulaValid(body.formula!, { x: 1 }))
        {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid formula"
            });
        }
    }

    const newUnit = await prisma.unit.update({
        where: {
            id: url.unitId,
        },
        data: {
            name: body.name,
            symbol: body.symbol,
            houseId: url.houseId,
            formula: body.baseUnitId ? body.formula ?? null : null,
            baseUnitId: body.baseUnitId ?? null,
        },
    });

    return newUnit;
});
