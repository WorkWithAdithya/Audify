import { FaMusic } from "react-icons/fa"
import { useUserData } from "../context/UserContext"


const PlayListCard = () => {
  const {user , isAuth} = useUserData()

  return (
    <div className="flex items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-purple-900/20 cursor-pointer bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-xl border border-gray-800/50 hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-purple-900/30 hover:via-black hover:to-cyan-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 group">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 flex items-center justify-center rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/40 group-hover:shadow-cyan-500/50 group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
        
        <FaMusic className="text-white text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-all duration-300" />
        </div>
        <div className="ml-3 sm:ml-4 flex-1">
            <h2 className="font-bold text-sm sm:text-base md:text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">My playlist</h2>
            <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mt-0.5 sm:mt-1">
              Playlist · {isAuth? <span className="text-purple-400 group-hover:text-cyan-400 transition-colors duration-300 font-medium">{user?.name}</span>:<span className="text-purple-400 group-hover:text-cyan-400 transition-colors duration-300 font-medium">{"User"}</span>}
            </p>

            </div>
    </div>
  )
}

export default PlayListCard