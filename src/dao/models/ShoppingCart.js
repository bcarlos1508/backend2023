import mongoose from 'mongoose';

const shoppingCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' 
    }]
});

const ShoppingCart = mongoose.model('ShoppingCart', shoppingCartSchema);

export default ShoppingCart;
