
import express from 'express';
import productController from '../controllers/productController.js';
import authorize from '../middleware/authorization.js';
import MailService from '../services/mailService.js';

const router = express.Router();

router.get('/', productController.getAllProducts);

router.delete('/:id', authorize(['admin']), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        const user = await User.findById(product.owner);
        if (user.role === 'premium') {
            await MailService.sendMail(
                user.email,
                'Producto eliminado',
                `Su producto Premium (${product.title}) ha sido eliminado.`
            );
        }

        await deleteProduct(req, res);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del Servidor' });
    }
});

export default router;
