import { Router } from 'express';
import { CartManager } from '../manager/cart-manager.js';
const router = Router();
const cartManager = new CartManager;

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.status(200).json(carts)
    } catch (err) {
        res.status(404).json({ message: err.message })
        console.log(err)
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartFound = await cartManager.getCartById(Number(cid))
        if (cartFound) {
            res.status(200).json({ message: `(i) Cart with specified ID (${cid}) found successfully!`, cart: cartFound })
        } else {
            res.status(404).json({ message: `(!) Could not find cart with specified ID (ID: ${Number(cid)}).` })
        }
    } catch (err) {
        res.status(404).json({ message: err.message })
        console.log(err)
    }
})

router.post('/', async (req, res) => {
    try {
        await cartManager.createCart();
        res.status(200).json({ message: '(i) Cart created successfully!' })
    } catch (err) {
        res.status(404).json({ message: err.message })
        console.log(err)
    }
})

router.put('/:cid/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const result = await cartManager.addToCart(Number(cid), Number(pid))
        const updatedCart = await cartManager.getCartById(Number(cid))
        if (result === 'cart_404'){
            res.status(404).json({message: `(!) Could not find cart with specified ID (ID: ${cid})`})
        } else if (result === 'prod_404') {
            res.status(404).json({message: `(!) Could not find product with specified ID (ID: ${pid})`})
        } else {
            res.status(200).json({ message: `(i) Product with specified ID (${pid}) added to cart with specified ID (${cid}) successfully!`, cart: updatedCart })
        }
    } catch (err) {
        res.status(404).json({ message: err.message })
        console.log(err)
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartFound = await cartManager.getCartById(Number(cid))
        if (cartFound) {
            res.status(200).json({ message: `(i) Cart deleted successfully (ID: ${Number(cid)}). ` })
            await cartManager.removeCart(Number(cid))
        }
    } catch (err) {
        res.status(404).json({ message: err.message })
        console.log(err)
    }
})

router.delete('/', async (req, res) => {
    try {
        await cartManager.removeAllCarts();
        res.status(200).json({ message: "(i) All carts deleted successfully." })
    } catch (err) {
        res.status(404).json({ message: err.message })
        console.log(err)
    }
})

export default router