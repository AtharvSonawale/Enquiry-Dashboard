import React, { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-screen-xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="text-blue-600 font-semibold text-lg">PDVS</div>

                    {/* Hamburger Icon for Mobile */}
                    <div className={`lg:hidden ${isMenuOpen ? 'hidden' : ''}`}>
                        <button onClick={toggleMenu} className="text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Navbar Links */}
                    <ul className={`lg:flex ${isMenuOpen ? 'block' : 'hidden'} lg:space-x-8 space-y-4 lg:space-y-0 py-4 lg:py-0`}>
                        <li>
                            <a
                                href="upload-data"
                                className="text-blue-600 font-semibold hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition duration-300"
                            >
                                Upload Data
                            </a>
                        </li>
                        <li>
                            <a
                                href="enquiry"
                                className="text-blue-600 font-semibold hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition duration-300"
                            >
                                Enquiry
                            </a>
                        </li>
                        <li>
                            <a
                                href="products"
                                className="text-blue-600 font-semibold hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition duration-300"
                            >
                                Products
                            </a>
                        </li>
                        <li>
                            <a
                                href="customer"
                                className="text-blue-600 font-semibold hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition duration-300"
                            >
                                Customer
                            </a>
                        </li>
                        <li>
                            <a
                                href="sales"
                                className="text-blue-600 font-semibold hover:bg-blue-600 hover:text-white px-4 py-2 rounded transition duration-300"
                            >
                                Sales
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
