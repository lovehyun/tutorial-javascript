const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();

const messages = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/messages', (req, res) => {
    const { userId, message, timestamp, fromAdmin } = req.body;
    if (message) {
        messages.push({ id: messages.length + 1, userId, text: message, timestamp, fromAdmin: fromAdmin || false });
        res.status(201).send({ status: 'Message received' });
    } else {
        res.status(400).send({ status: 'Invalid message' });
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin', 'admin.html'));
});

app.get('/api/admin/messages', (req, res) => {
    res.json(messages);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
