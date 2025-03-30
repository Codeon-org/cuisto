export class HouseVoter implements IVoter
{
    public static OWNER = "owner";
    public static MEMBER = "member";

    public async satisfies(subject: string, attribute: string, user: string): Promise<boolean>
    {
        switch (attribute)
        {
            case HouseVoter.OWNER:
                return this.isOwner(subject, user);
            case HouseVoter.MEMBER:
                return this.isMember(subject, user);
            default:
                return false;
        }
    }

    private async isOwner(subject: string, user: string): Promise<boolean>
    {
        const house = await prisma.house.findFirst({
            where: {
                id: subject,
                ownerId: user
            }
        });

        return !!house;
    }

    private async isMember(subject: string, user: string): Promise<boolean>
    {
        const house = await prisma.house.findFirst({
            where: {
                AND: [
                    { id: subject },
                    {
                        OR: [
                            { ownerId: user },
                            { users: { some: { id: user } } }
                        ]
                    }
                ],
            }
        });

        return !!house;
    }
}
