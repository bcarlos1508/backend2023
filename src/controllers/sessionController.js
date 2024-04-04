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
        Logger.info('User registered successfully');
        res.status(200).json({ status: 'success', message: 'User registered', payload: req.user._id });
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
        Logger.info('User logged in successfully');
        res.status(200).json({ status: 'success', payload: user });
    });
};

export const getCurrentUser = async (req, res) => {
    const token = req.cookies.cookie;

    if (!token) {
        Logger.error('No token found');
        return res.status(401).json({ status: 'error', message: 'No token found' });
    }

    jwt.verify(token, 'secret', async (err, decoded) => {
        if (err) {
            Logger.error('Failed to authenticate token');
            return res.status(401).json({ status: 'error', message: 'Failed to authenticate token' });
        }

        try {
            const user = await userModel.findById(decoded.id);
            if (!user) {
                Logger.error('User not found');
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            const userDTO = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            };

            Logger.info('Current user retrieved successfully');
            res.status(200).json({ status: 'success', payload: userDTO });
        } catch (error) {
            Logger.error('Internal server error');
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    });
};

export const adminEndpoint = (req, res) => {
    Logger.info('Admin endpoint accessed successfully');
    res.status(200).json({ status: 'success', message: 'Admin endpoint accessed successfully' });
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        Logger.warn('Forbidden. Admin access required.');
        res.status(403).json({ status: 'error', message: 'Forbidden. Admin access required.' });
    }
};

