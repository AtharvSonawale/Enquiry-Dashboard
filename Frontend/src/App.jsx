import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Navbar from './Components/Navbar'
import EnquiryPage from './Pages/EnquiryPage'
import UploadDataPage from './Pages/UploadDataPage'

function App() {

  return (
    <>
    <Navbar />
    
    <Routes>
			      <Route path="/" element={<UploadDataPage />} />
			      <Route path="/enquiry" element={<EnquiryPage />} />
			</Routes>
    </>
  )
}

export default App
