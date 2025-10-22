import React from 'react'
import { FaBookmark, FaPlay } from 'react-icons/fa'
import { useUserData } from '../context/UserContext'
import { useSongData } from '../context/SongContext'


interface SongCardProps{
    image:string,
    name:string,
    description:string,
    id:string
}
const SongCard: React.FC<SongCardProps> = ({image , name , description ,id}) => {
  const {addToPlaylist , isAuth} = useUserData()

  const {setSelectedSong , setIsPlaying} = useSongData()



  const saveToPlaylistHandler = () =>{
    addToPlaylist(id)
  }


  return (
    <div className='w-full max-w-[220px] p-4 rounded-xl cursor-pointer hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-blue-900/20 transition-all duration-500 backdrop-blur-sm border border-transparent hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] group/card transform hover:-translate-y-2'>
        <div className='relative group/image overflow-hidden rounded-xl'>
            {/* Image with overlay effects */}
            <div className='relative overflow-hidden rounded-xl aspect-square'>
              <img 
                src={image} 
                className='w-full h-full object-cover rounded-xl transition-all duration-700 group-hover/image:scale-110 group-hover/image:brightness-75' 
                alt={name}
              />
              
              {/* Gradient overlay on hover */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 rounded-xl'></div>
              
              {/* Glow effect */}
              <div className='absolute inset-0 bg-gradient-to-tr from-purple-600/0 to-blue-600/0 group-hover/image:from-purple-600/20 group-hover/image:to-blue-600/20 transition-all duration-500 rounded-xl'></div>
            </div>

            <div className='absolute inset-0 flex items-center justify-center gap-3'>
              {/* Play Button */}
              <button 
                className='bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] active:scale-95 z-10' 
                onClick={()=>{
                  setSelectedSong(id);
                  setIsPlaying(true)
                }}
              >
                <FaPlay className='w-5 h-5'/>
              </button>

              {/* Bookmark Button */}
              {isAuth && (
                <button 
                  className='bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-500 delay-75 hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] active:scale-95 z-10' 
                  onClick={saveToPlaylistHandler}
                >
                  <FaBookmark className='w-4 h-4'/>
                </button>
              )}
            </div>

            {/* Animated border effect */}
            <div className='absolute inset-0 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500'>
              <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-50 blur-sm animate-pulse'></div>
            </div>
        </div>

        {/* Text content with enhanced styling */}
        <div className='mt-4 space-y-1.5'>
          <p className='font-bold text-white group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-purple-400 group-hover/card:to-blue-400 transition-all duration-500 truncate text-base'>
            {name}
          </p>
          <p className='text-slate-400 text-sm group-hover/card:text-slate-300 transition-colors duration-300 line-clamp-2'>
            {description.slice(0,40)}{description.length > 40 ? '...' : ''}
          </p>
        </div>

        {/* Bottom glow effect */}
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-b-xl'></div>
    </div>
  )
}

export default SongCard