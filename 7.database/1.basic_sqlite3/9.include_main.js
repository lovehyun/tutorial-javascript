const Database = require('./9.include_db');

async function main() {
    const db = new Database('mydatabase.db');

    try {
        await db.createTable();
        const allUsers = await db.getAllUsers();
        console.log('All Users:', allUsers);

        const userId = 1;
        const userById = await db.getUserById(userId);
        console.log('User with ID', userId, ':', userById);

        const newUser = {
            username: 'user1',
            email: 'user1@example.com',
        };
        const newUserId = await db.insertUser(newUser);
        console.log('User added with ID:', newUserId);

        const updateUserDetails = {
            id: 1,
            username: 'user001',
            email: 'user001@example.com',
        };
        await db.updateUser(updateUserDetails);
        console.log('User updated successfully');

        const deleteUserDetails = {
            id: 2,
        };
        await db.deleteUser(deleteUserDetails.id);
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        db.close();
    }
}

main();
