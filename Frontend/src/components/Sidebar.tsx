import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { useUserData } from "../context/UserContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useUserData();

  return (
    <div className="w-full h-full p-3 flex flex-col gap-3 text-white">
      {/* Transparent glassmorphism background */}
      <div className="relative bg-gradient-to-br from-gray-900/70 via-black/50 to-gray-900/70 backdrop-blur-2xl rounded-2xl border border-gray-700/40 shadow-lg shadow-black/40 overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-purple-500/30">
        
        {/* Animated overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-cyan-900/10 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        {/* HOME BUTTON */}
        <div
          className="flex items-center mt-4 gap-3 pl-6 xl:pl-8 cursor-pointer group relative z-10 transition-all duration-300 hover:pl-7 xl:hover:pl-9"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <img
              src="/home.png"
              alt="Home Icon"
              className="w-5 xl:w-6 transition-all duration-300 group-hover:scale-110 relative z-10"
            />
            <div className="absolute inset-0 bg-purple-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <p className="font-bold text-sm xl:text-base group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
            Home
          </p>

          <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </div>

        {/* PLAYLIST CARD (no logic changed) */}
        <div
          className="mt-4 px-2 xl:px-3 relative z-10 hover:scale-[1.01] transition-transform duration-300"
          onClick={() => navigate("/playlist")}
        >
          <div className="bg-gradient-to-br cursor-pointer from-gray-800/70 via-black/50 to-gray-900/70 backdrop-blur-xl rounded-xl border border-gray-700/30 shadow-md shadow-black/40 hover:shadow-purple-500/30 transition-all duration-300">
            <PlayListCard />
          </div>
        </div>

        {/* ADMIN DASHBOARD BUTTON */}
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
