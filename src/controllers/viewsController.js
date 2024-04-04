import ShoppingCart from '../dao/models/ShoppingCart.js';
import userModel from '../dao/models/users.js';
import Logger from '../utils/logger.js';

export const renderRegisterView = (req, res) => {
    res.render('register');
};

export const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password
        });

        await newUser.save();
        Logger.info('User registered successfully');
        res.redirect('/');

    } catch (error) {
        Logger.error('Error while registering user', error);
        res.status(500).send('Error al registrar el usuario');
    }
};

export const renderUsersView = async (req, res) => {
    try {
        const users = await userModel.find();
        Logger.info('All users retrieved successfully');
        res.render('users', { users });
    } catch (error) {
        Logger.error('Error while getting users', error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

export const renderCartView = async (req, res) => {
    try {
        const userId = req.userId;

        const cart = await ShoppingCart.findOne({ userId }).populate('products');
        if (!cart) {
            Logger.error('Cart not found');
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        Logger.info('Cart loaded successfully');
        res.status(200).render('cart', { cartProducts: cart.products });
    } catch (error) {
        Logger.error('Error at loading the cart', error);
        res.status(500).send('Error at loading the cart');
    }
};
