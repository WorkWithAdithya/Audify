import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { usePayment } from "../context/PaymentContext";
import { useSongData } from "../context/SongContext";
import Loading from "../components/Loading";
import { FaPlay } from "react-icons/fa";
import { IndianRupee, Calendar, CreditCard } from "lucide-react";

const MyPurchases = () => {
  const { getPurchaseHistory, loading } = usePayment();
  const { setSelectedSong, setIsPlaying } = useSongData();
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      const data = await getPurchaseHistory();
      setPurchases(data);
    };

    fetchPurchases();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePlay = (songId: string) => {
    setSelectedSong(songId);
    setIsPlaying(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="mt-6 sm:mt-8 md:mt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-lg opacity-40 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl">
              <CreditCard className="w-6 h-6 text-black" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              My Purchases
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {purchases.length} {purchases.length === 1 ? "song" : "songs"} purchased
            </p>
          </div>
        </div>

        {/* Purchases List */}
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-7xl mb-6 opacity-20">ðŸ›’</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No purchases yet</h3>
            <p className="text-gray-500 mb-6">Start building your music collection!</p>
            <button
              onClick={() => window.location.href = "/"}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Browse Songs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6 hover:border-purple-500/30 transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Song Thumbnail */}
                  {purchase.song && (
                    <div className="relative group/img">
                      <img
                        src={purchase.song.thumbnail || "/download.jpg"}
                        alt={purchase.song.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-purple-500/30 group-hover:border-cyan-500/50 transition-all duration-300"
                      />
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handlePlay(purchase.song_id.toString())}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/50"
                        >
                          <FaPlay />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Purchase Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                        {purchase.song?.title || "Unknown Song"}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {purchase.song?.description || "No description"}
                      </p>
                    </div>

                    {/* Purchase Info */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-white font-bold">{purchase.amount}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">Purchased:</span>
                        <span className="text-white">{formatDate(purchase.created_at)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${purchase.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                        <span className={purchase.status === "completed" ? "text-green-400" : "text-yellow-400"}>
                          {purchase.status === "completed" ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Play Button (Desktop) */}
                  {purchase.song && (
                    <div className="hidden sm:flex items-center">
                      <button
                        onClick={() => handlePlay(purchase.song_id.toString())}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/50"
                      >
                        <FaPlay />
                      </button>
                    </div>
                  )}
                </div>

                {/* Transaction ID */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    Transaction ID: <span className="text-gray-400 font-mono">{purchase.razorpay_order_id}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Spent Summary */}
        {purchases.length > 0 && (
          <div className="mt-8 backdrop-blur-xl bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                  ₹ {purchases.reduce((total, p) => total + parseFloat(p.amount), 0).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Songs Owned</p>
                <p className="text-3xl font-bold text-white">{purchases.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPurchases;