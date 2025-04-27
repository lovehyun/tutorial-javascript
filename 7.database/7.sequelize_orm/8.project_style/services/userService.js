const { sequelize, User, Post } = require('../models');

async function createUserWithPosts(userData, postsData) {
    const transaction = await sequelize.transaction();
    try {
        const user = await User.create(userData, { transaction });

        for (const post of postsData) {
            await Post.create({ ...post, userId: user.id }, { transaction });
        }

        await transaction.commit();
        return user;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function getUserWithPosts(name) {
    return await User.findOne({
        where: { name },
        include: Post,
    });
}

module.exports = {
    createUserWithPosts,
    getUserWithPosts,
};
