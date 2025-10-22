import React from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Player from "./Player";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className='h-screen bg-black'>
      <div className='h-[90%] flex'>  
        <Sidebar/>  
        <div className="w-[100%] m-2 px-6 pt-4 rounded-xl bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#0a0a0a] text-white overflow-auto lg:w-[75%] lg:ml-0 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm relative">
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none rounded-xl"></div>
            
            {/* Animated glow effect in corners */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <Navbar />
              {children}
            </div>
        </div>
      </div>
      <Player/>
    </div>
  )
}

export default Layout;