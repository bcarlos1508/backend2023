import TicketService from '../services/ticketService.js';
import ShoppingCart from '../models/ShoppingCart.js';
import Logger from '../utils/logger.js';
import { errorDictionary, errorHandler } from '../utils/errorHandler.js';

const ticketService = new TicketService();

export const createTicket = async (req, res) => {
    try {
        // Obtener el ID del usuario actualmente logueado
        const userId = req.user._id;

        // Buscar el carrito del usuario
        const cart = await ShoppingCart.findOne({ userId }).populate('products');

        // Verificar si el carrito está vacío
        if (!cart || cart.products.length === 0) {
            Logger.error('El carrito está vacío');
            errorHandler(errorDictionary.EMPTY_CART, res);
            return;
        }

        // Crear un nuevo ticket
        const ticketResult = await ticketService.createTicket({
            amount: calculateTotalAmount(cart.products),
            purchaser: req.user.email,
            products: cart.products,
        });

        // Vaciar el carrito
        cart.products = [];
        await cart.save();

        Logger.info('Compra completada exitosamente');
        res.status(201).json({ status: 'success', message: 'Compra completada exitosamente', ticket: ticketResult });
    } catch (error) {
        Logger.error(`Error al crear el ticket: ${error.message}`);
        errorHandler(errorDictionary.INTERNAL_SERVER_ERROR, res);
    }
};

function calculateTotalAmount(products) {
    return products.reduce((total, product) => total + product.price, 0);
}