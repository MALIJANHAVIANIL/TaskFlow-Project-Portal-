import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Pencil,
  Trash2,
  Plus,
  Calendar,
  ArrowLeft,
  Users,
  ClipboardList,
  Filter,
  CheckSquare,
  Sparkles,
  ArrowRight,
  MoveRight,
  MoveLeft
} from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const statusColors = {
  active: 'badge-completed',
  completed: 'badge-medium',
  archived: 'badge-low',
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('');

  const {
    register: registerProject,
    handleSubmit: handleProjectSubmit,
    reset: resetProject,
    formState: { errors: projectErrors },
  } = useForm();

  const {
    register: registerTask,
    handleSubmit: handleTaskSubmit,
    reset: resetTask,
    formState: { errors: taskErrors },
  } = useForm();

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.project || data);
      setTasks(data.tasks || data.project?.tasks || []);
    } catch (err) {
      toast.error('Failed to load project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleEditProject = () => {
    if (!project) return;
    resetProject({
      title: project.title,
      description: project.description || '',
      status: project.status,
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      endDate: project.endDate ? project.endDate.slice(0, 10) : '',
    });
    setShowEditModal(true);
  };

  const onUpdateProject = async (formData) => {
    try {
      setSubmitting(true);
      const { data } = await api.put(`/projects/${id}`, formData);
      setProject(data.project || data);
      toast.success('Project details updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteProject = async () => {
    try {
      setSubmitting(true);
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully!');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateTask = () => {
    setEditingTask(null);
    resetTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      assignee: '',
    });
    setShowTaskModal(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    resetTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      assignee: typeof task.assignee === 'object' ? task.assignee?._id : task.assignee || '',
    });
    setShowTaskModal(true);
  };

  const onSubmitTask = async (formData) => {
    try {
      setSubmitting(true);
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
        toast.success('Task updated!');
      } else {
        await api.post('/tasks', { ...formData, project: id });
        toast.success('Task created successfully!');
      }
      setShowTaskModal(false);
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      toast.success(`Task moved to ${newStatus.replace('-', ' ')}`);
      fetchProject();
    } catch (err) {
      toast.error('Failed to move task status');
    }
  };

  const onDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      setSubmitting(true);
      await api.delete(`/tasks/${deletingTask._id}`);
      toast.success('Task deleted successfully!');
      setDeletingTask(null);
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  // Filter tasks by priority if selected
  const filteredTasks = tasks.filter((task) => {
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  // Kanban Columns
  const columns = [
    { id: 'todo', label: 'To Do', badge: 'badge-todo' },
    { id: 'in-progress', label: 'In Progress', badge: 'badge-progress' },
    { id: 'completed', label: 'Completed', badge: 'badge-completed' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
        <div className="glass-card p-6 space-y-4">
          <div className="h-6 w-64 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
              <SkeletonCard count={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) return null;

  const statusLabel = project.status
    ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
    : 'Active';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {project.title}
              </h1>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  statusColors[project.status] || statusColors.active
                }`}
              >
                {statusLabel}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-light mb-4 max-w-2xl leading-relaxed">
              {project.description || 'No description provided.'}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-light">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {formatDate(project.startDate)} — {formatDate(project.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{project.members?.length || 1} team member(s)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" />
                <span>{tasks.length} total tasks</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleEditProject}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Project
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Project
            </button>
          </div>
        </div>

        {/* Team Members List */}
        {project.members && project.members.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Assigned Sprints team
            </p>
            <div className="flex -space-x-1.5">
              {project.members.map((member, idx) => (
                <div
                  key={typeof member === 'object' ? member._id : idx}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-[10px] text-white font-bold border border-dark-bg"
                  title={typeof member === 'object' ? member.name : 'Member'}
                >
                  {typeof member === 'object' ? getInitials(member.name) : '?'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Kanban Sprints Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
          Kanban Board preview
        </h2>
        
        <div className="flex items-center gap-2">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={openCreateTask}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/10 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Sprints Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);
          
          return (
            <div key={column.id} className="space-y-4 bg-white/[0.01] border border-white/[0.04] p-4 rounded-2xl flex flex-col min-h-[350px]">
              {/* Column Title */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    column.id === 'todo' ? 'bg-blue-400' : column.id === 'in-progress' ? 'bg-orange-400' : 'bg-emerald-400'
                  }`} />
                  <span className="text-xs font-bold text-white tracking-wide">{column.label}</span>
                </div>
                <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full font-mono">{columnTasks.length}</span>
              </div>

              {/* Column Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className="glass-card p-4 hover:border-brand-500/20 hover:bg-[#121212]/80 transition-all duration-300 group space-y-3 relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-white group-hover:text-brand-400 transition-colors block">
                          {task.title}
                        </span>
                        
                        {/* Quick state shift buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          {column.id !== 'todo' && (
                            <button 
                              onClick={() => handleStatusChange(task, column.id === 'completed' ? 'in-progress' : 'todo')}
                              className="p-1 rounded bg-white/5 text-gray-400 hover:text-white transition-all"
                              title="Move Left"
                            >
                              <MoveLeft className="w-3 h-3" />
                            </button>
                          )}
                          {column.id !== 'completed' && (
                            <button 
                              onClick={() => handleStatusChange(task, column.id === 'todo' ? 'in-progress' : 'completed')}
                              className="p-1 rounded bg-white/5 text-gray-400 hover:text-white transition-all"
                              title="Move Right"
                            >
                              <MoveRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Card Meta details */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'high' ? 'badge-high' : task.priority === 'medium' ? 'badge-medium' : 'badge-low'
                          }`}>
                            {task.priority || 'medium'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => openEditTask(task)}
                            className="p-1 text-gray-500 hover:text-white transition-colors"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setDeletingTask(task)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-[10px] text-gray-500 font-light italic">
                    No tasks in {column.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project Details"
      >
        <form onSubmit={handleProjectSubmit(onUpdateProject)} className="space-y-4">
          <div>
            <label className="form-label">Project Title</label>
            <input
              {...registerProject('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Min 3 characters' },
              })}
              className="form-input text-xs"
            />
            {projectErrors.title && (
              <p className="text-red-500 text-[10px] mt-1">{projectErrors.title.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              {...registerProject('description')}
              rows={3}
              className="form-input text-xs resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Status</label>
              <select
                {...registerProject('status')}
                className="form-select text-xs"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                {...registerProject('startDate')}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                {...registerProject('endDate')}
                className="form-input text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs py-2 px-4 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Project Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Are you sure you want to delete <strong className="text-white">{project.title}</strong>?
            This will also delete all associated tasks in this project view. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteProject}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Task Create/Edit Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title={editingTask ? 'Edit Task Details' : 'Create Task'}
      >
        <form onSubmit={handleTaskSubmit(onSubmitTask)} className="space-y-4">
          <div>
            <label className="form-label">Task Title</label>
            <input
              {...registerTask('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Min 3 characters' },
              })}
              className="form-input text-xs"
            />
            {taskErrors.title && (
              <p className="text-red-500 text-[10px] mt-1">{taskErrors.title.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              {...registerTask('description')}
              rows={3}
              className="form-input text-xs resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Priority</label>
              <select
                {...registerTask('priority')}
                className="form-select text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select
                {...registerTask('status')}
                className="form-select text-xs"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                {...registerTask('dueDate')}
                className="form-input text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowTaskModal(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-xs py-2 px-4 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Task Modal */}
      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            Are you sure you want to delete <strong className="text-white">{deletingTask?.title}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeletingTask(null)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteTask}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Delete Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
