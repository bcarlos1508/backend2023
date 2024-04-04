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
        Logger.error(`Error getting all products: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            Logger.error('Incomplete data provided for creating product');
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
        Logger.info(`Product added successfully: ${newProduct}`);
        res.status(201).json({ status: 'success', message: 'Product added successfully', payload: newProduct });
    } catch (error) {
        Logger.error(`Error creating product: ${error.message}`);
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
            Logger.error(`Product not found with ID: ${productId}`);
            errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
            return;
        }

        if (product.owner !== req.user.email) {
            Logger.warning('Unauthorized access to update product');
            errorHandler(errorDictionary.UNAUTHORIZED_ACCESS, res);
            return;
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        Logger.info(`Product updated successfully: ${product}`);
        res.status(200).json({ status: 'success', message: 'Product updated successfully', payload: product });
    } catch (error) {
        Logger.error(`Error updating product: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            Logger.error(`Product not found with ID: ${productId}`);
            errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
            return;
        }
        const owner = await User.findOne({ email: product.owner });

        if (!owner) {
            Logger.error(`Owner not found for the product with ID: ${productId}`);
            errorHandler(errorDictionary.OWNER_NOT_FOUND, res);
            return;
        }

        if (owner.isPremium) {
            await mailService.sendMail(owner.email, "Product Deleted", "Your product has been deleted.");
        }

        await product.remove();
        Logger.info(`Product deleted successfully: ${product}`);
        res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        Logger.error(`Error deleting product: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};
