import { FaMusic } from "react-icons/fa"
import { useUserData } from "../context/UserContext"

const PlayListCard = () => {
  const { user, isAuth } = useUserData()

  return (
    <div className="group bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 sm:p-6 rounded-2xl border border-purple-500/20 shadow-md shadow-purple-500/10 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300 backdrop-blur-md">
      {/* Music icon */}
      <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/30">
        <FaMusic className="text-xl sm:text-2xl animate-pulse" />
      </div>

      {/* Playlist info */}
      <div className="flex flex-col">
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide group-hover:text-cyan-400 transition-colors duration-300">
          My Playlist
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300 mt-0.5 sm:mt-1">
          Playlist 𖹭{" "}
          <span className="text-purple-400 font-medium">
            {isAuth ? user?.name : "User"}
          </span>
        </p>
      </div>
    </div>
  )
}

export default PlayListCard
