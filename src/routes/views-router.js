import { Router } from 'express'
import ProductManager from "../manager/ProductManager.js";

const router = Router();
const intance = new ProductManager()

router.get('/index', async (req, res) => {
    const data = await intance.getProducts()
    res.render('index', {
        product: data
    })
});

router.get('/products-realtime', async (req, res) => {
    res.render('products-realtime')
});

router.get('/products-static', async (req, res) => {
    res.render('products-static')
});

export default router;