import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const HomePage = () => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [fileName, setFileName] = useState("");

    // Load data from local storage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem("excelData");
        const savedHeaders = localStorage.getItem("excelHeaders");
        const savedFileName = localStorage.getItem("excelFileName");

        if (savedData && savedHeaders && savedFileName) {
            setData(JSON.parse(savedData));
            setHeaders(JSON.parse(savedHeaders));
            setFileName(savedFileName);
        }
    }, []);

    const excelDateToJSDate = (serial) => {
        const date = new Date((serial - 25569) * 86400 * 1000);
        return date.toLocaleDateString(); // Format the date as needed
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

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
                    row.map((cell) => {
                        // Convert Excel date serial numbers to JS Date
                        if (typeof cell === 'number' && cell > 25569) {
                            return excelDateToJSDate(cell);
                        }
                        return (cell === undefined || cell === null || cell === "" ? "-" : String(cell).trim());
                    })
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
            setFileName(selectedFile.name); // Set the file name

            // Save to local storage
            localStorage.setItem("excelHeaders", JSON.stringify(headerRow));
            localStorage.setItem("excelData", JSON.stringify(dataRows));
            localStorage.setItem("excelFileName", selectedFile.name); // Save file name
        };
        reader.readAsArrayBuffer(selectedFile); // Use readAsArrayBuffer
    };

    const handleSubmit = async () => {
        try {
            const formattedData = data.map((row) => headers.reduce((acc, header, index) => {
                acc[header] = row[index];
                return acc;
            }, {}));

            const response = await axios.post('http://localhost:5000/api/data', {
                data: formattedData,
            });

            if (response.data.success) {
                alert('Data submitted successfully!');
            } else {
                alert('Failed to submit data.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('An error occurred while submitting the data. Please try again.');
        }
    };

    return (
        <div>
            <h1>Upload Excel File</h1>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            {fileName && <p>Uploaded File: {fileName}</p>} {/* Display the file name */}
            {data.length > 0 && (
                <div>
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
                    <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
                        Submit Data
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;