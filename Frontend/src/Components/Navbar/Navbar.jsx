import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b-2 p-4">
      <ul className="flex space-x-6 justify-center">
        <li>
          <a href="/api/data"
           className="text-blue-500 hover:bg-blue-700 hover:text-white px-4 py-2 rounded transition-colors">
            Upload Data
          </a>
        </li>
        <li>
          <a href="/enquiry"
           className="text-blue-500 hover:bg-blue-700 hover:text-white px-4 py-2 rounded transition-colors">
            Enquiry
          </a>
        </li>
        <li>
          <a href="/sales"
           className="text-blue-500 hover:bg-blue-700 hover:text-white px-4 py-2 rounded transition-colors">
            Sales
          </a>
        </li>
        <li>
          <a href="/customer" 
           className="text-blue-500 hover:bg-blue-700 hover:text-white px-4 py-2 rounded transition-colors">
            Customer
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
