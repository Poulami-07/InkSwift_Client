import React, { useContext } from 'react'

import { assets } from '../assets/assets' // Adjust the path as necessary
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify'; 


const Navbar = () => {

    const navigate = useNavigate();
    const {userData, backendUrl, setUserData, setIsLoggedIn} = useContext(AppContent);

    const sendVerificationOtp = async () =>{
      try{
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {}, 
        {
          withCredentials: true, 
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
        if(data.success){
          navigate('/email-verify')
          toast.success(data.message || "Verification OTP sent successfully");
        }else{
          toast.error(data.message || "Failed to send verification OTP");
        }

      }catch(error){
        toast.error(error.message || "An error occurred while sending verification OTP");
      }
      
    }

 
    const logout = async () =>{
      try{
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl + '/api/auth/logout')
        data.success && setIsLoggedIn(false);
        data.success && setUserData(false);
        navigate('/')

      } catch(error){
        toast.error(error.message);
      }
    }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-20'>

      <img src={assets.logo} alt="" className="w-32 sm:w-36 z-10 [filter:drop-shadow(0_2px_4px_rgba(139,92,246,0.6))_drop-shadow(0_6px_12px_rgba(88,28,135,0.5))] hover:scale-110 transition-transform duration-300 rounded-xl backdrop-blur-sm p-1"/>

    {userData ?
    <div className='w-9 h-9 flex justify-center items-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 text-white font-semibold shadow-md cursor-pointer relative group'>
      {userData.name[0].toUpperCase()}
      <div className='absolute hidden group-hover:block top-0 right-0 text-black pt-10 rounded-lg shadow-xl z-50 w-40 text-sm overflow-hidden'>
        <ul className='list-none m-0 p-2 bg-purple-400 text-sm rounded-lg shadow-lg'>
          {!userData.isAccVerified && <li onClick={sendVerificationOtp} className='w-full text-left px-4 py-2 hover:bg-purple-100 rounded-xl text-gray-800 transition-colors'>Verify email</li>}
          
          <li onClick={logout} className="w-full text-left px-4 py-2 hover:bg-purple-100 text-gray-800 rounded-xl transition-colors">Logout</li>
        </ul>

      </div>
    </div> 
     :
      <button onClick={() => navigate('/login')}
            className='flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
            Login 
            <img src={assets.arrow_icon} alt="" className='w-4'/>
        </button>
  }
 
    </div>
  )
}

export default Navbar;

