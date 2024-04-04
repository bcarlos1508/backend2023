import express from 'express';
import Logger from '../utils/logger.js';

const router = express.Router();

router.get('/loggerTest', (req, res) => {
    Logger.debug('Test log - DEBUG level');
    Logger.http('Test log - HTTP level');
    Logger.info('Test log - INFO level');
    Logger.warning('Test log - WARNING level');
    Logger.error('Test log - ERROR level');
    Logger.fatal('Test log - FATAL level');
    
    res.send('Logger test executed. Check your logs.');
});

export default router;
