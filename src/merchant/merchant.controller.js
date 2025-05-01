var express = require('express');
var router = express.Router();
const { verifyToken } = require('../../auth/service'); // Mengimpor middleware verifyToken

const {createMerchantService} = require('./merchant.service')



router.post('/merchant', verifyToken, async (req, res) => {


    let { user_id, name } = req.body;
     user_id = parseInt(user_id, 10);
console.log(name);
    try {
        const merchant = await createMerchantService(user_id, name);
        res.send(merchant);
    }catch (error) {
        res.send(error.message);
    }
});

module.exports = router;
