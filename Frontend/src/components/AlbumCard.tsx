import React from 'react'
import { useNavigate } from 'react-router-dom'

interface AlbumCardProps {
  image: string
  name: string
  description: string
  id: string
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, description, id }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate("/album/" + id)}
      className="
        group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 
        rounded-2xl overflow-hidden border border-gray-700/40 
        shadow-md hover:shadow-xl hover:scale-[1.02] 
        transition-all duration-300 cursor-pointer
      "
    >
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={image}
            className="w-full h-48 object-cover rounded-t-2xl transform group-hover:scale-105 transition-transform duration-300"
            alt={name}
          />

          {/* Soft overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-700/30 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>

          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm hover:bg-white/30 transition-all">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* bottom gradient overlay for title space */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Album Info */}
      <div className="p-4">
        <p className="text-white text-lg font-semibold">{name}</p>
        <p className="text-gray-400 text-sm mt-1">
          {description.slice(0, 40)}
          {description.length > 40 ? '...' : ''}
        </p>
      </div>

      {/* Album Badge */}
      <div
        className="
          absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-purple-600 
          text-white text-xs font-bold px-2 py-1 rounded-full shadow-md
        "
      >
        ALBUM
      </div>
    </div>
  )
}

export default AlbumCard
