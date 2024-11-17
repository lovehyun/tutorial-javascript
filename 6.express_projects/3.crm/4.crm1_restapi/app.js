const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json()); // JSON 요청 처리
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 처리

// Set up your REST API routes
const userRoutes = require('./app/routes/user');
const orderRoutes = require('./app/routes/order');
const orderitemRoutes = require('./app/routes/orderitem');
const itemRoutes = require('./app/routes/item');
const storeRoutes = require('./app/routes/store');

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orderitems', orderitemRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/stores', storeRoutes);

// Serve the main HTML file
app.get('/users', (req, res) => {
    res.sendFile(path.resolve('public/users.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.resolve('public/orders.html'));
});

app.get('/orderitems', (req, res) => {
    res.sendFile(path.resolve('public/orderitems.html'));
});

app.get('/items', (req, res) => {
    res.sendFile(path.resolve('public/items.html'));
});

app.get('/stores', (req, res) => {
    res.sendFile(path.resolve('public/stores.html'));
});

app.get('/', (req, res) => {
    res.redirect('/users');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
