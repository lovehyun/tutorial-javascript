const express = require('express');
const nunjucks = require('nunjucks');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Nunjucks 설정
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const searchName = req.query.name || '';
  const itemsPerPage = 10;
  const data = [];

  fs.createReadStream('data.csv', 'utf-8')
    .pipe(csv())
    .on('data', (row) => {
      if (!row.Name.includes(searchName)) {
        return; // 검색어가 포함되어 있지 않으면 생략
      }
      data.push(row);
    })
    .on('end', () => {
      const fieldnames = Object.keys(data[0] || {});
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);

      res.render('index4.html', {
        fieldnames,
        data: paginatedData,
        search_name: searchName,
        page,
        total_pages: totalPages,
      });
    })
    .on('error', (error) => {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user = findUserById(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  res.render('user_detail3.html', { user });
});

function findUserById(userId) {
  const data = fs.readFileSync('data.csv', 'utf-8');
  const rows = data.split('\n');
  const headers = rows[0].split(',');

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(',');
    const row = {};

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j].trim();
    }

    if (row['Id'] === userId) {
      return row;
    }
  }

  return null;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
