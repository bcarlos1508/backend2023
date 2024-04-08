import Product from '../dao/models/product.js';
import ShoppingCart from '../dao/models/ShoppingCart.js';
import Logger from '../utils/logger.js';
import { errorDictionary, errorHandler } from '../utils/errorHandler.js';

export const addToCart = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            Logger.error(`Producto no encontrado con el ID: ${productId}`);
            errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
            return;
        }

        if (product.owner === req.user.email) {
            Logger.error('El usuario Premium no puede agregar su propio producto al carrito.');
            errorHandler(errorDictionary.UNAUTHORIZED_ACCESS, res);
            return;
        }

        let cart = await ShoppingCart.findOne({ userId });

        if (!cart) {
            cart = new ShoppingCart({
                userId,
                products: [],
            });
        }

        const existingProduct = cart.products.find((cartProduct) => cartProduct._id.equals(productId));

        if (existingProduct) {
            Logger.error('El producto ya existe en el carrito');
            errorHandler(errorDictionary.PRODUCT_ALREADY_IN_CART, res);
            return;
        }

        cart.products.push(product);
        await cart.save();

        Logger.info(`Producto agregado en el carrito: ${product.title}`);
        res.status(200).json({ status: 'success', message: 'Producto agregado en el carrito', payload: cart });
    } catch (error) {
        Logger.error(`Error añadiento el producto al carrito: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await ShoppingCart.findById(cartId).populate('products');

        if (!cart) {
            Logger.error(`Carrito no encontrado con ID: ${cartId}`);
            errorHandler(errorDictionary.CART_NOT_FOUND, res);
            return;
        }

        const ticketProducts = [];

        for (const cartProduct of cart.products) {
            const product = await Product.findById(cartProduct._id);

            if (!product) {
                Logger.error(`Producto no encontrado con ID: ${cartProduct._id}`);
                errorHandler(errorDictionary.PRODUCT_NOT_FOUND, res);
                return;
            }

            if (product.stock >= cartProduct.quantity) {
                product.stock -= cartProduct.quantity;
                await product.save();

                ticketProducts.push({
                    product: product.title,
                    quantity: cartProduct.quantity,
                    price: product.price,
                });
            } else {
                Logger.error(`Stock insuficiente para el producto: ${product.title}`);
                errorHandler(errorDictionary.INSUFFICIENT_STOCK, res);
                return;
            }
        }

        const totalAmount = calculateTotalAmount(ticketProducts);

        if (cart.products.some((cartProduct) => cartProduct.owner !== req.user.email)) {
            Logger.error('El usuario Premium no puede adquirir productos que no le pertenecen');
            errorHandler(errorDictionary.UNAUTHORIZED_ACCESS, res);
            return;
        }

        const ticketService = new TicketService();

        const ticketResult = await ticketService.createTicket({
            amount: totalAmount,
            purchaser: req.user.email,
            products: ticketProducts,
        });

        await ShoppingCart.findByIdAndUpdate(cartId, { $pull: { products: { $in: cart.products } } });

        Logger.info(`Compra completada exitosamente: ${ticketResult}`);
        return res.status(200).json({
            status: 'success',
            message: 'Compra completada exitosamente',
            ticket: ticketResult,
        });
    } catch (error) {
        Logger.error(`Error al procesar la compra: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
        return;
    }
};

function calculateTotalAmount(products) {
    return products.reduce((total, product) => total + product.quantity * product.price, 0);
}

export const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
