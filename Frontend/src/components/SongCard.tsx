import React from 'react'
import { FaBookmark, FaPlay, FaShoppingCart, FaDownload } from 'react-icons/fa'
import { useUserData } from '../context/UserContext'
import { useSongData } from '../context/SongContext'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

interface SongCardProps{
    image:string,
    name:string,
    description:string,
    id:string,
    price?: number
}

const SongCard: React.FC<SongCardProps> = ({image , name , description ,id, price}) => {
  const {addToPlaylist , isAuth, user} = useUserData()
  const {setSelectedSong , setIsPlaying} = useSongData()
  const { addToCart, isInCart } = useCart()
  const navigate = useNavigate()

  const saveToPlaylistHandler = () =>{
    addToPlaylist(id)
  }

  const handlePlayClick = () => {
    console.log("🎵 Play button clicked!");
    console.log("Song ID:", id);
    console.log("Song Name:", name);
    
    setSelectedSong(id)
    setIsPlaying(true)
    
    console.log("✅ setSelectedSong and setIsPlaying called");
  }

  const handleDownload = async () => {
    if (!isAuth) {
      toast.error("Please login to download");
      navigate("/login");
      return;
    }

    if (!hasPurchased) {
      toast.error("Please purchase this song to download");
      return;
    }

    try {
      toast.loading("Preparing download...");
      
      // Get the song details with audio URL
      const { data } = await axios.get(`http://localhost:8000/api/v1/song/${id}`);
      
      if (!data.audio) {
        toast.dismiss();
        toast.error("Audio file not available");
        return;
      }

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.audio;
      link.download = `${name}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`Downloading ${name}...`);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download song");
      console.error("Download error:", error);
    }
  }

  const handleAddToCart = () => {
    if (!isAuth) {
      navigate("/login")
      return
    }

    const songPrice = price ? parseFloat(price.toString()) : 0

    addToCart({
      id,
      title: name,
      description,
      thumbnail: image,
      price: songPrice,
    })
  }

  const isFree = !price || price === 0
  const hasPurchased = user?.purchasedSongs?.includes(id)
  const inCart = isInCart(id)

  return (
    <div className='w-full max-w-[220px] p-4 rounded-xl cursor-pointer hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-blue-900/20 transition-all duration-500 backdrop-blur-sm border border-transparent hover:border-purple-500/30 hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)] group/card transform hover:-translate-y-2 relative'>
        
        {/* Price Badge */}
        {!isFree && (
          <div className='absolute top-6 right-6 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-yellow-500/50 flex items-center gap-1'>
            <span>₹{price}</span>
          </div>
        )}

        {/* Purchased Badge */}
        {hasPurchased && !isFree && (
          <div className='absolute top-6 left-6 z-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-500/50'>
            OWNED
          </div>
        )}

        {/* In Cart Badge */}
        {inCart && !hasPurchased && !isFree && (
          <div className='absolute top-6 left-6 z-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/50'>
            IN CART
          </div>
        )}

        {/* Free Badge */}
        {isFree && (
          <div className='absolute top-6 left-6 z-20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-cyan-500/50'>
            FREE
          </div>
        )}

        <div className='relative group/image overflow-hidden rounded-xl'>
            <div className='relative overflow-hidden rounded-xl aspect-square'>
              <img 
                src={image} 
                className='w-full h-full object-cover rounded-xl transition-all duration-700 group-hover/image:scale-110 group-hover/image:brightness-75' 
                alt={name}
              />
              
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 rounded-xl'></div>
              
              <div className='absolute inset-0 bg-gradient-to-tr from-purple-600/0 to-blue-600/0 group-hover/image:from-purple-600/20 group-hover/image:to-blue-600/20 transition-all duration-500 rounded-xl'></div>
            </div>

            <div className='absolute inset-0 flex items-center justify-center gap-3'>
              {/* Play Button - ALWAYS SHOW */}
              <button 
                className='bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] text-white p-4 rounded-full opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-95 z-10'
                onClick={handlePlayClick}
                title='Play song'
              >
                <FaPlay className='w-5 h-5'/>
              </button>

              {/* Download Button (Only for Purchased Songs) */}
              {hasPurchased && (
                <button 
                  className='bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] text-white p-4 rounded-full opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-95 z-10 delay-75'
                  onClick={handleDownload}
                  title='Download song'
                >
                  <FaDownload className='w-5 h-5'/>
                </button>
              )}

              {/* Add to Cart Button (Only for Paid & Not Purchased) */}
              {!isFree && !hasPurchased && (
                <button 
                  className={`${inCart ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'} text-white p-4 rounded-full opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-500 hover:scale-110 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] active:scale-95 z-10 delay-75`}
                  onClick={handleAddToCart}
                  title={inCart ? "Already in cart" : "Add to cart"}
                >
                  <FaShoppingCart className='w-5 h-5'/>
                </button>
              )}

              {/* Bookmark Button */}
              {isAuth && (
                <button 
                  className='bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-500 delay-150 hover:scale-110 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] active:scale-95 z-10' 
                  onClick={saveToPlaylistHandler}
                  title="Add to playlist"
                >
                  <FaBookmark className='w-4 h-4'/>
                </button>
              )}
            </div>

            <div className='absolute inset-0 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500'>
              <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-50 blur-sm animate-pulse'></div>
            </div>
        </div>

        <div className='mt-4 space-y-1.5'>
          <p className='font-bold text-white group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-purple-400 group-hover/card:to-blue-400 transition-all duration-500 truncate text-base'>
            {name}
          </p>
          <p className='text-slate-400 text-sm group-hover/card:text-slate-300 transition-colors duration-300 line-clamp-2'>
            {description.slice(0,40)}{description.length > 40 ? '...' : ''}
          </p>
        </div>

        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-b-xl'></div>
    </div>
  )
}

export default SongCard