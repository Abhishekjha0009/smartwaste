import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Role Quick Presets for Demo Testing
  const presets = [
    { role: 'Citizen', email: 'citizen@smartwaste.org', color: 'border-eco-500/40 text-eco-400' },
    { role: 'Worker', email: 'worker@smartwaste.org', color: 'border-amber-500/40 text-amber-400' },
    { role: 'Authority', email: 'authority@smartwaste.org', color: 'border-purple-500/40 text-purple-400' },
    { role: 'Admin', email: 'admin@smartwaste.org', color: 'border-rose-500/40 text-rose-400' }
  ];

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      const found = presets.find(p => p.role.toLowerCase() === roleParam.toLowerCase());
      if (found) {
        setEmail(found.email);
        setPassword('password123');
      }
    } else if (!email) {
      setEmail('citizen@smartwaste.org');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      setLoading(false);
      const role = data.user.role;
      if (role === 'Authority') navigate('/authority');
      else if (role === 'Worker') navigate('/worker');
      else if (role === 'Admin') navigate('/admin');
      else navigate('/citizen');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickFill = (presetEmail) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-eco-600 to-teal-400 mx-auto flex items-center justify-center text-white shadow-glow-emerald">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Log in to SmartWaste</h2>
          <p className="text-xs text-slate-400">Access your role-based dashboard & real-time controls</p>
        </div>

        {/* Quick Demo Preset Selector */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-slate-400 block uppercase text-center">
            Quick 1-Click Role Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleQuickFill(p.email)}
                className={`px-3 py-2 rounded-xl bg-slate-900/60 border ${p.color} text-xs font-semibold hover:bg-slate-900 transition-all text-left flex items-center justify-between`}
              >
                <span>{p.role}</span>
                {email === p.email && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 text-sm"
                placeholder="user@smartwaste.org"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-emerald flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-eco-400 font-semibold hover:underline">
            Register new account
          </Link>
        </div>

      </div>
    </div>
  );
}
