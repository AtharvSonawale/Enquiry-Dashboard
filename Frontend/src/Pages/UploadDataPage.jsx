import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const UploadDataPage = () => {
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Excel File Upload</h1>

      <input
        type="file"
        accept=".xlsx, .xls"
        className="block w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 mb-4 cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
        onChange={handleFileChange}
      />

      {headers.length > 0 && (
        <div className="overflow-scroll">
          <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                {headers.map((header, index) => (
                  <th key={index} className="px-6 py-3 border-b border-gray-300">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                  } hover:bg-gray-50`}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-3 border-b border-gray-300 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="mt-4 flex justify-center item-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Submit Data
      </button>
    </div>
  );
};

export default UploadDataPage;
