const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const findUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        console.error('Error finding user by ID:', error.message);
    }
};

const findUserByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Error finding user by ID:', error.message);
    }
};

const createUser = async ({ username, email, password }) => {
    try {

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password,
            },
        });
        return user;
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack trace:', error.stack);
    }
};

const updateUserById = async (id, user) => {
    try {
        const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : undefined;

        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                username: user.username,
                email: user.email,
                password: hashedPassword,
            },
        });
        return updateUser;
    } catch (error) {
        console.error('Error updating user:', error.message);
        throw new Error('Failed to update user');
    }
};

const deleteUserById = async (id) => {
    try {
        const user = await prisma.user.delete({
            where: { id },
        });
        return user;
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

const closePrisma = async () => {
    await prisma.$disconnect();
};

module.exports = {
    findUserById,
    createUser,
    updateUserById,
    deleteUserById,
    closePrisma,
    findUserByEmail
};
