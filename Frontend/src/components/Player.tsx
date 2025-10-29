import { useEffect, useRef, useState } from "react"
import { useSongData } from "../context/SongContext"
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr"
import { FaPause, FaPlay } from "react-icons/fa"

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    prevSong,
    nextSong,
  } = useSongData()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [volume, setVolume] = useState<number>(1)
  const [progress, setProgress] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetaData = () => {
      setDuration(audio.duration || 0)
    }

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime || 0)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetaData)
    audio.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [song])

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const volumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
    setProgress(newTime)
  }

  useEffect(() => {
    fetchSingleSong()
  }, [selectedSong])

  return (
    <div>
      {song && (
        <div className="h-[10%] bg-gradient-to-br from-black via-gray-900 to-black border-t border-purple-500/20 flex justify-between items-center text-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 backdrop-blur-xl">
          <div className="lg:flex items-center gap-3 sm:gap-4">
            {/* Rotating Vinyl Disk Animation */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              {/* Outer vinyl disk */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border-4 border-purple-500/30 shadow-lg shadow-purple-500/20 ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "3s" }}
              >
                <div className="absolute inset-2 rounded-full border-2 border-gray-700/50"></div>
                <div className="absolute inset-3 rounded-full border border-gray-600/30"></div>
                <div className="absolute inset-4 rounded-full border border-gray-500/20"></div>
              </div>

              {/* Center image */}
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "3s" }}
              >
                <img
                  src={song.thumbnail ? song.thumbnail : "/download.jpg"}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30"
                  alt=""
                />
              </div>

              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full shadow-lg shadow-purple-500/50"></div>
            </div>

            {/* âœ… Fixed nested <p> issue */}
            <div className="hidden md:block">
              <div className="font-bold text-sm lg:text-base bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {song.title}
              </div>
              <p className="text-xs lg:text-sm text-gray-400 font-normal mt-0.5">
                {song.description?.slice(0, 30)}...
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 m-auto">
            {song.audio && (
              <audio ref={audioRef} src={song.audio} autoPlay={isPlaying} />
            )}

            <div className="w-full items-center flex font-thin">
              <input
                type="range"
                min={"0"}
                max={"100"}
                className="progress-bar w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] h-1 appearance-none bg-gray-700 rounded-full outline-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125
                [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-cyan-400 [&::-moz-range-thumb]:to-purple-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50"
                value={(progress / duration) * 100 || 0}
                onChange={durationChange}
                style={{
                  background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${
                    (progress / duration) * 100
                  }%, rgb(55, 65, 81) ${(progress / duration) * 100}%, rgb(55, 65, 81) 100%)`,
                }}
              />
            </div>

            <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6">
              <span
                className="cursor-pointer text-purple-400 hover:text-cyan-400 transition-all duration-300 hover:scale-125 text-lg sm:text-xl md:text-2xl"
                onClick={prevSong}
              >
                <GrChapterPrevious />
              </span>

              <button
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-cyan-500/50"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <FaPause className="text-sm sm:text-base" />
                ) : (
                  <FaPlay className="text-sm sm:text-base" />
                )}
              </button>

              <span
                className="cursor-pointer text-purple-400 hover:text-cyan-400 transition-all duration-300 hover:scale-125 text-lg sm:text-xl md:text-2xl"
                onClick={nextSong}
              >
                <GrChapterNext />
              </span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-purple-400 hidden sm:block">
              📢                
            </span>
            <input
              type="range"
              className="w-12 sm:w-20 md:w-32 h-1 appearance-none bg-gray-700 rounded-full outline-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-cyan-400 [&::-moz-range-thumb]:to-purple-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-cyan-500/50"
              min={"0"}
              max={"100"}
              step={"0.01"}
              value={volume * 100}
              onChange={volumeChange}
              style={{
                background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${
                  volume * 100
                }%, rgb(55, 65, 81) ${volume * 100}%, rgb(55, 65, 81) 100%)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Player