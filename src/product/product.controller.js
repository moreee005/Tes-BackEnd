
const express = require('express');
const router = express.Router();
const { getMerchantProducts, addNewProduct, updateExistingProduct } = require('../product/product.service');
const { verifyToken } = require('../../auth/service'); // Mengimpor middleware verifyToken

router.get('/products/:user_id',verifyToken, async (req, res) => {
    const user_id = parseInt(req.params.user_id, 10);

    if (isNaN(user_id)) {
        return res.status(400).json({ message: 'Invalid user_id, must be an integer' });
    }

    try {
        const products = await getMerchantProducts(user_id);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
});

router.post('/product',verifyToken, async (req, res) => {
    const { merchant_id, name, description, variations } = req.body;

    if (!merchant_id || !name || !description) {
        return res.status(400).json({ message: 'Merchant ID, Name, and Description are required' });
    }

    try {
        const product = await addNewProduct(merchant_id, name, description, variations || []);
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error("Error message:", error.message);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});

router.patch('/product/:id',verifyToken, async (req, res) => {
    const product_id = parseInt(req.params.id, 10);
    const { name, description, variations } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and Description are required' });
    }

    try {
        const updatedProduct = await updateExistingProduct(product_id, name, description, variations || []);
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error("Error message:", error.message);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

module.exports = router;
