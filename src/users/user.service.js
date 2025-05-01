
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
    findUserByEmail} = require('./user.repository')
const {createMerchant } = require('../merchant/merchant.repository')

dotenv.config();


const createUserService = async (username, email, hashedPassword, name) => {

    try {

        const user = await createUser({username,email,password: hashedPassword});

        console.log(user.id, name)
        const merchant = await createMerchant({user_id: user.id, name })

        return user;
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack trace:', error.stack);
    }

}

const loginUserService = async (email, password) => {
    try {
        const user = await findUserByEmail(email)

        if (!user) {
            throw new Error('Pengguna tidak ditemukan');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Password tidak valid');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        return { token, user };
    } catch (error) {
        throw new Error('Gagal login: ' + error.message);
    }
};

const editUserByIdService = async (id, user) => {
    const users = await updateUserById(id,user)
    return users;
}



module.exports = {
    createUserService,
    loginUserService,
    editUserByIdService,};
