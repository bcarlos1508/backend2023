import Product from '../dao/models/product.js';
import Logger from '../utils/logger.js';
import { errorDictionary, errorHandler } from '../utils/errorHandler.js';
import mailService from '../services/mailService.js';
import User from '../dao/models/users.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        Logger.error(`Error al obtener todos los productos: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            Logger.error('Datos incompletos proporcionados para crear el producto.');
            errorHandler(errorDictionary.INCOMPLETE_DATA, res);
            return;
        }

        const newProduct = new Product({
            title,
            description,
            price,
            owner: req.user.email,
        });

        await newProduct.save();
        Logger.info(`Producto agregado exitosamente: ${newProduct}`);
        res.status(201).json({ status: 'success', message: 'Producto agregado exitosamente', payload: newProduct });
    } catch (error) {
        Logger.error(`Error al crear el producto: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, description, price } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            Logger.error(`Producto no encontrado con ID: ${productId}`);
            errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
            return;
        }

        if (product.owner !== req.user.email) {
            Logger.warning('Acceso no autorizado para actualizar el producto');
            errorHandler(errorDictionary.UNAUTHORIZED_ACCESS, res);
            return;
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        Logger.info(`Producto actualizado exitosamente: ${product}`);
        res.status(200).json({ status: 'success', message: 'Producto actualizado exitosamente', payload: product });
    } catch (error) {
        Logger.error(`Error al actualizar el producto: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            Logger.error(`Producto no encontrado con ID: ${productId}`);
            errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
            return;
        }
        const owner = await User.findOne({ email: product.owner });

        if (!owner) {
            Logger.error(`Propietario no encontrado para el producto con ID: ${productId}`);
            errorHandler(errorDictionary.OWNER_NOT_FOUND, res);
            return;
        }

        if (owner.isPremium) {
            await mailService.sendMail(owner.email, "Producto eliminado", "Su producto ha sido eliminado.");
        }

        await product.remove();
        Logger.info(`Producto eliminado exitosamente: ${product}`);
        res.status(200).json({ status: 'success', message: 'Producto eliminado exitosamente' });
    } catch (error) {
        Logger.error(`Error al eliminar el producto: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};
