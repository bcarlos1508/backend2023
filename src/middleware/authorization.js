import Logger from '../utils/logger.js';

const authorize = (roles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.role || !roles.includes(user.role)) {
                Logger.warning('Intento de acceso no autorizado');
                return res.status(403).json({ status: 'error', message: 'Acceso no autorizado' });
            }
            next();
        } catch (error) {
            Logger.error('Error en el middleware de autorización:', error);
            return res.status(500).json({ status: 'error', message: 'Error Interno del Servidor' });
        }
    };
};

export default authorize;