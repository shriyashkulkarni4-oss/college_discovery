import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch('password', '');
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const onSubmit = async (data: FormData) => {
    try {
      await signup.mutateAsync({ name: data.name, email: data.email, password: data.password });
      navigate('/', { replace: true });
    } catch (err: any) {
      setError('root', {
        message: err?.response?.data?.message ?? 'Signup failed. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border p-8 shadow-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl mb-4">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
              Create your account
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Join CollegeDiscover — it's free
            </p>
          </div>

          <style>{`
            .form-input {
              width: 100%;
              padding: 0.625rem 0.875rem;
              border-radius: 0.75rem;
              border: 1px solid var(--border-color);
              background: var(--bg-primary);
              color: var(--text-primary);
              font-size: 0.875rem;
              transition: border-color 0.2s, box-shadow 0.2s;
            }
            .form-input:focus {
              outline: none;
              border-color: #6366f1;
              box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
            }
          `}</style>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-sm">
                {errors.root.message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full Name</label>
              <input {...register('name')} placeholder="Arjun Sharma" className="form-input" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email address</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className="form-input" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Password</label>
              <div className="relative">
                <input {...register('password')} type={showPwd ? 'text' : 'password'} placeholder="••••••••" className="form-input pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div className="mt-2 space-y-1">
                  {[
                    { label: 'At least 8 characters', ok: passwordChecks.length },
                    { label: 'Uppercase letter', ok: passwordChecks.uppercase },
                    { label: 'Number', ok: passwordChecks.number },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-1.5">
                      <CheckCircle className={`w-3.5 h-3.5 ${c.ok ? 'text-emerald-500' : 'text-surface-300'}`} />
                      <span className={`text-xs ${c.ok ? 'text-emerald-600' : ''}`} style={c.ok ? {} : { color: 'var(--text-muted)' }}>
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="••••••••" className="form-input" />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-primary-500/25 hover:-translate-y-0.5">
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
