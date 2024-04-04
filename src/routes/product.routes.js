
import express from 'express';
import { deleteProduct } from '../controllers/productController.js';
import authorize from '../middleware/authorization.js';
import MailService from '../services/mailService.js';

const router = express.Router();

router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        const user = await User.findById(product.owner);
        if (user.role === 'premium') {
            await MailService.sendMail(
                user.email,
                'Product Deleted',
                `Your premium product (${product.title}) has been deleted.`
            );
        }

        await deleteProduct(req, res);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

export default router;
