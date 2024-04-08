import fs from 'fs';
import path from 'path';
import Logger from '../../utils/logger.js';

const filePath = path.join(__dirname, '/files/products.json');

export default class ProductDAO {
    constructor() {
        Logger.info(`Trabajando en el archivo ${filePath}`);
    }

    async getAll() {
        try {
            if (fs.existsSync(filePath)) {
                const data = await fs.promises.readFile(filePath, 'utf8');
                Logger.info('Productos recuperados exitosamente');
                return JSON.parse(data);
            } else {
                Logger.info('No se encontró ningún archivo existente, devolviendo un array vacío');
                return [];
            }
        } catch (error) {
            Logger.error('Error al leer el archivo:', error);
            throw error;
        }
    }

    async save(product) {
        try {
            let products = await this.getAll();

            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                ...product,
            };

            products.push(newProduct);

            await fs.promises.writeFile(filePath, JSON.stringify(products, null, '\t'));
            Logger.info('Producto guardado exitosamente');
            return newProduct;
        } catch (error) {
            Logger.error('Error al guardar el producto:', error);
            throw error;
        }
    }

    async delete(productId) {
        try {
            let products = await this.getAll();
            const updatedProducts = products.filter(product => product.id !== productId);

            await fs.promises.writeFile(filePath, JSON.stringify(updatedProducts, null, '\t'));
            Logger.info('Producto eliminado exitosamente');
            return { success: true, message: 'Producto eliminado exitosamente' };
        } catch (error) {
            Logger.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    async update(productId, updatedData) {
        try {
            let products = await this.getAll();
            const index = products.findIndex(product => product.id === productId);

            if (index !== -1) {
                products[index] = { ...products[index], ...updatedData };
                await fs.promises.writeFile(filePath, JSON.stringify(products, null, '\t'));
                Logger.info('Producto actualizado exitosamente');
                return { success: true, message: 'Producto actualizado exitosamente' };
            } else {
                Logger.warn('Producto no encontrado para actualización');
                return { success: false, message: 'Producto no encontrado' };
            }
        } catch (error) {
            Logger.error('Error al actualizar el producto:', error);
            throw error;
        }
    }
}
