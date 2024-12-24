// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost', // or 'localhost'
    port: 3306, // default MySQL port
    user: 'root',
    password: '1234',
    database: 'EnqDash',
  });

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API endpoint to handle data submission
app.post('/api/upload-data', (req, res) => {
  const data = req.body.data; // Get the data from the request

  // Prepare SQL query
  const sql = 'INSERT INTO your_table_name (column1, column2, column3) VALUES ?'; // Adjust columns as needed
  const values = data.map(row => [row.column1, row.column2, row.column3]); // Adjust according to your data structure

  db.query(sql, [values], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ success: false, message: 'Failed to insert data' });
    }
    res.json({ success: true, message: 'Data inserted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});