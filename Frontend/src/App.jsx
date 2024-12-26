import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Navbar from './Components/Navbar'
import EnquiryPage from './Pages/EnquiryPage'
import UploadDataPage from './Pages/UploadDataPage'
import SalesPage from './Pages/SalesPage'

function App() {

  return (
    <>
    <Navbar />
    
    <Routes>
			      <Route path="/upload-data" element={<UploadDataPage />} />
			      <Route path="/enquiry" element={<EnquiryPage />} />
			      <Route path="/sales" element={<SalesPage />} />
			</Routes>
    </>
  )
}

export default App
