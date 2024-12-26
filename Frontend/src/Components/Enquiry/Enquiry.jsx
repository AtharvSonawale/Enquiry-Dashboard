import { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import data from '../../../../Backend/data.json'; // Adjust the path as necessary

const Enquiry = () => {
    const [chartType, setChartType] = useState('');
    const [status, setStatus] = useState('');
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        if (chartType && status) {
            const filteredData = data.filter(item => item.status === status);
            const labels = filteredData.map(item => item.customerName);
            const dataCounts = filteredData.length;

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: `Number of ${status} Orders`,
                        data: Array(dataCounts).fill(1), // Each customer counts as 1
                        backgroundColor: chartType === 'Bar' ? 'rgba(75, 192, 192, 0.6)' : chartType === 'Line' ? 'rgba(153, 102, 255, 0.6)' : 'rgba(255, 206, 86, 0.6)',
                        borderColor: chartType === 'Bar' ? 'rgba(75, 192, 192, 1)' : chartType === 'Line' ? 'rgba(153, 102, 255, 1)' : 'rgba(255, 206, 86, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [chartType, status]);

    return (
        <div className="p-7 flex flex-col md:flex-row gap-20">
            {/* Dropdown 1: Select Chart Type */}
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

            {/* Dropdown 2: Select Status */}
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-blue-700 mb-2">
                    Select Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 rounded px-5 py-2 w-full text-gray-700"
                >
                    <option value=""> Choose Order Status </option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Chart Display */}
            <div className="w-full mt-5">
                {chartType === 'Bar' && <Bar data={chartData} />}
                {chartType === 'Line' && <Line data={chartData} />}
                {chartType === 'Pie' && <Pie data={chartData} />}
            </div>
        </div>
    );
};

export default Enquiry;