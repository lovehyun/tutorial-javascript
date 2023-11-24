const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const mainRoutes = require('./src/routes/mainRoutes');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

// 정적 파일 제공
app.use(express.static('public'));

// 라우트 연결
app.use('/', mainRoutes);
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
