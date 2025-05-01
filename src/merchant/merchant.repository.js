const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createMerchant = async ({user_id, name}) => {
    const merchant = await prisma.merchant.create({
        data: {
            user_id,
            name,
        },
    });
    return merchant;
}




module.exports = {createMerchant }