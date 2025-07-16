import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const {userData} = useContext(AppContent);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (userData) {
      navigate('/dashboard'); 
    } else {
      navigate('/login'); 
    }
  };

  return (
    <div className='flex flex-col items-center mt-24 px-4 text-center text-slate-100'>
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6 shadow-md ring-2 ring-indigo-400/50' />

        <h1 className='flex items-center gap-2 text-2xl sm:text-4xl font-semibold mb-2 tracking-tight'>
        Hey {userData ? userData.name : 'Developer '}!
            <img className='w-8 aspect-square animate-wave' src={assets.hand_wave} alt="wave" />
        </h1>

        <h2 className='text-3xl sm:text-5xl font-bold text-indigo-100 mb-4 tracking-tight'>
            Welcome to InkSwift
        </h2>

        <p className='mb-8 max-w-md text-indigo-200 leading-relaxed'>
            A beautiful way to craft and sign your documents. Transform the way you work, one signature at a time.
        </p>

        <button onClick={handleGetStarted} className='flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
            Get Started
        </button>

    </div>
  )
}

export default Header
