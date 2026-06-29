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
  FolderOpen
} from 'lucide-react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import { SkeletonCard } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const Projects = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', 12);

      const { data } = await api.get(`/projects?${params.toString()}`);
      setProjects(data.projects || data.data || []);
      setTotalPages(data.pages || data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

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
    setEditingProject(null);
    reset({
      title: '',
      description: '',
      status: 'active',
      startDate: '',
      endDate: '',
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      description: project.description || '',
      status: project.status || 'active',
      startDate: project.startDate ? project.startDate.slice(0, 10) : '',
      endDate: project.endDate ? project.endDate.slice(0, 10) : '',
    });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, formData);
        toast.success('Project updated successfully!');
      } else {
        await api.post('/projects', formData);
        toast.success('Project created successfully!');
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deletingProject) return;
    try {
      setSubmitting(true);
      await api.delete(`/projects/${deletingProject._id}`);
      toast.success('Project deleted successfully!');
      setDeletingProject(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setSubmitting(false);
    }
  };

  // Debounce search input
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
          <h1 className="text-xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-xs text-gray-500 font-light mt-0.5">
            Create and manage active project workspaces.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/10 hover:-translate-y-0.5 transition-all duration-250"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-500/50 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard count={6} />
        </div>
      ) : projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={openEditModal}
                onDelete={(p) => setDeletingProject(p)}
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
          icon={FolderOpen}
          title="No projects found"
          description={
            search || statusFilter
              ? 'Try resetting the filters to find projects.'
              : 'Create your first project workspace to begin tracking tasks.'
          }
          actionLabel={!search && !statusFilter ? 'Create Project' : undefined}
          onAction={!search && !statusFilter ? openCreateModal : undefined}
        />
      )}

      {/* Create/Edit Project Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProject ? 'Edit Project Details' : 'Create Project'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Project Title *</label>
            <input
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Min 3 characters' },
              })}
              placeholder="Enter project name"
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
              placeholder="Brief summary of project scope..."
              className="form-input text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="form-label">Status</label>
              <select
                {...register('status')}
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
                {...register('startDate')}
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                {...register('endDate')}
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
              {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        title="Delete Project workspace"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Are you sure you want to delete{' '}
            <strong className="text-white">{deletingProject?.title}</strong>?
            This will permanently remove the project and all tasks.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeletingProject(null)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
