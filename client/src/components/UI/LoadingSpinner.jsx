export default function LoadingSpinner({ message = 'Analyzing repository...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      {/* Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-dark-500"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-blue animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-purple animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-accent-cyan animate-spin" style={{ animationDuration: '2s' }}></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-accent-blue animate-pulse-glow"></div>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-300 text-lg font-medium mb-2">{message}</p>
      <p className="text-gray-500 text-sm">This may take a moment for large repositories</p>

      {/* Progress dots */}
      <div className="loading-dots mt-4">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
