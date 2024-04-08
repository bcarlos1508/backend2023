
import React from 'react';
import { Link } from 'react-router-dom';

function ShoppingCart({ cartItems, removeFromCart }) {
  return (
    <div>
      <h1>Carrito de compra</h1>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.title} - {item.quantity} <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <Link to="/checkout">Pasar por caja</Link>
    </div>
  );
}

export default ShoppingCart;
