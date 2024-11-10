// app/database/index.js
const User = require('./User');
const Store = require('./Store');
const Item = require('./Item');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

module.exports = { User, Store, Item, Order, OrderItem };
