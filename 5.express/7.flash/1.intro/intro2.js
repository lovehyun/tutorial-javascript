// curl http://localhost:3000/login -X POST -d username=user -d password=pass --cookie-jar cookie.txt
// curl http://localhost:3000/ --cookie cookie.txt

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash'); // 별도 설치는 불필요 (express-session 과 함께 동작)
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

    res.json({ successMessages, errorMessages });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
