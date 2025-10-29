import React from "react";
import { FaTrash } from "react-icons/fa";
import { IndianRupee } from "lucide-react";
import type { CartItem as CartItemType } from "../context/CartContext";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  return (
    <div className="backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-2xl p-4 hover:border-purple-500/30 transition-all duration-300 group">
      <div className="flex gap-4 items-center">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={item.thumbnail || "/download.jpg"}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-xl shadow-lg border-2 border-purple-500/30 group-hover:border-cyan-500/50 transition-all duration-300"
          />
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 truncate">
            {item.title}
          </h3>
          <p className="text-sm text-gray-400 truncate mt-1">
            {item.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
          <IndianRupee className="w-5 h-5" />
          <span>{item.price.toFixed(2)}</span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-red-500/50 group/btn"
          title="Remove from cart"
        >
          <FaTrash className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;