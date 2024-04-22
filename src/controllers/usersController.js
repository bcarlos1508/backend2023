import userModel from '../dao/models/users.js';
import { createHash } from '../utils/utils.js';
import Logger from '../utils/logger.js';
import MailService from '../services/mailService.js';
import { errorDictionary, errorHandler } from '../utils/errorHandler.js';
import moment from 'moment';

export const getAllUsers = async (req, res) => {
    try {
    const users = await userModel.find({}, 'first_name last_name email role').lean();
        console.log(users);
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        Logger.error(`Error al obtener todos los usuarios: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, birthDate, gender, dni, email, password } = req.body;

        if (!first_name || !last_name || !birthDate || !gender || !dni || !email || !password) {
            Logger.error('Datos incompletos');
            errorHandler(errorDictionary.INCOMPLETE_DATA, res);
            return;
        }

        const hashedPassword = await createHash(password);

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            dni,
            birthDate,
            gender,
            password: hashedPassword
        });

        await newUser.save();
        await MailService.sendMail(
            email,
            "Bienvenidos a nuestra plataforma",
            `<b>Hola ${first_name},</b><br><p>Gracias por registrarte. Bienvenido a bordo!</p>`
        );
        Logger.info('Usuario registrado exitosamente');
        res.status(201).json({ status: 'success', payload: newUser });

    } catch (error) {
        Logger.error(`Error al registrar usuario: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { newRole } = req.body;

        if (!uid || !newRole || !['user', 'premium'].includes(newRole)) {
            Logger.error('Parámetros no válidos para cambiar el rol de usuario');
            errorHandler(errorDictionary.INVALID_PARAMETERS, res);
            return;
        }

        const user = await userModel.findById(uid);

        if (!user) {
            Logger.error(`Usuario no encontrado con ID: ${uid}`);
            errorHandler(errorDictionary.USER_NOT_FOUND, res);
            return;
        }

        if (newRole === 'premium') {
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const uploadedDocumentNames = user.documents.map(doc => doc.name);

            const hasAllRequiredDocuments = requiredDocuments.every(requiredDoc => uploadedDocumentNames.includes(requiredDoc));

            if (!hasAllRequiredDocuments) {
                Logger.error('El usuario no ha subido todos los documentos requeridos para el estado Premium');
                return res.status(400).json({
                    status: 'error',
                    message: 'El usuario no ha subido todos los documentos requeridos para el estado Premium.'
                });
            }
        }

        if (req.user.role !== 'admin' && req.user._id.toString() !== uid) {
            Logger.error('No autorizado para cambiar el rol de usuario');
            errorHandler(errorDictionary.UNAUTHORIZED_ACCESS, res);
            return;
        }

        user.role = newRole;
        await user.save();

        Logger.info(`El rol del usuario cambió exitosamente: ${user.email}`);
        res.status(200).json({ status: 'success', message: 'El rol del usuario cambió exitosamente:', payload: user });
    } catch (error) {
        Logger.error(`Error al cambiar el rol de usuario: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

export const addDocumentToUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const files = req.files;

        if (!files || files.length === 0) {
            Logger.error('No se han subido documentos');
            errorHandler(errorDictionary.INVALID_PARAMETERS, res);
            return;
        }

        const filesArray = Array.isArray(files) ? files : [files];

        const documents = filesArray.map((file) => ({
            name: file.originalname,
            reference: file.path,
        }));
 
 
        await userModel.findByIdAndUpdate(userId, {
            $push: { documents: { $each: documents } },
            $set: { last_connection: new Date() },
        });
        Logger.info("Documentos cargados exitosamente");
        res
            .status(200)
            .json({ status: "success", message: "Documentos cargados exitosamente." });
    } catch (error) {
        Logger.error(`Error al cargar documentos: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
 };
 
 export const getMainUserData = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email role -_id');
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        Logger.error(`Error al obtener los datos del usuario principal: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const thresholdDate = moment().subtract(30, 'minutes').toDate();
        const inactiveUsers = await userModel.find({ last_connection: { $lt: thresholdDate } });

        if (inactiveUsers.length > 0) {
            const inactiveUserEmails = inactiveUsers.map(user => user.email);
            await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

            inactiveUserEmails.forEach(email => {
                MailService.sendMail(
                    email,
                    "Aviso de eliminación de cuenta",
                    "Su cuenta ha sido eliminada por inactividad."
                );
            });

            Logger.info(`Eliminado ${inactiveUsers.length} usuarios inactivos.`);
            res.status(200).json({ status: 'success', message: `Eliminado ${inactiveUsers.length} usuarios inactivos.` });
        } else {
            res.status(200).json({ status: 'success', message: "No se encontraron usuarios inactivos para eliminar." });
        }
    } catch (error) {
        Logger.error(`Error al eliminar usuarios inactivos: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};