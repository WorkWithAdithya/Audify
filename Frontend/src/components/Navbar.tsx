import { useNavigate } from "react-router-dom"
import { useUserData } from "../context/UserContext"
import { useCart } from "../context/CartContext"
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa"

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuth, logoutUser } = useUserData()
  const { cartCount } = useCart()

  const logoutUserHandler = () =>{
    logoutUser()
  }

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/left_arrow.png"
            className="w-8 h-8 sm:w-9 sm:h-9 p-2 rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-900 hover:from-purple-900/30 hover:via-black hover:to-cyan-900/30 cursor-pointer backdrop-blur-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
            onClick={() => navigate(-1)}
          />

          <img
            src="/right_arrow.png"
            className="w-8 h-8 sm:w-9 sm:h-9 p-2 rounded-xl bg-gradient-to-br from-gray-900 via-black to-gray-900 hover:from-cyan-900/30 hover:via-black hover:to-purple-900/30 cursor-pointer backdrop-blur-xl border border-gray-800/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
            onClick={() => navigate(+1)}
          />
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Cart Button */}
          {isAuth && (
            <button
              onClick={() => navigate("/cart")}
              className="relative px-4 sm:px-5 py-1.5 sm:py-2 cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 border border-purple-400/30 flex items-center gap-2"
            >
              <FaShoppingCart className="text-sm sm:text-base" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* My Purchases Button */}
          {isAuth && (
            <button
              onClick={() => navigate("/my-purchases")}
              className="px-4 sm:px-5 py-1.5 sm:py-2 cursor-pointer bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50 border border-orange-400/30 flex items-center gap-2"
            >
              <FaShoppingBag className="text-sm sm:text-base" />
              <span className="hidden sm:inline">My Purchases</span>
            </button>
          )}

          {isAuth ? (
            <p onClick={logoutUserHandler} className="px-4 sm:px-6 py-1.5 sm:py-2 cursor-pointer bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/50 border border-pink-400/30">
              Logout
            </p>
          ) : (
            <p
              onClick={() => navigate("/login")}
              className="px-4 sm:px-6 py-1.5 sm:py-2 cursor-pointer bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 text-white text-sm sm:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 border border-cyan-400/30"
            >
              Login
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar