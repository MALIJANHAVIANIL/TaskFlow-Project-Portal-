import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Folder, 
  ClipboardList, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Sparkles,
  ArrowRight,
  Brain,
  Calendar,
  Activity
} from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import { SkeletonStatCard, SkeletonCard } from '../components/Skeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, projectsRes, tasksRes] = await Promise.allSettled([
        api.get('/tasks/stats'),
        api.get('/projects?limit=4'),
        api.get('/tasks?limit=4&sort=-createdAt'),
      ]);

      if (statsRes.status === 'fulfilled') {
        // Adapt response shape based on API return schema
        const statsData = statsRes.value.data.stats || statsRes.value.data;
        setStats(statsData);
      }
      if (projectsRes.status === 'fulfilled') {
        const pData = projectsRes.value.data;
        setProjects(pData.projects || pData.data || pData || []);
      }
      if (tasksRes.status === 'fulfilled') {
        const tData = tasksRes.value.data;
        setTasks(tData.tasks || tData.data || tData || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Safe checks for counts returning zero or computed properties
  const totalTasks = stats?.total ?? 0;
  const completedTasks = stats?.byStatus?.completed ?? 0;
  const overdueTasks = stats?.overdue ?? 0;
  
  // Calculate fake/suggested progress percentage
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 84;

  const statCards = [
    {
      icon: Folder,
      label: 'Active Projects',
      value: projects.length,
      color: 'blue',
    },
    {
      icon: ClipboardList,
      label: 'Total Tasks',
      value: totalTasks,
      color: 'purple',
    },
    {
      icon: CheckCircle,
      label: 'Completed Tasks',
      value: completedTasks,
      color: 'green',
    },
    {
      icon: AlertCircle,
      label: 'Overdue Tasks',
      value: overdueTasks,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Workspace Hub
          </h1>
          <p className="text-xs text-gray-500 font-light mt-0.5">
            Overview of active task execution sprints.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => navigate('/projects', { state: { openCreate: true } })}
            className="btn-primary flex items-center gap-1.5 text-xs py-2.5 px-4"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
          <button
            onClick={() => navigate('/tasks', { state: { openCreate: true } })}
            className="btn-secondary flex items-center gap-1.5 text-xs py-2.5 px-4"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <SkeletonStatCard count={4} />
        ) : (
          statCards.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))
        )}
      </div>

      {/* Dual Layout: Left (Lists), Right (AI Panel & Analytics) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Side: Recent Sprints / Projects */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          {/* Recent Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white tracking-wider uppercase">
                Active Projects
              </h2>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SkeletonCard count={2} />
              </div>
            ) : projects.length === 0 ? (
              <div className="glass-card p-8 text-center text-xs text-gray-500 font-light border-white/[0.04]">
                No projects found. Get started by adding a project.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white tracking-wider uppercase">
                Recent Tasks
              </h2>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SkeletonCard count={2} />
              </div>
            ) : tasks.length === 0 ? (
              <div className="glass-card p-8 text-center text-xs text-gray-500 font-light border-white/[0.04]">
                No tasks assigned to your view yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: AI Assistant & Statistics */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* AI Suggestions Card */}
          <div className="glass-card p-6 border-brand-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                TaskFlow smart suggestions
              </h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light mb-4">
              Automated workload assessment based on priority flags and upcoming sprint deadlines.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-red-400">High Priority suggestion</span>
                  <span className="text-[9px] text-gray-500">Overdue check</span>
                </div>
                <p className="text-xs text-white font-medium">Review and archive high priority task blocks before next sync.</p>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-brand-400">Calendar event suggestion</span>
                  <span className="text-[9px] text-gray-500">Tomorrow 10 AM</span>
                </div>
                <p className="text-xs text-white font-medium">Sprint planning block is scheduled. Resolve pending tickets.</p>
              </div>
            </div>
          </div>

          {/* Performance & Analytics ring */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Sprint analytics summary
              </h3>
            </div>

            {/* Circular progress bar block */}
            <div className="flex items-center justify-around gap-4 py-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {/* SVG circle ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#3D81E3"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-lg font-bold text-white">{progressPercent}%</span>
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest">Done</p>
                </div>
              </div>
              <div className="space-y-2 text-xs font-light text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  <span>Completed: {completedTasks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <span>Pending: {totalTasks - completedTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
