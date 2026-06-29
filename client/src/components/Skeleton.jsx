export const SkeletonCard = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-white/5 rounded-lg w-2/3" />
            <div className="h-5 bg-white/5 rounded-full w-14" />
          </div>
          <div className="space-y-2.5">
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-4/5" />
          </div>
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.04]">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="w-6 h-6 bg-white/5 rounded-full border border-[#0c0c0c]" />
              ))}
            </div>
            <div className="h-3 bg-white/5 rounded w-16" />
          </div>
        </div>
      ))}
    </>
  );
};

export const SkeletonTable = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="p-4 border-b border-white/[0.04]">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-3 bg-white/5 rounded flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-white/[0.02] last:border-0">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-3 bg-white/5 rounded flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2.5 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-white/5 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
};

export const SkeletonStatCard = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-white/5 rounded w-16" />
              <div className="h-5 bg-white/5 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
