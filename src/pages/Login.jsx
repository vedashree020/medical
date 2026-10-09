import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Shield, ArrowRight } from 'lucide-react';
import { login } from '@/services/authService';
import Button from '@/components/Button';
import { Input } from '@/components/FormFields';
import { cn } from '@/utils/cn';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'staff') {
      const result = login('staff', { email, password });
      if (result.success) {
        navigate('/staff/dashboard');
      } else {
        setError(result.error);
      }
    } else {
      const result = login('patient', { name, email });
      if (result.success) {
        navigate('/patient/home');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 shadow-md">
            <Activity className="text-white" size={28} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800">QMedSync</h1>
            <p className="mt-0.5 text-sm text-slate-500">Smart Patient-to-Doctor & Room Assignment</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Role selector */}
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors',
                role === 'patient' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
              )}
            >
              <User size={16} />
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors',
                role === 'staff' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
              )}
            >
              <Shield size={16} />
              Staff / Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {role === 'patient' ? (
              <>
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email (optional)"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </>
            ) : (
              <>
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@qmedsync.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="demo123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full">
              Continue
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-center text-xs text-slate-400">
              Demo Prototype — Authentication is simulated.
            </p>
            {role === 'staff' && (
              <p className="mt-1 text-center text-xs text-slate-400">
                Use <span className="font-medium text-slate-500">admin@qmedsync.demo</span> /{' '}
                <span className="font-medium text-slate-500">demo123</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
