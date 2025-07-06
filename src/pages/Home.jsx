import React from 'react'
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  return (
     
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#4c1d95] via-[#3730a3] to-[#1e1b4b] text-white relative overflow-hidden">
    {/* Radial glow overlays */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-30"></div>

     
  <div className="z-10 w-full"></div>
        <div className="z-10 w-full">
          <Navbar />
          <Header />
        </div>
      </div>

  )
}

export default Home;


// {/* <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#9333ea] via-[#3730a3] to-[#1e1b4b] text-white relative overflow-hidden">
//   {/* Radial glow overlays */}
//   <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05)_0%,transparent_50%)] opacity-30"></div> */}
