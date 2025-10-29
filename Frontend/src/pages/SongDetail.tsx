import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext";
import { usePayment } from "../context/PaymentContext";
import Loading from "../components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlay, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { IndianRupee, Music2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SongDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedSong, setIsPlaying } = useSongData();
  const { user, isAuth, fetchUser } = useUserData();
  const { createOrder, verifyPayment, loading } = usePayment();
  
  const [song, setSong] = useState<any>(null);
  const [songLoading, setSongLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/v1/song/${id}`);
        setSong(data);
      } catch (error) {
        toast.error("Failed to load song");
      } finally {
        setSongLoading(false);
      }
    };

    if (id) {
      fetchSongDetails();
    }
  }, [id]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    if (!isAuth) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }

    setPaymentProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        setPaymentProcessing(false);
        return;
      }

      // Create order
      const orderData = await createOrder(id!);

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Audiffy",
        description: `Purchase ${song.title}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Payment successful - verify
          const verified = await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );

          if (verified) {
            // Refresh user data to get updated purchasedSongs
            await fetchUser();
            toast.success("Purchase successful! You can now play this song.");
            navigate("/my-purchases");
          }
          setPaymentProcessing(false);
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
            setPaymentProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
      setPaymentProcessing(false);
    }
  };

  const handlePlay = () => {
    setSelectedSong(id!);
    setIsPlaying(true);
  };

  if (songLoading) {
    return <Loading />;
  }

  if (!song) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-gray-400">Song not found</h2>
        </div>
      </Layout>
    );
  }

  const songPrice = song.price ? parseFloat(song.price) : 0;
  const isFree = songPrice === 0;
  const hasPurchased = user?.purchasedSongs?.includes(id || "");

  return (
    <Layout>
      <div className="mt-10 max-w-4xl mx-auto">
        {/* Song Details Card */}
        <div className="backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Album Art */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <img
                src={song.thumbnail || "/download.jpg"}
                alt={song.title}
                className="relative w-full md:w-72 h-72 object-cover rounded-2xl shadow-2xl border-2 border-purple-500/30 group-hover:border-cyan-500/50 transition-all duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-4 right-4">
                {isFree ? (
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    FREE
                  </span>
                ) : hasPurchased ? (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <FaCheckCircle /> OWNED
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {songPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Music2 className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400 uppercase tracking-wider">Song</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {song.title}
                </h1>
                
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  {song.description}
                </p>

                {!isFree && !hasPurchased && (
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                    <p className="text-yellow-400 font-semibold flex items-center gap-2">
                      <IndianRupee className="w-5 h-5" />
                      Price: â‚¹{songPrice}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Purchase once, listen forever
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {isFree || hasPurchased ? (
                  <button
                    onClick={handlePlay}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 flex items-center justify-center gap-3"
                  >
                    <FaPlay />
                    <span>Play Now</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={paymentProcessing || loading}
                    className="flex-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentProcessing || loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart />
                        <span>Buy for â‚¹{songPrice}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {hasPurchased && (
          <div className="mt-6 backdrop-blur-xl bg-green-900/20 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-400 text-2xl" />
              <div>
                <h3 className="text-green-400 font-bold text-lg">You own this song</h3>
                <p className="text-gray-400 text-sm">You can play this song anytime from your library</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SongDetail;