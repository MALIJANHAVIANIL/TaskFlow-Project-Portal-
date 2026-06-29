import { Sparkles } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = true, size = 'lg' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer loading ring */}
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin`}
        />
        {/* Inner pulsing star icon */}
        <div className="absolute">
          <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0c0c]/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  );
};

export default LoadingSpinner;
