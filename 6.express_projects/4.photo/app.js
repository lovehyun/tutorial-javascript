// npm install express nunjucks

const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'html');

nunjucks.configure('views', {
    autoescape: true,
    express: app,
}).addFilter('formatPostDate', function(date) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(date).toLocaleDateString('ko-KR', options); // 또는 en-US
});

let posts = [];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/write', (req, res) => {
    res.render('write');
});

app.post('/write', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const date = new Date();

    posts.push({ title, content, date });

    res.redirect('/');
});

app.post('/delete/:index', (req, res) => {
    const index = req.params.index - 1; // 배열 인덱스에 맞게 변환
    if (index >= 0 && index < posts.length) {
        posts.splice(index, 1);
    }
    
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
