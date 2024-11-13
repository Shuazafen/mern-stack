import React from 'react'
import Add from './pages/Add/Add'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Order from './pages/Orders/Order'
import List from './pages/List/List'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

   const url = "http://localhost:4000"
  
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
        <Route path='/add' element={<Add url={url}/>}/>
        <Route path='/list' element={<List url={url}/>}/>
        <Route path='/order' element={<Order url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
