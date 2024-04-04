
const BASE_URL = 'http://localhost:8080/api/products';

export const fetchProducts = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.payload;
    } catch (error) {
        console.error("There was a problem fetching the products:", error);
    }
};