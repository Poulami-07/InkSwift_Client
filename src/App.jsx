import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer} from 'react-toastify';
import Dashboard from './pages/Dashboard'


const App = () => {
  return (
    //set up the main app component/ route
    <div> 
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>

      </Routes>
    </div>
  )
}

export default App

