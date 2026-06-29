import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password', '');

  const passwordStrength = useMemo(() => {
    if (!passwordValue) return { score: 0, label: '', color: '' };
    let score = 0;
    if (passwordValue.length >= 6) score++;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;

    const levels = [
      { label: '', color: '' },
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-amber-500' },
      { label: 'Good', color: 'bg-brand-400' },
      { label: 'Strong', color: 'bg-emerald-500' },
    ];

    return { score, ...levels[score] };
  }, [passwordValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (err) {
      // Error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white tracking-tight">Create an account</h2>
        <p className="text-xs text-gray-500 font-light mt-1.5">
          Start coordinating project workloads today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="form-label">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              placeholder="John Doe"
              className="form-input text-xs pl-10"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="form-label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="you@example.com"
              className="form-input text-xs pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="form-label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="••••••••"
              className="form-input text-xs pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-[10px] mt-1">
              {errors.password.message}
            </p>
          )}

          {/* Password strength */}
          {passwordValue && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.score
                        ? passwordStrength.color
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 font-light">
                Password strength: {passwordStrength.score > 0 ? passwordStrength.label : 'None'}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="form-label">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type={showConfirm ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) =>
                  val === passwordValue || 'Passwords do not match',
              })}
              placeholder="••••••••"
              className="form-input text-xs pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-[10px] mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary text-xs py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Login link */}
      <p className="text-center text-xs text-gray-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
