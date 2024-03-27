import express from 'express';
import handlebars from 'express-handlebars';
import cartsRouter from './routes/carts-router.js';
import viewsRouter from './routes/views-router.js';
import productsRouter from './routes/products-router.js';
import { __dirname } from './path.js';
import { Server } from 'socket.io';
import  productManager  from "./manager/ProductManager.js";
import { webRouter } from './routes/web.router.js';
import {engine} from 'express-handlebars';
import mongoose from 'mongoose';
import userRouter from '../src/routes/users.router.js';
import studentModel from './models/student.js';
import enviroment from './public/js/index.js';


const ProductManager = new productManager();
const app=express();    
const port=8080;

app.set('engine', engine)
app.use('static', express.static('./static'))
app.use(express.static('./views'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', webRouter)

const http = app.listen(port, () => {
    try {
        console.log(`Puerto funcionando ok: ${port}`);
    } catch (err) {
        res.status(400).json({ message: err.message })
        console.log(err)
    }
})

const io = new Server(http)

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use('/views', viewsRouter)

let messages = [];

io.on('connection', async (socket) => {
    console.log('Usuario conectado (ID: ', socket.id, ')');
    socket.on('disconnect', () => {
        console.log('Usuario desconectado (ID:', socket.id, ')');
    })
    socket.on('message',data =>{
        messages.push(data)
        io.emit('messageLogs',messages)
    })
    socket.on('message', (message) => {
        console.log(message)
    })
    socket.emit('productsArray', await ProductManager.getProducts());
    
    socket.on('newProduct', async (prod) => {
        await ProductManager.createProduct(prod);
        const arrayUpdate = await ProductManager.getProducts();
        socket.emit('arrayUpdate', arrayUpdate);
        socket.on('update', (update) => {
            console.log(update);
        })
    })
})


const mongoURI = 'mongodb+srv://carlosbarrera:7y3h45jDXwxwvAEp@cluster0.l0gzu15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Conectado a MongoDB');
        enviroment();
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB:', error.message);
    });

app.use('/api/users',userRouter);
app.use(express.json());




