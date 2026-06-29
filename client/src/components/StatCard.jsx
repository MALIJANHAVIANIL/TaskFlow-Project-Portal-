const StatCard = ({ icon: Icon, label, value, trend, trendUp, color = 'blue' }) => {
  const colorMap = {
    blue: {
      bg: 'bg-brand-500/10 text-brand-400 border border-brand-500/20',
      glow: 'shadow-brand-500/5',
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      glow: 'shadow-purple-500/5',
    },
    green: {
      bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      glow: 'shadow-emerald-500/5',
    },
    red: {
      bg: 'bg-red-500/10 text-red-400 border border-red-500/20',
      glow: 'shadow-red-500/5',
    },
    orange: {
      bg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      glow: 'shadow-orange-500/5',
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`glass-card p-6 hover:border-brand-500/10 hover:shadow-2xl ${colors.glow} hover:-translate-y-0.5 transition-all duration-300 cursor-default group`}>
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${colors.bg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-xl font-bold text-white tracking-tight">
              {value}
            </p>
            {trend !== undefined && trend !== null && (
              <span
                className={`text-[10px] font-bold ${
                  trendUp
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              >
                {trendUp ? '+' : '-'}{trend}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
