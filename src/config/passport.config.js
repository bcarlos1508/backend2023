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
                Logger.warning('Datos incompletos. Complete todos los campos obligatorios.');
                return done(null, false);
            }

            const exist = await userModel.findOne({ email });
            if (exist) {
                Logger.warning('El usuario con este correo electrónico ya existe.');
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
            Logger.info('Usuario registrado exitosamente.');
            return done(null, newUser);

        } catch (error) {
            Logger.error('Error durante el registro de usuario: ', error);
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
                Logger.warning('Credenciales inválidas.');
                return done(null, false);
            }
    
            Logger.info('El usuario inició sesión con éxito.');
            return done(null, user);
    
        } catch (error) {
            Logger.error('Error durante el inicio de sesión del usuario:', error);
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
            Logger.error('Error durante la deserialización del usuario:', error);
            done(error);
        }
    });
};

export default initializePassport;
