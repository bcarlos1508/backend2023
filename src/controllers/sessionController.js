import passport from 'passport';
import jwt from 'jsonwebtoken';
import userModel from '../dao/models/users.js';
import Logger from '../utils/logger.js';

export const registerUser = (req, res) => {
    passport.authenticate('register', {
        passReqToCallback: true,
        session: false,
        failureRedirect: '/session/failedRegister',
        failureMessage: true
    })(req, res, () => {
        Logger.info('Usuario registrado exitosamente');
        res.status(200).json({ status: 'success', message: 'Usuario registrado', payload: req.user._id });
    });
};

export const loginUser = (req, res) => {
    passport.authenticate('login', {
        passReqToCallback: true,
        session: false,
        failureRedirect: '/session/failedLogin',
        failureMessage: true
    })(req, res, () => {
        const user = {
            id: req.user._id,
            name: `${req.user.first_name}`
        };

        const token = jwt.sign(user, 'secret', { expiresIn: '1h' });
        res.cookie('cookie', token, { maxAge: 3600000, httpOnly: true });
        Logger.info('El usuario inició sesión exitosamente');
        res.status(200).json({ status: 'success', payload: user });
    });
};

export const getCurrentUser = async (req, res) => {
    const token = req.cookies.cookie;

    if (!token) {
        Logger.error('No se encontró ningún token');
        return res.status(401).json({ status: 'error', message: 'No se encontró ningún token' });
    }

    jwt.verify(token, 'secret', async (err, decoded) => {
        if (err) {
            Logger.error('No se pudo autenticar el token');
            return res.status(401).json({ status: 'error', message: 'No se pudo autenticar el token' });
        }

        try {
            const user = await userModel.findById(decoded.id);
            if (!user) {
                Logger.error('Usuario no encontrado');
                return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
            }
            const userDTO = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            };

            Logger.info('Usuario actual recuperado con éxito');
            res.status(200).json({ status: 'success', payload: userDTO });
        } catch (error) {
            Logger.error('Error Interno del Servidor');
            res.status(500).json({ status: 'error', message: 'Error Interno del Servidor' });
        }
    });
};

export const adminEndpoint = (req, res) => {
    Logger.info('Se accedió correctamente al endpoint de Administración');
    res.status(200).json({ status: 'success', message: 'Se accedió correctamente al endpoint de Administración' });
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        Logger.warn('Prohibido. Se requiere acceso de administrador.');
        res.status(403).json({ status: 'error', message: 'Prohibido. Se requiere acceso de administrador.' });
    }
};

export const logoutUser = (req, res) => {
    try {
        req.logout();
        res.status(200).json({ status: 'success', message: 'Logout exitoso' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

