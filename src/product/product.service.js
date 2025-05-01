const { getProductsByUserId, createProduct, updateProduct } = require('../product/product.repository');

const getMerchantProducts = async (user_id) => {
    return await getProductsByUserId(user_id);
};

const addNewProduct = async (merchant_id, name, description, variations) => {
    try {
        const product = await createProduct(merchant_id, name, description, variations);
        return product;
    } catch (error) {
        console.error("Error adding new product:", error.message);
        throw new Error("Failed to add new product");
    }
};

const updateExistingProduct = async (product_id, name, description, variations) => {
    try {
        const product = await updateProduct(product_id, name, description, variations || []);
        return product;
    } catch (error) {
        console.error("Error updating existing product:", error.message);
        throw new Error("Failed to update product");
    }
};

module.exports = { getMerchantProducts, addNewProduct, updateExistingProduct, };