import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Lock,
  Calendar,
  Shield,
  Camera,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const updateData = { name: data.name, email: data.email };
      if (data.password) updateData.password = data.password;
      await updateProfile(updateData);
    } catch (err) {
      // handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    if (strength <= 2) return { level: strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { level: strength, label: 'Medium', color: 'bg-amber-500' };
    return { level: strength, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Profile Header */}
      <div className="glass-card p-8 text-center">
        <div className="relative inline-block mb-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-brand-500/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xl text-white font-bold border-2 border-brand-500/20">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-brand-500/20">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <h2 className="text-base font-bold text-white">{user?.name || 'User'}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'email@example.com'}</p>
      </div>

      {/* Account Info */}
      <div className="glass-card p-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-400" />
          Account Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Role</p>
              <p className="text-xs font-medium text-white capitalize">{user?.role || 'Member'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Joined</p>
              <p className="text-xs font-medium text-white">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="glass-card p-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-400" />
          Edit Profile
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                })}
                className="form-input text-xs pl-10"
              />
            </div>
            {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
                })}
                className="form-input text-xs pl-10"
              />
            </div>
            {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium"
            >
              <Lock className="w-3.5 h-3.5" />
              {showPasswordSection ? 'Cancel password change' : 'Change password'}
            </button>
          </div>

          {showPasswordSection && (
            <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-fadeIn">
              <div>
                <label className="form-label">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    {...register('password', { minLength: { value: 6, message: 'Min 6 characters' } })}
                    placeholder="Enter new password"
                    className="form-input text-xs pl-10"
                  />
                </div>
                {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password.message}</p>}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      validate: (value) => !password || value === password || 'Passwords do not match',
                    })}
                    placeholder="Confirm new password"
                    className="form-input text-xs pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-[10px] mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting || (!isDirty && !password)}
              className="btn-primary text-xs py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
