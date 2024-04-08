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
        Logger.info('Usuario registrado exitosamente');
        res.redirect('/');

    } catch (error) {
        Logger.error('Error al registrar usuario', error);
        res.status(500).send('Error al registrar el usuario');
    }
};

export const renderUsersView = async (req, res) => {
    try {
        const users = await userModel.find();
        Logger.info('Todos los usuarios recuperados exitosamente');
        res.render('users', { users });
    } catch (error) {
        Logger.error('Error al obtener los usuarios', error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

export const renderCartView = async (req, res) => {
    try {
        const userId = req.userId;

        const cart = await ShoppingCart.findOne({ userId }).populate('products');
        if (!cart) {
            Logger.error('Carrito no encontrado');
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        Logger.info('Carro cargado exitosamente');
        res.status(200).render('cart', { cartProducts: cart.products });
    } catch (error) {
        Logger.error('Error al cargar el carrito', error);
        res.status(500).send('Error al cargar el carrito');
    }
};
