import userModel from '../models/users.js';
import Logger from '../utils/logger.js';

export default class Users {
    constructor() {
        Logger.info('Working with Mongo');
    }

    getAll = async () => {
        try {
            let users = await userModel.find().lean();
            Logger.info('All users retrieved successfully');
            return users;
        } catch (error) {
            Logger.error('Error while getting all users', error);
            throw error;
        }
    }

    saveUser = async (user) => {
        try {
            let result = await userModel.create(user);
            Logger.info('User saved successfully');
            return result;
        } catch (error) {
            Logger.error('Error while saving the user', error);
            throw error;
        }
    }

    getById = async (param) => {
        try {
            let result = await userModel.findOne(param).populate('cart').lean();
            Logger.info('User retrieved by ID successfully');
            return result;
        } catch (error) {
            Logger.error('Error while getting user by ID', error);
            throw error;
        }
    }

    updateUser = async (id, user) => {
        try {
            delete user._id;
            let result = await userModel.updateOne({ _id: id }, { $set: user });
            Logger.info('User updated successfully');
            return result;
        } catch (error) {
            Logger.error('Error while updating the user', error);
            throw error;
        }
    }
}
