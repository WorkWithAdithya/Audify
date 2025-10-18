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
    <div onClick={()=>navigate("/album/"+id)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
    <img src = {image} className='rounded w-[160px]'/>
    <p className='font-bold mt-2 mb-1'>{name.slice(0,12)}....</p>  
    <p className='text-slate-200 text-sm'>{description.slice(0,18)}....</p>      
    
    </div>
  )
}

export default AlbumCard
