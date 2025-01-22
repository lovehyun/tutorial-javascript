// import users from './user';
import { User, users } from './user';

function addUser(name: string, email: string): void {
    const newUser: User = { id: Date.now(), name, email };
    users.push(newUser);
    console.log('User added:', newUser);
}

function listUsers(): void {
    console.log('Current users:', users);
}

// function listUsers2(): User[] {
//     console.log('Current users:', users);
//     return users;
// }

addUser('Alice', 'alice@example.com');
addUser('Bob', 'bob@example.com');
listUsers();

// const userList = listUsers2();
// console.log('User List:', userList);
