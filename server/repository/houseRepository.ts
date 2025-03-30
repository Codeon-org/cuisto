import type { House } from "@prisma/client";

export default {
    async getHouseById(houseId: string): Promise<House | null>
    {
        const house = await prisma.house.findFirst({
            where: {
                id: houseId,
            },
        });

        return house;
    }
};
