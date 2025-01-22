const path = require('path');
const express = require('express');
const winston = require('winston');
require('winston-daily-rotate-file');
const nodemailer = require('nodemailer');

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} - ${level.toUpperCase()}: ${message}`;
});

class Logger {
    constructor(logDirectory) {
        this.logDirectory = logDirectory || path.join(__dirname, 'logs');

        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
                logFormat
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.DailyRotateFile({
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    dirname: this.logDirectory,
                    maxSize: '5m',
                    maxFiles: '14d'
                })
            ]
        });
    }

    log(level, message) {
        this.logger.log({ level, message });
    }

    info(message) {
        this.log('info', message);
    }

    warn(message) {
        this.log('warn', message);
    }

    error(message) {
        this.log('error', message);
    }

    critical(message) {
        this.log('crit', message);
        this.sendCriticalErrorEmail(message);
    }

    logRequests(req, res, next) {
        const { method, url } = req;
        res.on('finish', () => {
            const { statusCode } = res;
            this.info(`Request: ${method} ${url} - Status: ${statusCode}`);
        });
        next();
    }

    sendCriticalErrorEmail(message) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'server@gmail.com',
                pass: 'server'
            }
        });

        const mailOptions = {
            from: 'server@gmail.com',
            to: 'admin@server.com',
            subject: 'Critical Error Alert',
            text: message
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return this.error(`Error sending email: ${error}`);
            }
            this.info(`Email sent: ${info.response}`);
        });
    }
}

module.exports = Logger;
