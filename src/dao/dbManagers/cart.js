import productModel from '../models/product.js';
import Logger from '../utils/logger.js';

export default class Carts {
    constructor() {
        Logger.info('We are working with MongoDB data base for carts');
    }

    async getAll() {
        try {
            const products = await productModel.find().lean();
            Logger.info('All products retrieved successfully');
            return products;
        } catch (error) {
            Logger.error('Error while getting all products', error);
            throw error;
        }
    }

    async save(product) {
        try {
            const result = await productModel.create(product);
            Logger.info('Product saved successfully');
            return result;
        } catch (error) {
            Logger.error('Error while saving the product', error);
            throw error;
        }
    }
}
