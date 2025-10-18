import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import { useSongData, type Song } from "../context/SongContext"
import { useUserData } from "../context/UserContext"
import { FaBookmark, FaPlay } from "react-icons/fa"
import Loading from "../components/Loading"


const PlayList = () => {

     const {songs , setIsPlaying , setSelectedSong , loading} = useSongData()

     const {user , addToPlaylist} = useUserData()

     const [myPlayList , setMyPlayList] = useState<Song[]>([])

     useEffect (()=>{
        if(songs && user?.playlist){
            const filteredSongs = songs.filter((songs)=>
                user.playlist.includes(songs.id.toString())
            )
            setMyPlayList(filteredSongs)
        }
     },[songs, user])
  return (
    <div>
      

         <div>
      <Layout>{myPlayList && (
        <>
        {
            loading? <Loading/> : <>
            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
            
              <img src={"/doenload.jpeg"} className="w-48 rounded" alt=""/>

                
            
            <div className="flex flex-col">
                <p>Playlist</p>
                <h2 className="text-3xl font-bold mb-4 md:text-5xl">
                    {user?.name}Playlist
                </h2>
                <h4>Your favorite songs</h4>
                <p className="mt-1">
                    <img src="/logo.png" className="inline-block" alt=""/>
                </p>
            </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                <p> 
                    <b className="mr-4">#</b>
                  
                </p>
                <p className="hidden sm:block ">Description</p>
                <p className="text-center"> Actions</p>
            </div>
        
             <hr />
    {
        myPlayList && myPlayList.map((song, index) => {
            return (
                <div 
                    className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer" 
                    key={index}
                >
                    <p className="text-white">
                        <b className="mr-4 text-[#a7a7a7]">
                            {index + 1}
                        </b>
                        <img src={song.thumbnail ? song.thumbnail : "/downlaod.jpg"} 
                        className="inline w-10 mr-5"
                        alt="" />
                        {" "} {song.title}
                    </p>
                    < p className="text-[15px] hidden sm:block">{song.description.slice(0,30)}....</p>

                    <p className="flex justify-center items-center gap-5">
                         <button className="text-[15px] text-center" onClick={()=>{
                            addToPlaylist(song.id)
                        }}><FaBookmark /></button>


                     <button className="text-[15px] text-center" onClick={()=>{
                        setSelectedSong(song.id)
                        setIsPlaying(true)
                     }}><FaPlay /></button>

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
  
    </div>
  )
}

export default PlayList
