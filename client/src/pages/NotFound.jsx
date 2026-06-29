import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Layers } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="blur-blob blur-blob-blue w-96 h-96 top-10 -left-20" />
      <div className="blur-blob blur-blob-purple w-96 h-96 bottom-10 -right-20" />
      <div className="guide-lines" />

      <div className="text-center max-w-md mx-auto relative z-10">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[140px] sm:text-[180px] font-black leading-none bg-gradient-to-b from-white/20 to-white/[0.02] bg-clip-text text-transparent select-none">
            404
          </h1>
          {/* Floating dots */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-8 left-8 w-2 h-2 rounded-full bg-brand-500/30 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="absolute top-4 right-10 w-1.5 h-1.5 rounded-full bg-purple-500/30 animate-bounce" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-12 left-12 w-3 h-3 rounded-full bg-brand-500/20 animate-bounce" style={{ animationDelay: '0.6s' }} />
          </div>
        </div>

        {/* Planet illustration */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/10" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full border border-brand-500/10 transform -rotate-12" />
          <div className="absolute top-0 left-4 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute top-6 right-2 w-1 h-1 bg-brand-400/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        </div>

        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-xs text-gray-500 mb-8 leading-relaxed font-light max-w-xs mx-auto">
          The page you're looking for doesn't exist in this workspace.
          Let's navigate you back to familiar ground.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="btn-primary py-2.5 px-6 text-xs inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary py-2.5 px-6 text-xs inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <p className="text-[10px] text-gray-600 mt-12 font-light">
          If you believe this is an error, contact workspace support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
