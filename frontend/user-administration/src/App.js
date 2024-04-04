import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserAdministration from './components/UserAdministration';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/admin/users" component={UserAdministration} />
          <Route path="/" exact component={ProductList} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={ShoppingCart} />
          <Route path="/checkout" component={Checkout} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
