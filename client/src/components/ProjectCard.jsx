import { useNavigate } from 'react-router-dom';
import { 
  Pencil, 
  Trash2, 
  Calendar, 
  ClipboardList 
} from 'lucide-react';

const statusStyles = {
  active: 'badge-completed',
  completed: 'badge-medium',
  archived: 'badge-low',
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project._id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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

  const statusLabel = project.status
    ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
    : 'Active';

  return (
    <div
      onClick={handleClick}
      className="glass-card p-6 cursor-pointer hover:border-brand-500/20 hover:bg-[#121212]/80 hover:-translate-y-0.5 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <span
          className={`${
            statusStyles[project.status] || statusStyles.active
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
        {project.description || 'No description provided.'}
      </p>

      {/* Dates */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-light">
        <Calendar className="w-3.5 h-3.5" />
        <span>
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          {/* Member avatars */}
          <div className="flex -space-x-1.5">
            {(project.members || []).slice(0, 3).map((member, idx) => (
              <div
                key={member._id || idx}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-[9px] text-white font-bold border border-dark-bg"
                title={member.name || 'Member'}
              >
                {getInitials(member.name)}
              </div>
            ))}
            {(project.members || []).length > 3 && (
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-gray-400 font-bold border border-dark-bg">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          {/* Task count */}
          {project.taskCount !== undefined && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{project.taskCount} tasks</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(project);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-400 hover:bg-white/5 transition-all"
            title="Edit project"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(project);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all"
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
