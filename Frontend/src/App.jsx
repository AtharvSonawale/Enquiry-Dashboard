// src/App.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setHeaders(jsonData[0]); // Get headers
      setData(jsonData.slice(1)); // Get data excluding headers
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/data', { headers, data });
      alert('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    }
  };

  return (
    <div>
      <h1>Excel File Upload</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Submit Data</button>
    </div>
  );
};

export default App;