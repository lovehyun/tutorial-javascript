const userService = require('../services/userService');

async function createSampleUser(req, res) {
    try {
        const user = await userService.createUserWithPosts(
            { name: 'Alice', email: 'alice@example.com', age: 25 },
            [
                { title: 'Alice의 첫 게시글', content: 'Hello world!' },
                { title: 'Alice의 두 번째 게시글', content: 'Sequelize ORM이 정말 편리해요!' }
            ]
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserInfo(req, res) {
    try {
        const user = await userService.getUserWithPosts(req.params.name);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createSampleUser,
    getUserInfo,
};
