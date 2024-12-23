import React, { useState } from 'react';

const Enquiry = () => {
    const [chartType, setChartType] = useState('');
    const [status, setStatus] = useState('');

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
        </div>
    );
};

export default Enquiry;
