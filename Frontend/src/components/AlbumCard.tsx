import React from 'react'
import { useNavigate } from 'react-router-dom'

interface AlbumCardProps{
    image:string,
    name:string,
    description :string,
    id:string
}

const AlbumCard:React.FC<AlbumCardProps> = ({image , name, description , id}) => {
  const navigate = useNavigate()

  return (
    <div 
      onClick={()=>navigate("/album/"+id)} 
      className='w-full max-w-[220px] p-4 rounded-xl cursor-pointer hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-blue-900/20 transition-all duration-500 backdrop-blur-sm border border-transparent hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] group/card transform hover:-translate-y-2'
    >
      <div className='relative group/image overflow-hidden rounded-xl'>
        {/* Image with overlay effects */}
        <div className='relative overflow-hidden rounded-xl aspect-square'>
          <img 
            src={image} 
            className='w-full h-full object-cover rounded-xl transition-all duration-700 group-hover/image:scale-110 group-hover/image:brightness-90' 
            alt={name}
          />
          
          {/* Gradient overlay on hover */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 rounded-xl'></div>
          
          {/* Glow effect */}
          <div className='absolute inset-0 bg-gradient-to-tr from-purple-600/0 to-blue-600/0 group-hover/image:from-purple-600/20 group-hover/image:to-blue-600/20 transition-all duration-500 rounded-xl'></div>
          
          {/* Play icon overlay */}
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-all duration-500'>
            <div className='bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 transform scale-75 group-hover/image:scale-100 transition-transform duration-500'>
              <svg 
                className='w-8 h-8 text-white' 
                fill='currentColor' 
                viewBox='0 0 24 24'
              >
                <path d='M8 5v14l11-7z'/>
              </svg>
            </div>
          </div>
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
      
      {/* Album badge indicator */}
      <div className='absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform translate-x-2 group-hover/card:translate-x-0 backdrop-blur-sm border border-white/20'>
        ALBUM
      </div>
    </div>
  )
}

export default AlbumCard