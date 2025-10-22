import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { useUserData } from "../context/UserContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-gradient-to-br from-gray-900/95 via-black to-gray-900/95 backdrop-blur-xl h-[30%] rounded-2xl flex flex-col justify-around border border-gray-800/50 shadow-xl shadow-black/50 overflow-hidden relative">
        
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div
          className="flex items-center mt-4 gap-3 pl-6 xl:pl-8 cursor-pointer group relative z-10 transition-all duration-300 hover:pl-7 xl:hover:pl-9"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <img 
              src="/home.png" 
              alt="" 
              className="w-5 xl:w-6 transition-all duration-300 group-hover:scale-110 relative z-10" 
            />
            <div className="absolute inset-0 bg-purple-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <p className="font-bold text-sm xl:text-base group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
            Home
          </p>
          <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </div>

        <div className="mt-4 px-2 xl:px-3 relative z-10" onClick={() => navigate("/playlist")}>
          <PlayListCard />
        </div>

        {user && user.role === "admin" && (
          <button
            className="px-4 xl:px-5 py-1.5 xl:py-2 mx-4 mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-bold text-sm xl:text-[15px] rounded-full cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-cyan-500/50 border border-purple-400/30 relative z-10 group overflow-hidden"
            onClick={() => navigate("/admin/dashboard")}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
            
              Admin Dashboard
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        )}
        
      </div>
    </div>
  );
};

export default Sidebar;