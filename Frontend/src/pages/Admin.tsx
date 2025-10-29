import type { ChangeEvent } from "react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Music2, Album, Home, Upload, Image, Plus, Trash2, IndianRupee } from "lucide-react";

const server = "http://localhost:7000";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();

  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [album, setAlbum] = useState<string>("");
  const [price, setPrice] = useState<string>(""); // NEW
  const [file, setFile] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const addAlbumHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchAlbums();
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  };

  const addSongHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("album", album);
    formData.append("price", price || "0"); // NEW - default to 0 if empty

    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setFile(null);
      setAlbum("");
      setPrice(""); // NEW
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  };

  const addThumbnailHandler = async (id: string) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      fetchSongs();
      setBtnLoading(false);
      setFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setBtnLoading(true);
      try {
        const { data } = await axios.delete(`${server}/api/v1/album/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        fetchAlbums();
        setBtnLoading(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
        setBtnLoading(false);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setBtnLoading(true);
      try {
        const { data } = await axios.delete(`${server}/api/v1/song/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        setBtnLoading(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
        setBtnLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-green-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 p-4 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                <Music2 className="w-6 h-6 text-black" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage your music library</p>
            </div>
          </div>
          <Link
            to={"/"}
            className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black font-bold py-2.5 px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Add Album Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Album className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">Add Album</h2>
          </div>
          <form
            className="backdrop-blur-xl bg-gray-900/40 border border-gray-800 p-6 rounded-2xl shadow-xl"
            onSubmit={addAlbumHandler}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-green-500 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'album-title' ? 'opacity-20' : 'opacity-0'}`}></div>
                <input
                  type="text"
                  placeholder="Album Title"
                  className="auth-input relative"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedField('album-title')}
                  onBlur={() => setFocusedField('')}
                  required
                />
              </div>
              <div className="relative">
                <div className={`absolute inset-0 bg-green-500 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'album-desc' ? 'opacity-20' : 'opacity-0'}`}></div>
                <input
                  type="text"
                  placeholder="Description"
                  className="auth-input relative"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedField('album-desc')}
                  onBlur={() => setFocusedField('')}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 relative">
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Image className="w-4 h-4" />
                  Choose Thumbnail
                </label>
                <input
                  type="file"
                  onChange={fileChangeHandler}
                  className="auth-input"
                  accept="image/*"
                  required
                />
              </div>
              <button
                className="auth-btn group relative overflow-hidden flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[140px]"
                disabled={btnLoading}
              >
                {btnLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Add Album</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Add Song Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400">Add Song</h2>
          </div>
          <form
            className="backdrop-blur-xl bg-gray-900/40 border border-gray-800 p-6 rounded-2xl shadow-xl"
            onSubmit={addSongHandler}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-green-500 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'song-title' ? 'opacity-20' : 'opacity-0'}`}></div>
                <input
                  type="text"
                  placeholder="Song Title"
                  className="auth-input relative"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedField('song-title')}
                  onBlur={() => setFocusedField('')}
                  required
                />
              </div>
              <div className="relative">
                <div className={`absolute inset-0 bg-green-500 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'song-desc' ? 'opacity-20' : 'opacity-0'}`}></div>
                <input
                  type="text"
                  placeholder="Description"
                  className="auth-input relative"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedField('song-desc')}
                  onBlur={() => setFocusedField('')}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-green-500 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'album-select' ? 'opacity-20' : 'opacity-0'}`}></div>
                <select
                  className="auth-input relative"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  onFocus={() => setFocusedField('album-select')}
                  onBlur={() => setFocusedField('')}
                  required
                >
                  <option value="">Choose Album</option>
                  {albums?.map((e: any, i: number) => {
                    return (
                      <option value={e.id} key={i}>
                        {e.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* NEW: Price Input */}
              <div className="relative">
                <div className={`absolute inset-0 bg-yellow-500 rounded-lg blur-sm transition-opacity duration-300 ${focusedField === 'price' ? 'opacity-20' : 'opacity-0'}`}></div>
                <div className="relative flex items-center">
                  <IndianRupee className="absolute left-3 w-4 h-4 text-gray-400 z-10" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price (0 for free)"
                    className="auth-input relative pl-10"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onFocus={() => setFocusedField('price')}
                    onBlur={() => setFocusedField('')}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Upload className="w-4 h-4" />
                  Choose Audio File
                </label>
                <input
                  type="file"
                  onChange={fileChangeHandler}
                  className="auth-input"
                  accept="audio/*"
                  required
                />
              </div>
            </div>
            <button
              className="auth-btn group relative overflow-hidden flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[140px]"
              disabled={btnLoading}
            >
              {btnLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Add Song</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Added Albums Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <Album className="w-6 h-6" />
            Albums ({albums?.length || 0})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {albums?.map((e, i) => {
              return (
                <div
                  className="group relative backdrop-blur-xl bg-gray-900/60 border border-gray-800 p-4 rounded-xl shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:scale-105"
                  key={i}
                >
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <img
                      src={e.thumbnail}
                      className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300"
                      alt={e.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="text-lg font-bold text-white truncate mb-1">
                    {e.title}
                  </h4>
                  <p className="text-sm text-gray-400 truncate mb-3">
                    {e.description}
                  </p>
                  <button
                    disabled={btnLoading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 rounded-lg transition-all duration-300 group/btn"
                    onClick={() => deleteAlbum(e.id)}
                  >
                    <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-semibold">Delete</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Added Songs Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <Music2 className="w-6 h-6" />
            Songs ({songs?.length || 0})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {songs?.map((e, i) => {
              const songPrice = e.price ? parseFloat(e.price.toString()) : 0;
              return (
                <div  
                  className="group relative backdrop-blur-xl bg-gray-900/60 border border-gray-800 p-4 rounded-xl shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:scale-105"
                  key={i}
                >
                  {/* NEW: Price Badge */}
                  {songPrice > 0 && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {songPrice}
                    </div>
                  )}
                  {songPrice === 0 && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                      FREE
                    </div>
                  )}

                  {e.thumbnail ? (
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={e.thumbnail}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300"
                        alt={e.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-3 h-52 flex flex-col justify-center items-center gap-3">
                      <Image className="w-8 h-8 text-gray-500" />
                      <input
                        type="file"
                        onChange={fileChangeHandler}
                        className="text-xs"
                        accept="image/*"
                      />
                      <button
                        className="auth-btn text-sm py-1.5"
                        disabled={btnLoading}
                        onClick={() => addThumbnailHandler(e.id)}
                      >
                        {btnLoading ? "Adding..." : "Add Thumbnail"}
                      </button>
                    </div>
                  )}

                  <h4 className="text-lg font-bold text-white truncate mb-1">
                    {e.title}
                  </h4>
                  <p className="text-sm text-gray-400 truncate mb-3">
                    {e.description}
                  </p>
                  <button
                    disabled={btnLoading}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 rounded-lg transition-all duration-300 group/btn"
                    onClick={() => deleteSong(e.id)}
                  >
                    <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-semibold">Delete</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;