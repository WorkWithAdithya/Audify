import { useParams } from "react-router-dom"
import Layout from "../components/Layout"
import { useSongData } from "../context/SongContext"
import { useEffect } from "react"
import Loading from "../components/Loading"
import { FaBookmark, FaPlay } from "react-icons/fa"
import { useUserData } from "../context/UserContext"


const Album = () => {
    const {fetchAlbumsongs , albumSong , albumData , setIsPlaying , setSelectedSong , loading} = useSongData()

    const {isAuth ,addToPlaylist} = useUserData()

    const params = useParams<{id:string}>()

    useEffect(()=>{
        if(params.id){
        fetchAlbumsongs(params.id)}

    },[params.id])

  return (
    <div>
      <Layout>{albumData && (
        <>
        {
            loading? <Loading/> : <>
            <div className="mt-6 sm:mt-8 md:mt-10 flex gap-4 sm:gap-6 md:gap-8 flex-col md:flex-row md:items-center">
            {
                albumData.thumbnail && ( 
                    <div className="relative group">
                        <img 
                            src={albumData.thumbnail} 
                            className="w-40 sm:w-44 md:w-48 lg:w-56 rounded-xl shadow-2xl shadow-purple-900/50 border-2 border-purple-500/30 group-hover:border-cyan-500/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-cyan-500/50" 
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                )
            }

            <div className="flex flex-col gap-2 sm:gap-3">
                <p className="text-xs sm:text-sm font-semibold text-purple-400 tracking-wider uppercase">Playlist</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                    {albumData.title}
                </h2>
                <h4 className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">{albumData.description}</h4>
                
            </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 mt-6 sm:mt-8 md:mt-10 mb-3 sm:mb-4 pl-2 sm:pl-3 md:pl-4 text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider">
                <p> 
                    <b className="mr-3 sm:mr-4">Sl.no</b>
                  
                </p>
                <p className="hidden sm:block">Description</p>
                <p className="text-center">Actions</p>
            </div>
        
             <hr className="border-gray-800/50 mb-2" />
    {
        albumSong && albumSong.map((song, index) => {
            return (
                <div 
                    className="grid grid-cols-3 sm:grid-cols-4 mt-2 mb-2 pl-2 sm:pl-3 md:pl-4 py-2 sm:py-3 text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/20 hover:via-pink-900/10 hover:to-cyan-900/20 cursor-pointer rounded-lg backdrop-blur-sm border border-transparent hover:border-purple-500/20 transition-all duration-300 group" 
                    key={index}
                >
                    <p className="text-white flex items-center text-xs sm:text-sm md:text-base">
                        <b className="mr-3 sm:mr-4 text-gray-500 group-hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm">
                            {index + 1}
                        </b>
                        <img 
                            src={song.thumbnail ? song.thumbnail : "/downlaod.jpg"} 
                            className="inline w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 md:mr-5 rounded-md shadow-lg shadow-black/50 border border-purple-500/30 group-hover:border-cyan-500/50 group-hover:scale-110 transition-all duration-300"
                            alt="" 
                        />
                        <span className="group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 truncate">
                            {song.title}
                        </span>
                    </p>
                    <p className="text-xs sm:text-sm md:text-[15px] hidden sm:block text-gray-400 group-hover:text-gray-300 transition-colors duration-300 flex items-center truncate">
                        {song.description.slice(0,30)}....
                    </p>

                    <p className="flex justify-center items-center gap-3 sm:gap-4 md:gap-5">
                        {isAuth && 
                            <button 
                                className="text-sm sm:text-base md:text-[15px] text-purple-400 hover:text-cyan-400 transition-all duration-300 hover:scale-125 p-2 rounded-lg hover:bg-purple-500/10" 
                                onClick={()=>{
                                    addToPlaylist(song.id)
                                }}
                            >
                                <FaBookmark />
                            </button>
                        }

                        <button 
                            className="text-sm sm:text-base md:text-[15px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white p-2 rounded-full hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 transition-all duration-300 hover:scale-110 shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/50" 
                            onClick={()=>{
                                setSelectedSong(song.id)
                                setIsPlaying(true)
                            }}
                        >
                            <FaPlay />
                        </button>

                    </p>
                </div>
            )
        })
    }
        
            </>
        }
        </>
      )}</Layout>
    </div>
  )
}

export default Album