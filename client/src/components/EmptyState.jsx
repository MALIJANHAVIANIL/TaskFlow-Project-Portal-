import { FolderOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-brand-400" />
      </div>
      <h3 className="text-sm font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-xs text-gray-500 text-center max-w-sm mb-6 font-light">
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary py-2 px-5 text-xs">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
