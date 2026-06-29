import { 
  Pencil, 
  Trash2, 
  Clock, 
  Folder 
} from 'lucide-react';

const priorityStyles = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

const statusStyles = {
  todo: 'badge-todo',
  'in-progress': 'badge-progress',
  completed: 'badge-completed',
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const now = new Date();
    const due = new Date(task.dueDate);
    return due < now && task.status !== 'completed';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const priorityLabel = task.priority
    ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    : 'Medium';

  const statusLabel = task.status
    ? task.status
        .split('-')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')
    : 'To Do';

  const overdue = isOverdue();

  return (
    <div className="glass-card p-5 hover:border-brand-500/20 hover:bg-[#121212]/80 hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-xs font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1 flex-1">
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
              priorityStyles[task.priority] || priorityStyles.medium
            }`}
          >
            {priorityLabel}
          </span>
          <span
            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
              statusStyles[task.status] || statusStyles.todo
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-400 line-clamp-2 mb-3 leading-relaxed">
        {task.description || 'No description provided.'}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 mb-3 font-light">
        {task.project && (
          <div className="flex items-center gap-1">
            <Folder className="w-3 h-3" />
            <span className="truncate max-w-[120px]">
              {typeof task.project === 'object'
                ? task.project.title
                : task.project}
            </span>
          </div>
        )}
        {task.dueDate && (
          <div
            className={`flex items-center gap-1 ${
              overdue ? 'text-red-400 font-medium' : ''
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
            {overdue && <span className="text-red-500 text-[9px] font-semibold">Overdue</span>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-[9px] text-white font-bold border border-dark-bg">
                {getInitials(
                  typeof task.assignee === 'object'
                    ? task.assignee.name
                    : task.assignee
                )}
              </div>
              <span className="text-[11px] text-gray-400 truncate max-w-[100px]">
                {typeof task.assignee === 'object'
                  ? task.assignee.name
                  : task.assignee}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-gray-500 font-light">Unassigned</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-white/5 transition-all"
            title="Edit task"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
            title="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
