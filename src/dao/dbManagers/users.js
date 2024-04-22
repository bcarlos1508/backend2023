import userModel from '../models/users.js';
import Logger from '../utils/logger.js';

export default class Users {
    constructor() {
        Logger.info('Trabajando con Mongo');
    }

    getAll = async () => {
        try {
            let users = await userModel.find();
            Logger.info('Todos los usuarios recuperados exitosamentepp');
            return users;
        } catch (error) {
            Logger.error('Error al obtener todos los usuarios', error);
            throw error;
        }
    }

    saveUser = async (user) => {
        try {
            let result = await userModel.create(user);
            Logger.info('Usuario guardado con éxito');
            return result;
        } catch (error) {
            Logger.error('Error al guardar el usuario', error);
            throw error;
        }
    }

    getById = async (param) => {
        try {
            let result = await userModel.findOne(param).populate('cart').lean();
            Logger.info('Usuario recuperado por ID exitosamente');
            return result;
        } catch (error) {
            Logger.error('Error al obtener usuario por ID', error);
            throw error;
        }
    }

    updateUser = async (id, user) => {
        try {
            delete user._id;
            let result = await userModel.updateOne({ _id: id }, { $set: user });
            Logger.info('Usuario actualizado con éxito');
            return result;
        } catch (error) {
            Logger.error('Error al actualizar el usuario', error);
            throw error;
        }
    }
}
