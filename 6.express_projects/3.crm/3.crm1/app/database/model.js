const sqlite3 = require('sqlite3').verbose();

// SQLite database path
const dbPath = 'app/database/user-sample.sqlite';

class Model {
    constructor(tableName) {
        this.tableName = tableName;
    }

    createQuery(query, params = []) {
        const db = new sqlite3.Database(dbPath);
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Run Query:', query);
                    resolve();
                }

                db.close();
            });
        });
    }

    runQuery(query, params = []) {
        const db = new sqlite3.Database(dbPath);
        return new Promise((resolve, reject) => {
            db.run(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Run Query:', query);
                    // console.log('Result:', row);
                    resolve(row);
                }

                db.close();
            });
        });
    }

    getQuery(query, params = []) {
        const db = new sqlite3.Database(dbPath);
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Get Query:', query);
                    console.log('Result:', row);
                    resolve(row);
                }

                db.close();
            });
        });
    }

    getAllQuery(query, params = []) {
        const db = new sqlite3.Database(dbPath);
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('All Query:', query);
                    // console.log('Result:', rows);
                    resolve(rows);
                }

                db.close();
            });
        });
    }

    executeQuery(query, params = []) {
        const trimmedQuery = query.trim();

        if (trimmedQuery.startsWith('CREATE TABLE')) {
            return this.createQuery(query, params);
        } else if (trimmedQuery.startsWith('SELECT COUNT')) {
            return this.getQuery(query, params);
        } else if (trimmedQuery.startsWith('SELECT')) {
            return this.getAllQuery(query, params);
        } else if (trimmedQuery.startsWith('INSERT INTO')) {
            return this.runQuery(query, params);
        } else if (trimmedQuery.startsWith('UPDATE')) {
            return this.runQuery(query, params);
        } else if (trimmedQuery.startsWith('DELETE')) {
            return this.runQuery(query, params);
        } else {
            return Promise.reject(new Error('Unsupported query type'));
        }
    }
}

const tableUser = 'users';
const tableStore = 'stores';
const tableItem = 'items';
const tableOrder = 'orders';
const tableOrderItem = 'order_items';

class User extends Model {
    constructor() {
        super(tableUser);
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            gender TEXT,
            age INTEGER,
            birthdate TEXT,
            address TEXT
        );
        `;
        return this.executeQuery(query);
    }
}

class Store extends Model {
    constructor() {
        super(tableStore);
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS stores (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            address TEXT
        );
        `;
        return this.executeQuery(query);
    }
}

class Item extends Model {
    constructor() {
        super(tableItem);
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            unitprice TEXT
        );
        `;
        return this.executeQuery(query);
    }
}

class Order extends Model {
    constructor() {
        super(tableOrder);
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            orderat TEXT,
            storeid TEXT,
            userid TEXT,
            FOREIGN KEY (storeid) REFERENCES stores (id),
            FOREIGN KEY (userid) REFERENCES users (id)
        );
        `;
        return this.executeQuery(query);
    }
}

class OrderItem extends Model {
    constructor() {
        super(tableOrderItem);
    }

    create() {
        const query = `
        CREATE TABLE IF NOT EXISTS order_items (
            id TEXT PRIMARY KEY,
            orderid TEXT,
            itemid TEXT,
            FOREIGN KEY (orderid) REFERENCES orders (id),
            FOREIGN KEY (itemid) REFERENCES items (id)
        );
        `;
        return this.executeQuery(query);
    }
}

// Create tables if they don't exist
const userModel = new User();
userModel.create()
    .then(() => {
        const storeModel = new Store();
        return storeModel.create();
    })
    .then(() => {
        const itemModel = new Item();
        return itemModel.create();
    })
    .then(() => {
        const orderModel = new Order();
        return orderModel.create();
    })
    .then(() => {
        const orderItemModel = new OrderItem();
        return orderItemModel.create();
    })
    .catch((error) => {
        console.error(error);
    });

// Export the User class
module.exports = { User, Store, Order, Item, OrderItem };
