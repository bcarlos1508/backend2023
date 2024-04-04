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
                Logger.info('Products retrieved successfully');
                return JSON.parse(data);
            } else {
                Logger.info('No existing file found, returning an empty array');
                return [];
            }
        } catch (error) {
            Logger.error('Error while reading the file:', error);
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
            Logger.info('Product saved successfully');
            return newProduct;
        } catch (error) {
            Logger.error('Error while saving the product:', error);
            throw error;
        }
    }

    async delete(productId) {
        try {
            let products = await this.getAll();
            const updatedProducts = products.filter(product => product.id !== productId);

            await fs.promises.writeFile(filePath, JSON.stringify(updatedProducts, null, '\t'));
            Logger.info('Product deleted successfully');
            return { success: true, message: 'Product deleted successfully' };
        } catch (error) {
            Logger.error('Error while deleting the product:', error);
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
                Logger.info('Product updated successfully');
                return { success: true, message: 'Product updated successfully' };
            } else {
                Logger.warn('Product not found for update');
                return { success: false, message: 'Product not found' };
            }
        } catch (error) {
            Logger.error('Error while updating the product:', error);
            throw error;
        }
    }
}
