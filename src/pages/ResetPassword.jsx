import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
//import e from 'cors';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

    const handleInput = (e, index) => {
      if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
        inputRefs.current[index + 1].focus()
      }
    }

    const handleKeyDown = (e, index) => {
      if(e.key === 'Backspace' && e.target.value === '' && index > 0){
        inputRefs.current[index - 1].focus()
      }
    }

    const onSubmitEmail = async (e)=>{
      e.preventDefault();
      try{
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
        data.success ? toast.success(data.message) : toast.error(data.message)
        data.success && setIsEmailSent(true)
      }catch(error){
        toast.error(error.message)
      }
    }

    // const onSubmitOtp = async (e)=>{
    //   e.preventDefault();
    //   const otpArray = inputRefs.current.map(e => e.value)
    //   setOtp(otpArray.join(''))
    //   setIsOtpSubmitted(true)
    // }

    const onSubmitOtp = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otpCode = otpArray.join('').trim();

      setOtp(otpCode);       // Store OTP for next step
      setIsOtpSubmitted(true);  // Show password form
      toast.success('OTP entered. Now set your new password.');
    };
    const onSubmitNewPassword = async (e)=>{
      e.preventDefault();
      try{
        const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
          email,
          otp,
          newPassword
        });
        
        data.success ? toast.success(data.message) : toast.error(data.message);
        if(data.success) navigate('/login');
      }catch(error){
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };


  
    // const onSubmitNewPassword = async (e)=>{
    //   e.preventDefault();
    //   try{
    //     const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email,otp,newPassword})
    //     data.success ? toast.success(data.message) : toast.error(data.message)
    //     data.success && navigate('/login')
    //   }catch(error){
    //     toast.error(error.message)
    //   }
    // }

   

  return (
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300'>
       <img onClick={()=> navigate('/')} src = {assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer drop-shadow-lg'/>

{/* This is where you can add your reset password form */}

{!isEmailSent && 

       <form onSubmit={onSubmitEmail} className='bg-[#2e225f]/90 p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-100 text-sm flex flex-col items-center gap-6 backdrop-blur-md'>
       <h1 className='text-2xl font-semibold text-purple-200 text-center mb-4 tracking-wide '>Reset Password</h1>
        <p className='text-center text-sm mb-6 text-purple-300'>Enter your registered Email Address</p>
       <div className='mb-4 flex items-center gap-3 border border-indigo-400/40 w-full px-5 py-2.5 rounded-full bg-slate-800/60 hover:border-indigo-300 transition'>
        <img src={assets.mail_icon} alt="" className='w-3 h-3'/>
        <input type="email" placeholder='Email ID' className='bg-transparent text-white placeholder-indigo-300 outline-none w-full'
        value={email} onChange={e => setEmail(e.target.value)} required/>
       </div>
       <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition text-white font-medium shadow-md cursor-pointer'>Submit</button>
       </form>
}

      {/**  OTP input form */}

      {!isOtpSubmitted && isEmailSent &&
       <form onSubmit={onSubmitOtp} className='bg-[#2e225f]/90 p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-100 text-sm flex flex-col items-center gap-6 backdrop-blur-md'>
      <h1 className='text-2xl font-semibold text-purple-200 text-center mb-4 tracking-wide '>Reset Password OTP</h1>
      <p className='text-center text-sm mb-6 text-purple-300'>Enter the 6-digit code sent to your Email ID</p>
      <div className='flex justify-between mb-8 gap-2 sm:gap-3'>{Array(6).fill(0).map((_,index)=>(
      <input type="text" maxLength="1" key={index} required className='w-12 h-12 bg-purple-400 text-white text-center text-xl rounded-md outline-none focus:ring-2 focus:ring-white transition-all'
      ref={ e => inputRefs.current[index] = e}
      onInput={(e) => handleInput(e, index)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      />
      ))}
      </div>
        <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition text-white font-medium shadow-md cursor-pointer'>Submit
        </button>
      </form>
}
  {/* enter new password */}

  {isOtpSubmitted && isEmailSent &&

  <form onSubmit={onSubmitNewPassword} className='bg-[#2e225f]/90 p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-100 text-sm flex flex-col items-center gap-6 backdrop-blur-md'>
       <h1 className='text-2xl font-semibold text-purple-200 text-center mb-4 tracking-wide '>New Password</h1>
        <p className='text-center text-sm mb-6 text-purple-300'>Enter the new password below</p>
       <div className='mb-4 flex items-center gap-3 border border-indigo-400/40 w-full px-5 py-2.5 rounded-full bg-slate-800/60 hover:border-indigo-300 transition'>
        <img src={assets.lock_icon} alt="" className='w-3 h-3'/>
        <input type="password" placeholder='Password' className='bg-transparent text-white placeholder-indigo-300 outline-none w-full'
        value={newPassword} onChange={e => setnewPassword(e.target.value)} required/>
       </div>
       <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition text-white font-medium shadow-md cursor-pointer'>Submit</button>
       </form>
}
    </div>
  )
}

export default ResetPassword;
