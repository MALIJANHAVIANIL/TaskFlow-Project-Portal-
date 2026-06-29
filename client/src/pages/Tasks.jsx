import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const Tasks = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (projectFilter) params.append('project', projectFilter);
      params.append('page', page);
      params.append('limit', 12);

      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.tasks || data.data || []);
      setTotalPages(data.pages || data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load tasks list');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, projectFilter, page]);

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get('/projects?limit=100');
      setProjects(data.projects || data.data || []);
    } catch (err) {
      // Dropdown population fails silently
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Open modal if coming from quick action
  useEffect(() => {
    if (location.state?.openCreate) {
      openCreateModal();
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const openCreateModal = () => {
    setEditingTask(null);
    reset({
      title: '',
      description: '',
      project: '',
      assignee: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
    });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description || '',
      project: typeof task.project === 'object' ? task.project?._id : task.project || '',
      assignee: typeof task.assignee === 'object' ? task.assignee?._id : task.assignee || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const cleanData = { ...formData };
      if (!cleanData.assignee) delete cleanData.assignee;
      if (!cleanData.dueDate) delete cleanData.dueDate;

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, cleanData);
        toast.success('Task updated successfully!');
      } else {
        if (!cleanData.project) {
          toast.error('Please select a project');
          return;
        }
        await api.post('/tasks', cleanData);
        toast.success('Task created successfully!');
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deletingTask) return;
    try {
      setSubmitting(true);
      await api.delete(`/tasks/${deletingTask._id}`);
      toast.success('Task deleted successfully!');
      setDeletingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setSubmitting(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-xs text-gray-500 font-light mt-0.5">
            Manage and track work sprint checklist.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/10 hover:-translate-y-0.5 transition-all duration-250"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
            
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50 cursor-pointer"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={projectFilter}
              onChange={(e) => {
                setProjectFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50 cursor-pointer max-w-[160px]"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard count={6} />
        </div>
      ) : tasks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditModal}
                onDelete={(t) => setDeletingTask(t)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    p === page
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/10'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No tasks found"
          description={
            search || statusFilter || priorityFilter || projectFilter
              ? 'Try adjusting your workspace filters.'
              : 'Create your first task to begin tracking project work.'
          }
          actionLabel={!search && !statusFilter && !priorityFilter && !projectFilter ? 'Create Task' : undefined}
          onAction={!search && !statusFilter && !priorityFilter && !projectFilter ? openCreateModal : undefined}
        />
      )}

      {/* Create/Edit Task Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTask ? 'Edit Task Details' : 'Create Task'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Task Title *</label>
            <input
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Min 3 characters' },
              })}
              placeholder="Enter task title"
              className="form-input text-xs"
            />
            {errors.title && (
              <p className="text-red-500 text-[10px] mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Describe the sprint scope..."
              className="form-input text-xs resize-none"
            />
          </div>

          <div>
            <label className="form-label">Project *</label>
            <select
              {...register('project', {
                required: !editingTask ? 'Project is required' : false,
              })}
              className="form-select text-xs"
            >
              <option value="">Select project workspace</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
            {errors.project && (
              <p className="text-red-500 text-[10px] mt-1">{errors.project.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Priority</label>
              <select
                {...register('priority')}
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
                {...register('status')}
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
                {...register('dueDate')}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            Are you sure you want to delete{' '}
            <strong className="text-white">{deletingTask?.title}</strong>?
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
              onClick={onDelete}
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

export default Tasks;
