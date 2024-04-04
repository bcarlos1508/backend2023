
import React from 'react';
import { Link } from 'react-router-dom';

function ShoppingCart({ cartItems, removeFromCart }) {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.title} - {item.quantity} <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
}

export default ShoppingCart;
