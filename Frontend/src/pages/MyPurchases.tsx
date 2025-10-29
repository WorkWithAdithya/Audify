import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { usePayment } from "../context/PaymentContext";
import { useSongData } from "../context/SongContext";
import Loading from "../components/Loading";
import { FaDownload, FaPlay } from "react-icons/fa";
import { IndianRupee, Calendar, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

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

  const handleDownload = async (song: any, songId: string) => {
    try {
      toast.loading("Preparing download...");

      if (!song || !song.audio) {
        toast.dismiss();
        toast.error("Audio file not available");
        return;
      }

      const link = document.createElement("a");
      link.href = song.audio;
      link.download = `${song.title}.mp3`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss();
      toast.success(`Downloading ${song.title}...`);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to download song");
      console.error("Download error:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <Layout>
      <div className="min-h-screen px-4 sm:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-purple-600/20">
            <CreditCard className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
              My Purchases
            </h1>
            <p className="text-gray-400 text-sm">
              {purchases.length} {purchases.length === 1 ? "song" : "songs"} purchased
            </p>
          </div>
        </div>

        {/* Empty state */}
        {purchases.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800 backdrop-blur-md">
            <div className="flex justify-center mb-4">
              <CreditCard className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No purchases yet</h3>
            <p className="text-gray-400 mb-6">Start building your music collection!</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full transition-colors"
            >
              Browse Songs
            </button>
          </div>
        ) : (
          <>
            {/* Purchases List */}
            <div className="space-y-6">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="p-4 sm:p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-green-600/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                    {/* Thumbnail */}
                    {purchase.song && (
                      <div className="relative group">
                        <img
                          src={purchase.song.thumbnail || "/download.jpg"}
                          alt={purchase.song.title}
                          className="w-32 h-32 rounded-xl object-cover shadow-md group-hover:opacity-90 transition"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handlePlay(purchase.song_id.toString())}
                            className="bg-green-500 text-black p-3 rounded-full shadow-md hover:bg-green-400"
                          >
                            <FaPlay />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 w-full space-y-2">
                      <h3 className="text-xl font-semibold text-white">
                        {purchase.song?.title || "Unknown Song"}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {purchase.song?.description || "No description available"}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-white font-semibold">
                            ₹ {purchase.amount}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-400">Purchased:</span>
                          <span className="text-white">
                            {formatDate(purchase.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              purchase.status === "completed"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          <span
                            className={
                              purchase.status === "completed"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {purchase.status === "completed"
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {purchase.song && (
                      <div className="flex items-center gap-4 ml-auto">
                        <button
                          onClick={() => handlePlay(purchase.song_id.toString())}
                          className="p-2 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-400 transition"
                        >
                          <FaPlay />
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(purchase.song, purchase.song_id.toString())
                          }
                          className="p-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
                          title="Download song"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Transaction ID */}
                  <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                    Transaction ID:{" "}
                    <span className="text-gray-400 font-mono">
                      {purchase.razorpay_order_id}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-10 p-6 bg-gray-900/40 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{" "}
                  {purchases
                    .reduce((total, p) => total + parseFloat(p.amount), 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Songs Owned</p>
                <p className="text-3xl font-bold text-white">
                  {purchases.length}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyPurchases;
