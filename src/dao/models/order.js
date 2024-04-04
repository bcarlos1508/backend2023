
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{ 
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
