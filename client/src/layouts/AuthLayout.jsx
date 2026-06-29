import { Outlet, Navigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0c0c0c] flex items-center justify-center p-4">
      {/* Background Blobs */}
      <div className="blur-blob blur-blob-blue w-96 h-96 -top-40 -left-20" />
      <div className="blur-blob blur-blob-purple w-96 h-96 -bottom-40 -right-20" />
      
      {/* Cinematic Grid Lines */}
      <div className="guide-lines" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fadeIn">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-4">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">TaskFlow</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Workspace Sprints Authentication
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-card p-8 animate-slideUp">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
