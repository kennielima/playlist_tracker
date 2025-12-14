import winston, { format } from 'winston';
import fs from "fs";
import path from 'path';
const { combine, json, timestamp, errors, colorize, simple } = format;


const formatDate = () => {
    var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return `${year}${month}${day}`;
};

const getFile = (type: string) => {
    const d = formatDate();
    const filename = `./logs/${d}${type}.log`;

    fs.open(filename, "r", function (err: any, fd: number) {
        if (err) {
            fs.writeFile(filename, "", function (err: any) {
                if (err) {
                    return `logs/${type}.log`;
                }
                return filename;
            });
        } else {
            return filename;
        }
    });
    return filename;
};

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        colorize(),
        simple(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        json()),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                simple(),
            )
        }),
        new winston.transports.File({
            filename: getFile("error"),
            level: 'error'
        }),
        new winston.transports.File({
            filename: getFile("info"),
            level: 'info'
        }),
        new winston.transports.File({
            filename: getFile("warn"),
            level: 'warn'
        })
    ],
    defaultMeta: { service: 'checkout-service' }
});

export default logger;