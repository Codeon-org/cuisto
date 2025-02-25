import type { H3Event } from "h3";
import { z } from "zod";
import { defu } from "defu";

const _schema = z.object({
    page: validation.pagination.page,
    itemsPerPage: validation.pagination.itemsPerPage,
    sort: validation.pagination.sort,
    order: validation.pagination.order,
});

export const getPagination = (request: H3Event) =>
{
    const query = getQuery<z.infer<typeof _schema>>(request);

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
