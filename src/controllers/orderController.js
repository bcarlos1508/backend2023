
import Order from '../dao/models/order.js';

export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      items: req.body.items,
      user: req.user._id,
      address: req.body.address,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};
