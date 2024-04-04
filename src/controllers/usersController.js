import userModel from '../dao/models/users.js';
import { createHash } from '../utils/utils.js';
import Logger from '../utils/logger.js';
import MailService from '../services/mailService.js';
import { errorDictionary, errorHandler } from '../utils/errorHandler.js';
import moment from 'moment';

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email role');
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        Logger.error(`Error getting all users: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, birthDate, gender, dni, email, password } = req.body;

        if (!first_name || !last_name || !birthDate || !gender || !dni || !email || !password) {
            Logger.error('Incomplete data');
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
            "Welcome to our platform",
            `<b>Hello ${first_name},</b><br><p>Thank you for registering. Welcome aboard!</p>`
        );
        Logger.info('User registered successfully');
        res.status(201).json({ status: 'success', payload: newUser });

    } catch (error) {
        Logger.error(`Error registering user: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { newRole } = req.body;

        if (!uid || !newRole || !['user', 'premium'].includes(newRole)) {
            Logger.error('Invalid parameters for changing user role');
            errorHandler(errorDictionary.INVALID_PARAMETERS, res);
            return;
        }

        const user = await userModel.findById(uid);

        if (!user) {
            Logger.error(`User not found with ID: ${uid}`);
            errorHandler(errorDictionary.USER_NOT_FOUND, res);
            return;
        }

        if (newRole === 'premium') {
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const uploadedDocumentNames = user.documents.map(doc => doc.name);

            const hasAllRequiredDocuments = requiredDocuments.every(requiredDoc => uploadedDocumentNames.includes(requiredDoc));

            if (!hasAllRequiredDocuments) {
                Logger.error('User has not uploaded all required documents for premium status');
                return res.status(400).json({
                    status: 'error',
                    message: 'User has not uploaded all required documents for premium status.'
                });
            }
        }

        if (req.user.role !== 'admin' && req.user._id.toString() !== uid) {
            Logger.error('Unauthorized to change user role');
            errorHandler(errorDictionary.UNAUTHORIZED_ACCESS, res);
            return;
        }

        user.role = newRole;
        await user.save();

        Logger.info(`User role changed successfully: ${user.email}`);
        res.status(200).json({ status: 'success', message: 'User role changed successfully', payload: user });
    } catch (error) {
        Logger.error(`Error changing user role: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

export const addDocumentToUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const files = req.files;

        if (!files || files.length === 0) {
            Logger.error('No documents uploaded');
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
        Logger.info("Documents uploaded successfully");
        res
            .status(200)
            .json({ status: "success", message: "Documents uploaded successfully." });
    } catch (error) {
        Logger.error(`Error uploading documents: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
 };
 
 export const getMainUserData = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email role -_id');
        res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
        Logger.error(`Error getting main user data: ${error.message}`);
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
                    "Account Deletion Notice",
                    "Your account has been deleted due to inactivity."
                );
            });

            Logger.info(`Deleted ${inactiveUsers.length} inactive users.`);
            res.status(200).json({ status: 'success', message: `Deleted ${inactiveUsers.length} inactive users.` });
        } else {
            res.status(200).json({ status: 'success', message: "No inactive users found to delete." });
        }
    } catch (error) {
        Logger.error(`Error deleting inactive users: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};