import { useNavigate } from "react-router-dom"
import { useUserData } from "../context/UserContext"
import { useCart } from "../context/CartContext"
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa"

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuth, logoutUser } = useUserData()
  const { cartCount } = useCart()

  const logoutUserHandler = () => {
    logoutUser()
  }

  return (
    <nav className="w-full backdrop-blur-lg bg-white/10 border-b border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      <div className="flex justify-between items-center px-6 md:px-10 py-3">
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-4">
          <img
            src="/left_arrow.png"
            className="w-8 h-8 p-1 cursor-pointer rounded-full bg-white/10 hover:bg-white/20 transition duration-300 shadow-md hover:scale-105 active:scale-95"
            onClick={() => navigate(-1)}
            alt="Go back"
          />

          <img
            src="/right_arrow.png"
            className="w-8 h-8 p-1 cursor-pointer rounded-full bg-white/10 hover:bg-white/20 transition duration-300 shadow-md hover:scale-105 active:scale-95"
            onClick={() => navigate(+1)}
            alt="Go forward"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 md:gap-5 text-white text-sm md:text-base">
          
          {/* Cart Button */}
          {isAuth && (
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/30 to-purple-600/30 hover:from-indigo-500/50 hover:to-purple-600/50 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              <FaShoppingCart className="text-lg" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-xs px-2 py-0.5 rounded-full text-white font-semibold animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* My Purchases */}
          {isAuth && (
            <button
              onClick={() => navigate("/my-purchases")}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/30 to-blue-600/30 hover:from-cyan-500/50 hover:to-blue-600/50 backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <FaShoppingBag className="text-lg" />
              <span className="hidden sm:inline">My Purchases</span>
            </button>
          )}

          {/* Auth Action */}
          {isAuth ? (
            <p
              onClick={logoutUserHandler}
              className="cursor-pointer px-3 md:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-red-400 font-medium transition-all duration-300 hover:scale-105 shadow-[0_0_10px_rgba(255,255,255,0.15)]"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => navigate("/login")}
              className="cursor-pointer px-3 md:px-4 py-2 rounded-xl bg-gradient-to-r from-green-400/30 to-emerald-600/30 hover:from-green-400/50 hover:to-emerald-600/50 text-green-300 font-medium transition-all duration-300 hover:scale-105 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
            >
              Login
            </p>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar