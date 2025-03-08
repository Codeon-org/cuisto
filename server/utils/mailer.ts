import nodemailer from "nodemailer";
import mjml2html from "mjml";
import handlebars from "handlebars";

const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Use `true` for TLS with real SMTP servers
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendTextMail = async (options: { to: string; subject: string; text: string }) =>
{
    await mailer.sendMail({
        from: process.env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
    });
};

export const sendHtmlMail = async (options: { to: string; subject: string; html: string }) =>
{
    await mailer.sendMail({
        from: process.env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
};

export const sendMjmlMail = async (options: { to: string; subject: string; template: string; params: Record<string, unknown> }) =>
{
    const template = await useStorage("email").get(`${options.template}.mjml`);
    const html = mjml2html(handlebars.compile(template)(options.params)).html;

    await sendHtmlMail({
        to: options.to,
        subject: options.subject,
        html
    });
};

export default mailer;
