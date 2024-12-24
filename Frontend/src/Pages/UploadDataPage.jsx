import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const UploadDataPage = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState(""); // State to hold the file name

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("excelData");
    const savedHeaders = localStorage.getItem("excelHeaders");
    const savedFileName = localStorage.getItem("excelFileName"); // Load file name

    if (savedData && savedHeaders && savedFileName) {
      setData(JSON.parse(savedData));
      setHeaders(JSON.parse(savedHeaders));
      setFileName(savedFileName); // Set the file name
    }
  }, []);

  // Function to handle file upload and parse Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = new Uint8Array(event.target.result);
      const workbook = XLSX.read(binaryStr, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
        defval: "", // Default value for empty cells
      });

      // Clean and process the data
      const cleanedData = sheetData
        .filter((row) => row.some((cell) => cell !== undefined && cell !== null && cell !== ""))
        .map((row) => 
          row.map((cell) => (cell === undefined || cell === null || cell === "" ? "-" : String(cell).trim()))
        );

      // Remove empty columns
      const nonEmptyColumns = cleanedData[0].map((_, colIndex) => 
        cleanedData.some(row => row[colIndex] !== "-")
      );

      const finalData = cleanedData.map(row => 
        row.filter((_, colIndex) => nonEmptyColumns[colIndex])
      );

      // Ensure consistent column alignment
      const maxColumns = Math.max(...finalData.map(row => row.length));
      const alignedData = finalData.map(row => {
        while (row.length < maxColumns) row.push("-");
        return row;
      });

      // Set headers and data
      const [headerRow, ...dataRows] = alignedData;
      setHeaders(headerRow);
      setData(dataRows);
      setFileName(file.name); // Set the file name

      // Save to local storage
      localStorage.setItem("excelHeaders", JSON.stringify(headerRow));
      localStorage.setItem("excelData", JSON.stringify(dataRows));
      localStorage.setItem("excelFileName", file.name); // Save file name
    };
    reader.readAsArrayBuffer(file); // Use readAsArrayBuffer instead
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
      alert("An error occurred while submitting the data. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload and Display Excel Data</h1>
      <input
        type="file"
        accept=".xlsx, .xls "
        onChange={handleFileUpload}
        className="mb-4 border p-2"
      />
      {fileName && <p className="mb-4">Uploaded File: {fileName}</p>} {/* Display the file name */}

      {/* Move the Submit button here */}
      {data.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Submit Data
        </button>
      )}

      {data.length > 0 && (
        <table className="table-auto border-collapse border border-gray-300 w-full" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-left"
                  style={{ width: `${100 / headers.length}%`, wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }} // Added styles for text handling
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
                    style={{ width: `${100 / headers.length}%`, wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }} // Added styles for text handling
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UploadDataPage;