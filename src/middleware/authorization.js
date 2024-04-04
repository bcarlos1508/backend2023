import Logger from '../utils/logger.js';

const authorize = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.role || !roles.includes(user.role)) {
                Logger.warning('Unauthorized access attempt');
                return res.status(403).json({ status: 'error', message: 'Unauthorized access' });
            }
            next();
        } catch (error) {
            Logger.error('Error in authorization middleware:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    };
};

export default authorize;