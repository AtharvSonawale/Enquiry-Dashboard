// backend/server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '1234', // replace with your MySQL password
  database: 'excel_data',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.post('/api/data', (req, res) => {
  const { headers, data } = req.body;

  const sql = `INSERT INTO data (${headers.join(', ')}) VALUES ?`;
  const values = data.map(row => row.map(cell => cell || null)); // Handle empty cells

  db.query(sql, [values], (error, results) => {
    if (error ) {
      console.error('Error inserting data:', error);
      return res.status(500).send('Error inserting data');
    }
    res.status(200).send('Data inserted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});