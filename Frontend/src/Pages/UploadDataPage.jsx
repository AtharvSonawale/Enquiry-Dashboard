import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const UploadDataPage = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  // Function to handle file upload and parse Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });
      setHeaders(sheetData[0]); // First row as headers
      setData(sheetData.slice(1)); // Remaining rows as data
    };
    reader.readAsBinaryString(file);
  };

  // Function to handle data submission to the backend
  const handleSubmit = async () => {
    try {
      const formattedData = data.map((row) =>
        headers.reduce((acc, header, index) => {
          acc[header] = row[index];
          return acc;
        }, {})
      );

      const response = await axios.post("/api/upload-data", {
        data: formattedData,
      });

      if (response.data.success) {
        alert("Data submitted successfully and charts generated!");
      } else {
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting the data.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload and Display Excel Data</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 border p-2"
      />

      {data.length > 0 && (
        <>
          <button
            onClick={() => console.log("Displaying data")}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Display Data
          </button>

          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-4 py-2 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit Data
          </button>
        </>
      )}
    </div>
  );
};

export default UploadDataPage;