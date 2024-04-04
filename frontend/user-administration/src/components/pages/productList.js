import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService.js';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const fetchedProducts = await fetchProducts();
            setProducts(fetchedProducts);
        };

        loadProducts();
    }, []);

    return (
        <div>
            <h2>Products Available</h2>
            <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`}>{product.title}</Link>
          </li>
        ))}
      </ul>
        </div>
    );
};

export default ProductList;
