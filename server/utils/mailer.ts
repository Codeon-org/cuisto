import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use `true` for TLS with real SMTP servers
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendMail = async (options: { to: string; subject: string; html: string }) =>
{
    await mailer.sendMail({
        from: process.env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};

export default mailer;
