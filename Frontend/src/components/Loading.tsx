const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Main loading spinner */}
      <div className="relative z-10">
        {/* Outer rotating ring */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative">
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-cyan-500 border-l-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          <div className="absolute inset-4 border-4 border-transparent border-b-pink-500 border-r-cyan-500 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
          
          {/* Center pulsing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
          </div>
        </div>
      </div>

      {/* Loading text with gradient */}
      <div className="mt-8 sm:mt-10 md:mt-12 text-center z-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse mb-2">
          Loading
        </h2>
        <div className="flex gap-1 justify-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
          <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
        </div>
      </div>

      {/* Audio wave visualization bars */}
      <div className="flex gap-1 sm:gap-1.5 md:gap-2 mt-6 sm:mt-8 z-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 sm:w-1.5 bg-gradient-to-t from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse"
            style={{
              height: `${20 + Math.random() * 20}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.6s'
            }}
          ></div>
        ))}
      </div>

      {/* Glowing ring effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border border-purple-500/20 rounded-full animate-ping"></div>
      </div>
    </div>
  )
}

export default Loading