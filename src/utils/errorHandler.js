import Logger from './logger.js';

export const errorDictionary = {
    INCOMPLETE_DATA: "Datos incompletos, cargue todos los campos obligatorios",
    PRODUCT_NOT_FOUND: "Producto no encontrado.",
    CART_NOT_FOUND: "Carrito no encontrado.",
    INSUFFICIENT_STOCK: "Stock insuficiente.",
    INTERNAL_SERVER_ERROR: "Error interno del servidor.",
};

export const errorHandler = (errorKey, res) => {
    const errorMessage = errorDictionary[errorKey] || errorDictionary.INTERNAL_SERVER_ERROR;
    res.status(400).json({ status: 'error', message: errorMessage });

    Logger.error(`Error: ${errorMessage}`);
};
