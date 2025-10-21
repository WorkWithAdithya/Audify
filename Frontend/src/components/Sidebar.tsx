import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { useUserData } from "../context/UserContext";
const Sidebar = () => {

    const navigate = useNavigate();

    const {user} = useUserData()

  return (
    <div className="w-[25%] h-full p-2 flex-col text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
      
      <div className="flex items-center gap-3 pl-8 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/home.png" alt="Logo" className="w-6 "/>
        <p className="font-bold">Home</p>


      </div>

       <div className="flex items-center gap-3 pl-8 cursor-pointer" >
        <img src="/search.png" alt="Search" className="w-6 "/>
        <p className="font-bold">Search</p>


      </div>

        
      
      
      </div>

      <div className="bg-[#121212] h-[85%] rounded">

        <div className="p-4 flex items-center justify-between">
            <div className="flex item-center gap-3">
                <img src="/stack.png" alt="Stack" className="w-8"/>
                <p className="font-bold">Your Library</p>

            </div>

            <div className="flex items-center gap-3">
                <img src="/arrow.png" alt="Add" className="w-6 cursor-pointer"/>
                <img src="/plus.png" alt="Add" className="w-6 cursor-pointer"/>
            </div>

        </div>

        <div onClick={() => navigate("/playlist")}>
            <PlayListCard />
        </div>

        <div className="p-4 m-2 bg-[#121212] rounded font-semibold flex flex-col items-start gap-1 pl-4 mt-4">
            <h1>Lets finsdome podcasr to follow</h1>
            <p className="font-light">We will keep you updated on new episodes</p>
            <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">Browse podcast</button>

        </div>
             {user && user.role === "admin" && <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4 cursor-pointer"onClick={()=>navigate("/admin/dashboard")}>Admin dashboard</button>}


      </div>
    </div>
  )
}

export default Sidebar
