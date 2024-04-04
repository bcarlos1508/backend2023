import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import Logger from './utils/logger.js';
import config from './config/config.js';
import initializePassport from './config/passport.config.js';
import viewRouter from './routes/views.router.js';
import cartRouter from './routes/cart.router.js';
import usersRouter from './routes/users.router.js';
import sessionRouter from './routes/session.router.js';
import mockingRouter from './routes/mockingRoutes.js';
import orderRouter from './routes/order.routes.js';
import productRouter from './routes/product.routes.js';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerSpec from './config/swaggerconfig.js';
import __dirname from './utils/utils.js';

const app = express();
dotenv.config();


const PORT = config.mongo.PORT;
const MONGODB_URI = config.mongo.URL;

mongoose.set('strictQuery', false);

//BD
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    Logger.info('Connected to the database');
  })
  .catch((error) => {
    Logger.error('Error connecting to the database:', error);
  });

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Passport
initializePassport();
app.use(passport.initialize());

//Middleware for cookies
app.use(cookieParser());

//Routes
app.use('/', viewRouter);
app.use('/api/cart', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/products', productRouter);
app.use('/', mockingRouter);
app.use('/api/orders', orderRouter);

//Global error
app.use((err, req, res, next) => {
  Logger.error('Global error handler:', err);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

// Swagger
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

//Server
const server = app.listen(PORT, () => {
  Logger.info(`Server running on port ${PORT}`);
});

export default server;
