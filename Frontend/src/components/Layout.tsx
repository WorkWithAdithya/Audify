import React, { type ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Player from "./Player";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0f0f10] via-[#141518] to-[#0c0c0e] text-white overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[450px] h-[450px] bg-fuchsia-600/25 rounded-full blur-[140px] animate-pulse" />
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-[260px] bg-white/5 backdrop-blur-md border-r border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] hidden lg:block lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-h-screen">
          {/* Top Gradient Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-600" />

          {/* Navbar */}
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>

          {/* Page Content */}
          <section className="flex-1 px-5 sm:px-8 md:px-10 pt-6 pb-28 md:pb-32 transition-all duration-300">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-4 sm:p-6 md:p-8 hover:bg-white/10 transition duration-500">
              {children}
            </div>
          </section>
        </main>
      </div>

      {/* Player Section (always visible at bottom) */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#0b0b0c]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-2px_15px_rgba(0,0,0,0.3)] z-40">
        <Player />
      </footer>
    </div>
  );
};

export default Layout;