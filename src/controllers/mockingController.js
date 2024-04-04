import Logger from '../utils/logger.js';

const generateMockProducts = () => {
    try {
        const mockProducts = [];
        for (let i = 1; i <= 100; i++) {
            const product = {
                _id: `mock_product_${i}`,
                title: `Mock Product ${i}`,
                description: `Description for Mock Product ${i}`,
                price: Math.random() * 100,
                stock: Math.floor(Math.random() * 50) + 1,
            };
            mockProducts.push(product);
        }
        Logger.debug('Generated mock products successfully');
        return mockProducts;
    } catch (error) {
        Logger.error(`Error generating mock products: ${error.message}`);
        return [];
    }
};

export default generateMockProducts;
