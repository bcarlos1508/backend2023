import passport from 'passport';
import local from 'passport-local';
import userModel from '../dao/models/users.js';
import { createHash, validatePassword } from '../utils/utils.js';
import Logger from '../utils/logger.js';

const LocalStrategy = local.Strategy;

const initializePassport = async () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        session: false
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;

            if (!first_name || !last_name || !age) {
                Logger.warning('Incomplete data. Please provide all required fields.');
                return done(null, false);
            }

            const exist = await userModel.findOne({ email });
            if (exist) {
                Logger.warning('User with this email already exists.');
                return done(null, false);
            }

            const hashedPassword = await createHash(password);

            const newUser = new userModel({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                role: 'user'
            });

            await newUser.save();
            Logger.info('User registered successfully.');
            return done(null, newUser);

        } catch (error) {
            Logger.error('Error during user registration:', error);
            done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        session: false
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user || !(await validatePassword(user, password))) {
                Logger.warning('Invalid credentials.');
                return done(null, false);
            }
    
            Logger.info('User logged in successfully.');
            return done(null, user);
    
        } catch (error) {
            Logger.error('Error during user login:', error);
            done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            Logger.error('Error during user deserialization:', error);
            done(error);
        }
    });
};

export default initializePassport;
