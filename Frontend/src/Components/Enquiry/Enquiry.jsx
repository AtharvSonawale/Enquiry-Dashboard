import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

const Enquiry = () => {
    const [chartType, setChartType] = useState('');
    const [chartData, setChartData] = useState([]);

    // Fetch data from backend
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/enquiry') // replace with your server URL
            .then((response) => {
                const data = response.data;
                setChartData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const renderChart = () => {
        if (!chartType || chartData.length === 0) {
            return <p className="text-center text-gray-500 p-1">Please select a Chart Type to view the chart.</p>;
        }

        switch (chartType) {
            case 'Bar':
                return (
                    <BarChart width={1400} height={400} barSize={75} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Status_Remark" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#0074b7" />
                    </BarChart>
                );
            case 'Line':
                return (
                    <LineChart width={1400} height={400} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Status_Remark" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    </LineChart>
                );
            case 'Pie':
                return (
                    <PieChart width={1400} height={400}>
                        <Tooltip />
                        <Legend />
                        <Pie data={chartData} dataKey="count" nameKey="Status_Remark" cx="50%" cy="50%" outerRadius={150} fill="#8884d8">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d0ed57'][index % 5]} />
                            ))}
                        </Pie>
                    </PieChart>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-5 ">
            {/* Dropdown for Chart Type */}
            <div className="flex flex-col item-start ml-5 md:flex-row gap-20 mb-10">
                <div>
                    <label htmlFor="chartType" className="block text-sm font-medium text-blue-700 mb-2">
                        Select Chart Type
                    </label>
                    <select
                        id="chartType"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="border border-gray-300 rounded px-5 py-2 w-full text-gray-700"
                    >
                        <option value=""> Choose Chart Type </option>
                        <option value="Bar">Bar Chart</option>
                        <option value="Line">Line Chart</option>
                        <option value="Pie">Pie Chart</option>
                    </select>
                </div>
            </div>

            {/* Chart */}
            <div className="flex justify-center items-center border border-gray-300 w-full pr-5 pt-5 rounded shadow-lg bg-white h-auto">
                {renderChart()}
            </div>
        </div>
    );
};

export default Enquiry;
