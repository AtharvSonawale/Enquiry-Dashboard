import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import EnquiryPage from './Pages/EnquiryPage'
import UploadDataPage from './Pages/UploadDataPage'
import SalesPage from './Pages/SalesPage'
import HomePage from './Pages/HomePage'

function App() {

  return (
    <>
    <Navbar />
    
    <Routes>
            <Route path="/" element={<HomePage />} />
			      <Route path="/api/data" element={<UploadDataPage />} />
			      <Route path="/enquiry" element={<EnquiryPage />} />
			      <Route path="/sales" element={<SalesPage />} />
			</Routes>
    </>
  )
}

export default App
