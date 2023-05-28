import express, {Application} from 'express';
import bodyParser from 'body-parser';
import {Logger, LogLevel} from "./common/logger";
import * as http from "http";

/** The express application. */
const app: Application = express();

/** Logger used to log messages. */
const logger = new Logger();

/** The tcp port of the server. */
const port = process.env.PORT || 3000;

/** A constant used to identify the source of the log message. */
const tag = 'server';

/**
 * Handles the 'unhandledRejection' event, which is emitted when a Promise is rejected but no error handler is attached.
 * @param reason - The reason for the unhandled rejection.
 * @param promise - The Promise that was rejected.
 */
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.terminal(tag, LogLevel.Error, `Unhandled Rejection at -> ${promise} due to -> ${reason}`);
    process.exit(1);
});

/**
 * Handles the 'beforeExit' event, which is emitted just before the Node.js process is about to exit.
 * @param code - The exit code of the process.
 */
process.on('beforeExit', (code: number) => {
    logger.terminal(tag, LogLevel.Info, `Application is about to exit with code -> ${code}`);

    server.close(() => {
        process.exit(0)
    });

    setTimeout(() => {
        process.exit(code)
    }, 100).unref();
});


/* A middleware that parses the JSON-encoded body of the request and makes it available in the req.body property. */
app.use(bodyParser.json());

/* A middleware that parses the URL-encoded body of the request and makes it available in the req.body property. */
app.use(bodyParser.urlencoded({extended: true}));

/* A middleware that allows the server to accept requests from other domains. */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT");
    next();
});

app.set('port', port);

/** The HTTP server instance.*/
const server = http.createServer(app);

/**
 * Handles server error events and performs appropriate error handling logic.
 * @param error - The error object representing the server error.
 * @throws The error object if it is not related to server listening.
 */
const onError = (error: NodeJS.ErrnoException): void => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? `pipe ${port}` : `port ${port}`;
    switch (error.code) {
        case "EACCES":
            logger.terminal(tag, LogLevel.Error, `${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.terminal(tag, LogLevel.Error, `${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Handles the server "listening" event and logs the server's address and port information.
 */
const onListening = (): void => {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${port}`;
    logger.terminal(tag, LogLevel.Info, `Server running on pid -> ${process.pid}, Listening on -> ${bind}`);
};

/* Setting a callback call to listening for errors. */
server.on('error', onError);

/* Setting a callback call to listening for when the server starts listening for connections. */
server.on('listening', onListening);

/* Starting to listening for connections on the port specified. */
server.listen(port);
