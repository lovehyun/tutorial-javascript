const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('public'));

app.set('view engine', 'html');

nunjucks.configure('app/views', {
    autoescape: true,
    express: app,
});

// Set up your routes
const userRoutes = require('./app/routes/user');
const orderRoutes = require('./app/routes/order');
const orderitemRoutes = require('./app/routes/orderitem');
const itemRoutes = require('./app/routes/item');
const storeRoutes = require('./app/routes/store');
const kioskRoutes = require('./app/routes/kiosk');

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/orderitems', orderitemRoutes);
app.use('/items', itemRoutes);
app.use('/stores', storeRoutes);
app.use('/kiosk', kioskRoutes);

app.get('/', (req, res) => {
    res.redirect('/users');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
