import dotenv from 'dotenv';
import path from 'path';
import __dirname from '../utils/utils.js';

const envFilePath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envFilePath });

export default {
    mongo:{
        URL: process.env.MONGODB_URI,
        PORT: process.env.PORT
    },
    mailing:{
        SERVICE: process.env.MAILING_SERVICE,
        USER: process.env.MAILING_USER,
        PASSWORD: process.env.MAILING_PASSWORD,
        BASE: process.env.BASE_URL
    },
    logger:{
        LEVEL: process.env.LOGGER_LEVEL || "info",
        ENV: process.env.NODE_ENV,
        ERR: process.env.ERROR_LOG_FILENAME
    }
};