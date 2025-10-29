import { useNavigate, useParams } from "react-router-dom"
import Layout from "../components/Layout"
import { useSongData } from "../context/SongContext"
import { useEffect } from "react"
import Loading from "../components/Loading"
import { FaBookmark, FaPlay, FaShoppingCart, FaDownload } from "react-icons/fa"
import { useUserData } from "../context/UserContext"
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

const Album = () => {
  const { fetchAlbumsongs, albumSong, albumData, setIsPlaying, setSelectedSong, loading } = useSongData()
  const { isAuth, addToPlaylist, user } = useUserData()
  const { addToCart, isInCart } = useCart()
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  useEffect(() => {
    if (params.id) fetchAlbumsongs(params.id)
  }, [params.id])

  const handlePlaySong = (songIdStr: string) => {
    setSelectedSong(songIdStr)
    setIsPlaying(true)
  }

  const handleAddToCart = (song: any) => {
    if (!isAuth) return navigate("/login")

    const songPrice = song.price ? parseFloat(song.price.toString()) : 0
    const songIdStr = String(song.id)

    addToCart({
      id: songIdStr,
      title: song.title,
      description: song.description,
      thumbnail: song.thumbnail || "/download.jpg",
      price: songPrice,
    })
  }

  const handleDownload = async (song: any) => {
    if (!isAuth) return navigate("/login")

    const songIdStr = String(song.id)
    const songPrice = song.price ? parseFloat(song.price.toString()) : 0
    const hasPurchased = user?.purchasedSongs?.includes(songIdStr)

    if (songPrice > 0 && !hasPurchased) return toast.error("Please purchase this song to download")

    try {
      toast.loading("Preparing download...")

      if (!song.audio) {
        toast.dismiss()
        return toast.error("Audio file not available")
      }

      const link = document.createElement("a")
      link.href = song.audio
      link.download = `${song.title}.mp3`
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.dismiss()
      toast.success(`Downloading ${song.title}...`)
    } catch (error) {
      toast.dismiss()
      toast.error("Failed to download song")
      console.error("Download error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle moving background */}
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -top-32 -left-32 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000"></div>
      </div>

      <Layout>
        {albumData && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <div className="relative z-10 px-4 sm:px-6 md:px-10 py-10">
                {/* Album header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {albumData.thumbnail && (
                    <div className="relative group">
                      <img
                        src={albumData.thumbnail}
                        alt={albumData.title}
                        className="w-40 sm:w-48 md:w-56 rounded-2xl shadow-2xl border border-purple-500/30 transition-transform duration-500 group-hover:scale-105 group-hover:border-cyan-500/50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  <div className="flex flex-col text-center md:text-left gap-3">
                    <p className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                      Playlist
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                      {albumData.title}
                    </h2>
                    <p className="text-gray-400 max-w-xl leading-relaxed">
                      {albumData.description}
                    </p>
                  </div>
                </div>

                {/* Song list header */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-10 mb-4 text-gray-400 text-xs sm:text-sm uppercase font-semibold tracking-wider border-b border-gray-800 pb-2">
                  <p>Sl.no</p>
                  <p className="hidden sm:block">Description</p>
                  <p className="text-center">Price</p>
                  <p className="text-center">Actions</p>
                </div>

                {/* Song list */}
                {albumSong?.map((song, index) => {
                  const songPrice = song.price ? parseFloat(song.price.toString()) : 0
                  const songIdStr = String(song.id)
                  const hasPurchased = user?.purchasedSongs?.includes(songIdStr)
                  const isFree = songPrice === 0
                  const inCart = isInCart(songIdStr)

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-4 sm:grid-cols-5 items-center text-gray-300 hover:bg-gradient-to-r hover:from-purple-900/20 hover:via-pink-900/10 hover:to-cyan-900/20 backdrop-blur-sm rounded-xl border border-transparent hover:border-purple-500/20 transition-all duration-300 py-3 px-2 sm:px-4 mb-2"
                    >
                      {/* Song index + title */}
                      <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base">
                        <span className="text-gray-500 group-hover:text-purple-400">{index + 1}</span>
                        <img
                          src={song.thumbnail || "/download.jpg"}
                          alt={song.title}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md border border-purple-500/30 group-hover:border-cyan-500/50 transition-all duration-300"
                        />
                        <span className="truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text">
                          {song.title}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="hidden sm:block text-xs sm:text-sm text-gray-400 truncate">
                        {song.description.slice(0, 40)}...
                      </p>

                      {/* Price */}
                      <p className="flex justify-center text-xs font-bold">
                        {isFree ? (
                          <span className="text-cyan-400">FREE</span>
                        ) : hasPurchased ? (
                          <span className="text-green-400">OWNED</span>
                        ) : inCart ? (
                          <span className="text-blue-400">IN CART</span>
                        ) : (
                          <span className="text-yellow-400">₹{songPrice}</span>
                        )}
                      </p>

                      {/* Actions */}
                      <div className="flex justify-center items-center gap-3 sm:gap-4">
                        {isAuth && (
                          <button
                            className="text-purple-400 hover:text-cyan-400 hover:scale-125 transition-all duration-300"
                            onClick={() => addToPlaylist(songIdStr)}
                            title="Add to playlist"
                          >
                            <FaBookmark />
                          </button>
                        )}

                        {(isFree || hasPurchased) ? (
                          <>
                            <button
                              onClick={() => handlePlaySong(songIdStr)}
                              className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 p-2 rounded-full hover:scale-110 shadow-md hover:shadow-cyan-500/50 transition-all duration-300"
                              title="Play song"
                            >
                              <FaPlay className="text-white" />
                            </button>

                            <button
                              onClick={() => handleDownload(song)}
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-full hover:scale-110 shadow-md hover:shadow-blue-500/50 transition-all duration-300"
                              title="Download song"
                            >
                              <FaDownload className="text-white" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(song)}
                            className={`p-2 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-md ${
                              inCart
                                ? "bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-cyan-500/40"
                                : "bg-gradient-to-r from-yellow-500 to-orange-600 hover:shadow-yellow-500/40"
                            }`}
                            title={inCart ? "Already in cart" : "Add to cart"}
                          >
                            <FaShoppingCart />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </Layout>
    </div>
  )
}

export default Album
