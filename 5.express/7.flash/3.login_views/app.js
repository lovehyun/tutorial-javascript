const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const nunjucks = require('nunjucks');

const app = express();

// Express setup
// app.set('view engine', 'nunjucks');
app.set('view engine', 'html');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

// Flash setup
app.use(flash());

// Routes
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'user' && password === 'pass') {
        req.flash('success', 'Login successful!');
    } else {
        req.flash('error', 'Login failed. Please check your username and password.');
    }

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    const successMessages = req.flash('success');
    const errorMessages = req.flash('error');

    res.render('login', { successMessages, errorMessages });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
