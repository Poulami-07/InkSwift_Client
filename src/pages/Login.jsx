import React, { useState } from 'react'
import { assets } from '../assets/assets' 
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const Login = () => {

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContent);

  // State to manage form inputs and toggle between Sign Up and Login

  const [state, setState] = useState("Sign Up")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (e)=>{
    try{
      e.preventDefault();

      axios.defaults.withCredentials = true; // Enable sending cookies with requests
// If the state is "Login", send a POST request to the login endpoint
      if(state === "Sign Up"){
        const {data} = await axios.post(backendUrl + '/api/auth/register',{name, email, password}, { withCredentials: true });


          if(data.success){
            setIsLoggedIn(true);
            getUserData()
            navigate('/');
          }else{
            toast.error(data.message || "Registration failed. Please try again.");

          }
      }else{
        const {data} = await axios.post(backendUrl + '/api/auth/login', { email, password }, { withCredentials: true });
        


          if(data.success){
            setIsLoggedIn(true)
            getUserData()
            navigate('/')
          }else{
            toast.error(data.message || "Login failed. Please check your credentials.");

          }
      }
    }catch(error){
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-300'>
      <img onClick={()=> navigate('/')} src = {assets.logo} alt="logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer drop-shadow-lg'/>
      
      <div className='bg-[#2e225f]/90 p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-100 text-sm flex flex-col items-center gap-6 backdrop-blur-md'> 


        <h2 className='text-3xl font-bold text-purple-200 text-center mb-2 tracking-wide '> 

          {state === "Sign Up" ? "Create Account" : "Login"}</h2>

        <p className='text-center text-sm mb-6 text-purple-300'>
          {state === "Sign Up" ? "Create your account" : "Login to your account!"}</p>


        <form onSubmit={onSubmitHandler} >
          {state === "Sign Up" && (
          <div className=' mb-4 flex items-center gap-3 border border-indigo-400/40 w-full px-5 py-2.5 rounded-full bg-slate-800/60 hover:border-indigo-300 transition'>
            <img src= {assets.person_icon} alt="" />
            <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent text-white placeholder-indigo-300 outline-none w-full' type="text" placeholder='Full Name' required/>
          </div>
          )}

          <div className='mb-4 flex items-center gap-3 border border-indigo-400/40 w-full px-5 py-2.5 rounded-full bg-slate-800/60 hover:border-indigo-300 transition'>
            <img src= {assets.mail_icon} alt="" />
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent text-white placeholder-indigo-300 outline-none w-full' type="email" placeholder='Email Id' required />
          </div>

          <div className='mb-4 flex items-center gap-3 border border-indigo-400/40 w-full px-5 py-2.5 rounded-full bg-slate-800/60 hover:border-indigo-300 transition '>
            <img src= {assets.lock_icon} alt="" />
            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent text-white placeholder-indigo-300 outline-none w-full' type="password" placeholder='Password' required/>
          </div>

          <p onClick={()=> navigate('/reset-password')} className='mb-4 text-indigo-400 cursor-pointer text-sm hover:underline transition'> Forgot Password ?  
          </p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition text-white font-medium shadow-md cursor-pointer'>{state}
          </button>

        </form>


          {state === "Sign Up" ? (
            <p className='text-gray-400 text-center text-xs mt-4'> 
              Already have an account?{'  '}
              <span onClick={()=> setState('Login')} className='text-indigo-300 cursor-pointer underline hover:text-white transition'>
                Login here
              </span>
            </p>
          ) : (
            <p className='text-gray-400 text-center text-xs mt-4'> 
              Don't have an account?{'  '}
              <span onClick={()=> setState('Sign Up')} className='text-indigo-300 cursor-pointer underline hover:text-white transition'>
                Sign up
              </span>
            </p>
          )}

      </div>
    </div>
  )
}

export default Login;
