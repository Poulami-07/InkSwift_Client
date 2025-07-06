import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';



const EmailVerify = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContent);

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

  const onSubmitHandler = async(e)=>{
    try{
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('');

      //const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp}, { withCredentials: true });
      const { data } = await axios.post(
      backendUrl + '/api/auth/verify-account',
      { userId: userData._id, otp }, // include userId
      { withCredentials: true }
      );


      if(data.success){
        toast.success(data.message || "Email verified successfully")
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message || "Failed to verify email")
      }

    }catch(error){
      toast.error(error?.response?.data?.message || "An error occurred while verifying email");
    }

  }


//   useEffect(()=>{
//     isLoggedIn && userData && userData.isAccVerified && navigate('/')
// },[isLoggedIn, userData]);
useEffect(() => {
  if (isLoggedIn && userData?.isAccVerified) {
    navigate('/');
  }
}, [isLoggedIn, userData]);



  return (
  
        <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300'>
                <img onClick={()=> navigate('/')} src = {assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer drop-shadow-lg'/>

                <form onSubmit={onSubmitHandler} className='bg-[#2e225f]/90 p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-100 text-sm flex flex-col items-center gap-6 backdrop-blur-md'>
                <h1 className='text-2xl font-semibold text-purple-200 text-center mb-4 tracking-wide '>Email Verify OTP</h1>
                <p className='text-center text-sm mb-6 text-purple-300'>Enter the 6-digit code sent to your Email ID</p>
                <div className='flex justify-between mb-8 gap-2 sm:gap-3'>
                  {Array(6).fill(0).map((_,index)=>(
                    <input type="text" maxLength="1" key={index} required 
                    className='w-12 h-12 bg-purple-400 text-white text-center text-xl 
                 rounded-md outline-none focus:ring-2 focus:ring-white transition-all'
                 ref={ e => inputRefs.current[index] = e}
                 onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition text-white font-medium shadow-md cursor-pointer'>Verify Email</button>
                </form>
          
          </div>
  )
}

export default EmailVerify;