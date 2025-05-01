var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); 

const prisma = new PrismaClient();
const dotenv = require('dotenv'); 
const jwt = require('jsonwebtoken');
const { findUserById,
    createUser,
    updateUserById,
    deleteUserById,
    closePrisma,
    findUserByEmail } = require('./user.repository')
const { createUserService, loginUserService,editUserByIdService } = require('./user.service')
const {createMerchantService} = require('../merchant/merchant.service')


dotenv.config();

router.post('/register1', async (req, res) => {
    const { username, email, password, name} = req.body;

    console.log('ini password'+ password)
    const hashedPassword = await bcrypt.hash(password, 10);
console.log('ini hash '+ hashedPassword)

    console.log('Received data:', { username, email, password });

    // Validasi input
    if (!username || !email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Cek apakah email sudah terdaftar
        const existingUser = await findUserByEmail(email)

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }



        // Simpan user baru ke database
        const user = await createUserService(username, email, hashedPassword, name);
        const user_id = user.id;

        // Validasi input
        if (!user_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const merchant = await createMerchantService(user_id, name)



        // Kirim respon berhasil
        res.status(201).json({ message: 'User registered successfully', user, merchant});
    } catch (error) {
        console.error(error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Error registering user' });
    }
});


router.post('/login1', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password harus diisi' });
    }

    try {
        const { token, user } = await loginUserService(email, password);

        res.status(200).json({ message: 'Login berhasil', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.patch('/user/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const user = req.body;

        const userRes = await editUserByIdService(userId,user);

        res.status.json({
            data: userRes,
            message: 'Edit berhasil',
        });
    }catch (error){
        res.status(400).send(error.message);
    }
})


module.exports = router;
