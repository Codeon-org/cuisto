import { DateTime } from "luxon";

export default defineEventHandler(async () =>
{
    await sendMjmlMail({
        to: "example@mail.com",
        subject: "Invitation",
        template: "HouseInvitation",
        params: {
            firstName: "John Doe"
        }
    });

    return {
        status: "OK",
        timestamp: DateTime.now().toUTC(),
    };
});
