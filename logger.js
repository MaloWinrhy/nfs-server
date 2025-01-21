const fs = require('fs');
const path = require('path');
const express = require('express');
const rfs = require('rotating-file-stream');

class Logger {
    constructor(logDirectory) {
        this.logDirectory = logDirectory || path.join(__dirname, 'logs');
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory);
        }
        this.logStream = rfs.createStream('server.log', {
            size: '5M',
            interval: '1d',
            path: this.logDirectory
        });
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} - ${message}\n`;
        this.logStream.write(logMessage);
    }

    info(message) {
        this.log(`INFO: ${message}`);
    }

    warn(message) {
        this.log(`WARN: ${message}`);
    }

    error(message) {
        this.log(`ERROR: ${message}`);
    }

    logRequests(req, res, next) {
        const { method, url } = req;
        res.on('finish', () => {
            const { statusCode } = res;
            this.info(`Request: ${method} ${url} - Status: ${statusCode}`);
        });
        next();
    }
}

module.exports = Logger;
