import Layout from "../components/Layout"
import { useSongData } from "../context/SongContext"
import AlbumCard from "../components/AlbumCard";
import SongCard from "../components/SongCard";



const Home = () => {
  const {albums , songs} = useSongData()
  return (
    <div>
      <Layout>
        {/* Featured Charts Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
            <h1 className="font-bold text-3xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Featured Charts
            </h1>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {
              albums?.map((e,i)=>{
                return <AlbumCard key={i} image={e.thumbnail} name={e.title} description={e.description} id={e.id}/>
              })
            }
          </div>
        </div>


        {/* Today's Hits Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full"></div>
            <h1 className="font-bold text-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Today's Hits
            </h1>
            <div className="h-1 flex-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
            {
              songs?.map((e,i)=>{
                return <SongCard key={i} image={e.thumbnail} name={e.title} description={e.description} id={e.id}/>
              })
            }
          </div>
        </div>
      </Layout>
      
    </div>
  )
}

export default Home