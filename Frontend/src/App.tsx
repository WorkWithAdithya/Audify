import {BrowserRouter , Route , Routes} from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import { useUserData } from './context/UserContext';
import Register from './pages/Register';
import Album from './pages/Album';
import PlayList from './pages/PlayList';
import Admin from './pages/Admin';
import SongDetail from './pages/SongDetail';
import MyPurchases from './pages/MyPurchases';
import Cart from './pages/Cart';

const App = () =>{
    const {isAuth} = useUserData()
return (
<BrowserRouter>
<Routes>
    <Route path = '/' element ={<Home/>}/>
    <Route path = '/album/:id' element ={<Album/>}/>
    <Route path = '/playlist' element ={isAuth?<PlayList/> : <Login/>}/>
    <Route path = '/admin/dashboard' element ={isAuth?<Admin/> : <Login/>}/>
    
    {/* Payment & Cart routes */}
    <Route path = '/song/:id' element ={<SongDetail/>}/>
    <Route path = '/cart' element ={isAuth?<Cart/> : <Login/>}/>
    <Route path = '/my-purchases' element ={isAuth?<MyPurchases/> : <Login/>}/>

    <Route path = '/login' element ={isAuth?<Home/>:<Login/>}/>
    <Route path = '/register' element ={isAuth?<Home/>:<Register/>}/>

</Routes>
</BrowserRouter>
)
};

export default App;