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
    <div
      className="
        flex items-center justify-between 
        bg-gradient-to-r from-gray-900/60 to-gray-800/60 
        border border-gray-700/40 backdrop-blur-md 
        rounded-2xl shadow-md p-4 mb-4 hover:shadow-lg
        transition-all duration-300 hover:from-gray-800/80 hover:to-gray-700/80
      "
    >
      {/* Thumbnail */}
      <div className="flex items-center gap-4 w-2/5">
        <div className="relative">
          <img
            src={item.thumbnail || "/download.jpg"}
            alt={item.title}
            className="w-16 h-16 rounded-xl object-cover shadow-md"
          />
        </div>

        {/* Song Info */}
        <div>
          <h3 className="text-white text-lg font-semibold">{item.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-1 text-pink-400 font-semibold">
        <IndianRupee className="w-4 h-4" />
        <span>{item.price.toFixed(2)}</span>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="
          bg-gradient-to-r from-red-600/40 to-pink-600/40 
          hover:from-red-600 hover:to-pink-600 
          transition-all p-2 rounded-full 
          text-white shadow-sm hover:shadow-md
        "
        title="Remove from cart"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartItem;
