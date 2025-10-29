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
  const { loading } = usePayment();
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
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const paidSongs = cart.filter((item) => item.price > 0);
      if (paidSongs.length === 0) {
        toast.error("Cart contains only free songs. No payment needed!");
        setCheckoutProcessing(false);
        return;
      }

      // CRITICAL FIX: Load Razorpay script before using it
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setCheckoutProcessing(false);
        return;
      }

      const axios = (await import("axios")).default;
      const { data: orderData } = await axios.post(
        "http://localhost:9000/api/v1/payment/create-bulk-order",
        { songIds: paidSongs.map((item) => item.id) },
        { headers: { token } }
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
            const { data: verifyData } = await axios.post(
              "http://localhost:9000/api/v1/payment/verify-bulk",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { token } }
            );

            if (verifyData.success) {
              await fetchUser();
              clearCart();
              toast.success("All songs purchased successfully!");
              navigate("/my-purchases");
            }
          } catch (error: any) {
            toast.error(
              error.response?.data?.message || "Payment verification failed"
            );
          }
          setCheckoutProcessing(false);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#22c55e" },
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-gray-400">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            {cartCount > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Add some songs to get started!</p>
              <button
                onClick={() => navigate("/")}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
              >
                Browse Songs
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <CartItem key={item.id} item={item} onRemove={removeFromCart} />
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Items ({cartCount})</span>
                      <span className="flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span>₹ 0.00</span>
                    </div>
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="flex items-center">
                          <IndianRupee className="w-5 h-5" />
                          {totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutProcessing || loading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
                  >
                    {checkoutProcessing || loading ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 inline mr-2" />
                        Proceed to Checkout
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
      </div>
    </Layout>
  );
};

export default Cart;
