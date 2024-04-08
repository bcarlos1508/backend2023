import productModel from '../models/product.js';
import Logger from '../utils/logger.js';

export default class Carts {
    constructor() {
        Logger.info('Estamos trabajando con base de datos MongoDB para carritos.');
    }

    async getAll() {
        try {
            const products = await productModel.find().lean();
            Logger.info('Todos los productos recuperados exitosamente');
            return products;
        } catch (error) {
            Logger.error('Error al obtener todos los productos', error);
            throw error;
        }
    }

    async save(product) {
        try {
            const result = await productModel.create(product);
            Logger.info('Producto guardado exitosamente');
            return result;
        } catch (error) {
            Logger.error('Error al guardar el producto', error);
            throw error;
        }
    }
}
