const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'user' && password === 'pass') {
        req.flash('success', 'Login successful!');
    } else {
        req.flash('error', 'Login failed. Please check your username and password.');
    }

    res.redirect('/');
});

app.get('/', (req, res) => {
    const successMessages = req.flash('success');
    const errorMessages = req.flash('error');

    res.render('index', { successMessages, errorMessages });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
