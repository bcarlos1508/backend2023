import Logger from '../utils/logger.js';

const generateMockProducts = () => {
    try {
        const mockProducts = [];
        for (let i = 1; i <= 100; i++) {
            const product = {
                _id: `mock_product_${i}`,
                title: `Producto Simulado ${i}`,
                description: `Descripcion del Producto Simulado ${i}`,
                price: Math.random() * 100,
                stock: Math.floor(Math.random() * 50) + 1,
            };
            mockProducts.push(product);
        }
        Logger.debug('Productos simulados generados con éxito');
        return mockProducts;
    } catch (error) {
        Logger.error(`Error al generar productos simulados: ${error.message}`);
        return [];
    }
};

export default generateMockProducts;
