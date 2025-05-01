
const {createMerchant } = require('./merchant.repository')


const createMerchantService = async (user_id, name) => {
    try {
        const merchant = await createMerchant({user_id, name})
        return merchant;
    }catch (error) {
        throw new Error(error.message);

    }
}



module.exports = {createMerchantService};