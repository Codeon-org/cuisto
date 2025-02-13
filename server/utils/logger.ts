import winston from "winston";

const { combine, timestamp, printf, colorize, errors, simple } = winston.format;

export default winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    levels: winston.config.syslog.levels,
    format: combine(
        colorize({ all: true, colors: { debug: "gray", info: "blue", notice: "green", warning: "yellow", error: "red", crit: "red", alert: "bold red", emerg: "bold red redBG" } }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
        errors({ stack: true }),
        simple(),
        printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
});
