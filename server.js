const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const articleRoute = require('./routes/articleRoute');
const presentationRoute = require('./routes/presentationRoute');
const userRoute = require('./routes/userRoute');
const factureRoute = require('./routes/factureRoute');
const Logger = require('./logger');
const EventEmitter = require('events');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const logger = new Logger();
const eventEmitter = new EventEmitter();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('Connected to MongoDB');
        console.log('Connected to MongoDB');
        eventEmitter.emit('dbConnected');
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error);
        console.error('Error connecting to MongoDB:', error);
        eventEmitter.emit('dbError', error);
    });

app.use((req, res, next) => {
    logger.logRequests(req, res, next);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/articles', articleRoute);
app.use('/presentation', presentationRoute);
app.use('/user', userRoute);
app.use('/generate-facture', factureRoute);

app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
    console.log(`http://localhost:${port}`);
    eventEmitter.emit('serverStarted', port);
});

eventEmitter.on('dbConnected', () => {
    console.log('Event: Successfully connected to the database.');
});

eventEmitter.on('dbError', (error) => {
    console.error('Event: Database connection error:', error);
});

eventEmitter.on('serverStarted', (port) => {
    console.log(`Event: Server started on port ${port}`);
});
