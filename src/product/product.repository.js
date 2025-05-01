const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProductsByUserId = async (user_id) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                merchant: {
                    user_id: user_id, // Menyaring berdasarkan user_id yang ada di tabel merchants
                },
            },
            include: {
                merchant: {
                    select: {
                        name: true,
                        user_id: true,
                    },
                },
                variations: {
                    include: {
                        stock: {
                            select: {
                                sku: true,
                                stock_quantity: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                id: 'asc', // Urutkan berdasarkan product_id
            },
        });

        return products;
    } catch (error) {
        console.error("Error retrieving products:", error.message);
        throw new Error('Failed to retrieve products');
    }
};

const createProduct = async (merchant_id, name, description, variations = []) => {
    const productData = {
        merchant_id,
        name,
        description,
    };

    try {
        // Menambahkan produk baru
        const product = await prisma.product.create({
            data: productData,
        });

        // Jika ada variasi, tambahkan variasi dan stoknya
        if (variations.length > 0) {
            const variationPromises = variations.map(async (variation) => {
                // Menambahkan variasi untuk produk baru
                const variationData = {
                    product_id: product.id,
                    color: variation.color,
                    size: variation.size,
                };

                const newVariation = await prisma.variation.create({
                    data: variationData,
                });

                // Menambahkan stok untuk variasi jika SKU dan kuantitas diberikan
                if (variation.sku && variation.stock_quantity) {
                    const stockData = {
                        variation_id: newVariation.id,
                        sku: variation.sku,
                        stock_quantity: variation.stock_quantity,
                    };

                    await prisma.stock.create({
                        data: stockData,
                    });
                }

                return newVariation;
            });

            // Tunggu sampai semua variasi dan stok ditambahkan
            await Promise.all(variationPromises);
        }

        return product;
    } catch (error) {
        console.error("Error creating product:", error.message);
        throw new Error("Failed to create product");
    }
};

// Fungsi untuk mengupdate produk dan variasi
const updateProduct = async (product_id, name, description, variations = []) => {
    try {
        // Mengupdate data produk
        const product = await prisma.product.update({
            where: { id: product_id },
            data: {
                name,
                description,
            },
        });

        // Mengupdate variasi yang ada, jika ada variasi baru
        const variationPromises = variations.map(async (variation) => {
            const existingVariation = await prisma.variation.findUnique({
                where: {
                    product_id_color_size: {
                        product_id: product.id,
                        color: variation.color,
                        size: variation.size,
                    },
                },
            });

            // Memperbarui variasi jika sudah ada
            if (existingVariation) {
                await prisma.variation.update({
                    where: { id: existingVariation.id },
                    data: {
                        color: variation.color,
                        size: variation.size,
                    },
                });

                // Mengupdate stok untuk variasi yang sudah ada
                await prisma.stock.updateMany({
                    where: {
                        variation_id: existingVariation.id,
                    },
                    data: {
                        stock_quantity: variation.stock_quantity, // Memperbarui stock quantity
                    },
                });
            }

            return existingVariation;
        });

        // Tunggu sampai semua variasi dan stok diperbarui
        await Promise.all(variationPromises);

        return product;
    } catch (error) {
        console.error("Error updating product:", error.message);
        throw new Error("Failed to update product");
    }
};

module.exports = { getProductsByUserId, createProduct, updateProduct, };
