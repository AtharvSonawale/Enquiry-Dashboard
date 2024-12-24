const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'Soham2709', // Replace with your MySQL password
  database: 'DASHB', // Replace with your database name
  charset: 'utf8mb4', // Set charset to handle wide range of characters
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Set up Multer for file uploads
const upload = multer({
  dest: 'upload/', // Directory to store uploaded files temporarily
});

// Sanitize function to remove control characters and special symbols
// Sanitize function to remove control characters and special symbols from both columns and values
function sanitizeInput(data) {
    return String(data)
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '')  // Remove control characters (non-printable)
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters and BOM
      .trim(); // Remove leading/trailing spaces
  }
  
  // Route to handle file upload and save data to MySQL
  app.post('/', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const table = 'uploaded_data'; // Define the table name here
  
    const results = [];
    // Parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        // Remove the uploaded file after parsing
        fs.unlinkSync(filePath);
  
        // Ensure column names are sanitized
        const headers = Object.keys(results[0]).map((header) => sanitizeInput(header));
        const placeholders = headers.map(() => '?').join(', ');
  
        const insertQuery = `INSERT INTO ${table} (${headers.join(
          ', '
        )}) VALUES (${placeholders})`;
  
        let insertCount = 0;
        let errorsOccurred = false;
  
        results.forEach((row) => {
          // Sanitize each value in the row
          const sanitizedRow = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [sanitizeInput(key), sanitizeInput(value)])
          );
  
          const values = Object.values(sanitizedRow);
  
          db.query(insertQuery, values, (err) => {
            if (err) {
              console.error('Error inserting data:', err);
              errorsOccurred = true;
            } else {
              insertCount++;
            }
  
            // After all insertions are attempted, send the response
            if (insertCount + errorsOccurred === results.length) {
              if (errorsOccurred) {
                return res.status(500).json({
                  success: false,
                  message: 'Error inserting data into the database.',
                });
              } else {
                return res.json({
                  success: true,
                  message: 'File uploaded and data saved to database.',
                });
              }
            }
          });
        });
      })
      .on('error', (err) => {
        console.error('Error reading file:', err);
        res.status(500).json({ success: false, message: 'File processing error' });
      });
  });
  

// Route to handle file upload and save data to MySQL
// app.post('/', upload.single('file'), (req, res) => {
//   const filePath = req.file.path;

//   const results = [];
//   // Parse the CSV file
//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (data) => {
//       results.push(data);
//     })
//     .on('end', () => {
//       // Remove the uploaded file after parsing
//       fs.unlinkSync(filePath);

//       // Insert data into MySQL
//       const table = 'uploaded_data'; // Replace with your table name
//       const headers = Object.keys(results[0]); // Get column names from the first row
//       const placeholders = headers.map(() => '?').join(', ');

//       const insertQuery = `INSERT INTO ${table} (${headers.join(
//         ', '
//       )}) VALUES (${placeholders})`;

//       let insertCount = 0;
//       let errorsOccurred = false;

//       results.forEach((row) => {
//         // Sanitize each value in the row
//         const sanitizedRow = Object.fromEntries(
//           Object.entries(row).map(([key, value]) => [key, sanitizeInput(value)])
//         );

//         const values = Object.values(sanitizedRow);

//         db.query(insertQuery, values, (err) => {
//           if (err) {
//             console.error('Error inserting data:', err);
//             errorsOccurred = true;
//           } else {
//             insertCount++;
//           }

//           // After all insertions are attempted, send the response
//           if (insertCount + errorsOccurred === results.length) {
//             if (errorsOccurred) {
//               return res.status(500).json({
//                 success: false,
//                 message: 'Error inserting data into the database.',
//               });
//             } else {
//               return res.json({
//                 success: true,
//                 message: 'File uploaded and data saved to database.',
//               });
//             }
//           }
//         });
//       });
//     })
//     .on('error', (err) => {
//       console.error('Error reading file:', err);
//       res.status(500).json({ success: false, message: 'File processing error' });
//     });
// });

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
