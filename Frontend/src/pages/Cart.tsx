import { useState } from "react";
import Layout from "../components/Layout";
import { useCart } from "../context/CartContext";
import { usePayment } from "../context/PaymentContext";
import { useUserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import toast from "react-hot-toast";
import { ShoppingCart, IndianRupee, Trash2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Cart = () => {
  const { cart, cartCount, totalAmount, removeFromCart, clearCart } = useCart();
  const { isAuth, user, fetchUser } = useUserData();
  const { createBulkOrder, verifyBulkPayment, loading } = usePayment(); // ✅ FIXED
  const navigate = useNavigate();
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
  if (!isAuth) {
    toast.error("Please login to checkout");
    navigate("/login");
    return;
  }

  if (cart.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  setCheckoutProcessing(true);

  try {
    // Get token
    const token = localStorage.getItem("token");
    
    // Check if token exists
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const paidSongs = cart.filter(item => item.price > 0);
  
  if (paidSongs.length === 0) {
    toast.error("Cart contains only free songs. No payment needed!");
    return;
  }

  const songId = paidSongs.map(item => String(item.id));
  
  console.log("🛒 Checkout with songs:", songId);
  console.log("💰 Total amount:", paidSongs.reduce((sum, item) => sum + item.price, 0));


    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway");
      setCheckoutProcessing(false);
      return;
    }

    // Get all song IDs from cart
    const songIds = cart.map((item) => item.id);

    // Import axios
    const axios = (await import("axios")).default;

    // Create bulk order - DIRECT CALL (simpler for mini project)
    const { data: orderData } = await axios.post(
      "http://localhost:9000/api/v1/payment/create-bulk-order",
      { songIds },
      {
        headers: {
          token: token, // Pass token directly
        },
      }
    );

    const options = {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Audiffy",
      description: `Purchase ${cart.length} song(s)`,
      order_id: orderData.order.id,
      handler: async function (response: any) {
        try {
          // Verify payment - DIRECT CALL
          const { data: verifyData } = await axios.post(
            "http://localhost:9000/api/v1/payment/verify-bulk",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                token: token,
              },
            }
          );

          if (verifyData.success) {
            // Refresh user data
            await fetchUser();
            // Clear cart
            clearCart();
            toast.success("All songs purchased successfully!");
            navigate("/my-purchases");
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Payment verification failed");
        }
        setCheckoutProcessing(false);
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: "#22c55e",
      },
      modal: {
        ondismiss: function () {
          setCheckoutProcessing(false);
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error: any) {
    console.error("Checkout error:", error);
    toast.error(error.response?.data?.message || "Checkout failed");
    setCheckoutProcessing(false);
  }
};
  return (
    <Layout>
      <div className="mt-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-xl blur-lg opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>

          {/* Clear Cart Button */}
          {cartCount > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>

        {/* Cart Content */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-7xl mb-6 opacity-20">ðŸ›’</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some songs to get started!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Browse Songs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-2xl p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Items ({cartCount})</span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>₹ 0.00</span>
                  </div>
                  <hr className="border-gray-700" />
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <IndianRupee className="w-5 h-5" />
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutProcessing || loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkoutProcessing || loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Proceed to Checkout</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;