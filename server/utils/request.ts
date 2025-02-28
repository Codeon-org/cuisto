import type { H3Event } from "h3";
import { z } from "zod";
import { defu } from "defu";

export const getPagination = (request: H3Event) =>
{
    const querySchema = z.object({
        page: validation.pagination.page.optional(),
        itemsPerPage: validation.pagination.itemsPerPage.optional(),
        sort: validation.pagination.sort.optional(),
        order: validation.pagination.order.optional(),
    });

    const query = getValidatedQuery(request, querySchema.parse);

    const pagination = defu(query, { page: 1, itemsPerPage: 10, sort: "createdAt", order: "desc" });

    return {
        page: pagination.page,
        take: pagination.itemsPerPage,
        skip: (pagination.page - 1) * pagination.itemsPerPage,
        sort: pagination.sort,
        order: pagination.order,
        orderBy: {
            [pagination.sort]: pagination.order
        }
    };
};
