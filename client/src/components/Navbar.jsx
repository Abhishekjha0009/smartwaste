import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Sparkles,
  Bell,
  LogOut,
  User,
  Shield,
  Briefcase,
  LayoutDashboard,
  MapPin,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Authority':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Worker':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Admin':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-eco-500/10 text-eco-400 border-eco-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-glow-emerald group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-eco-400 bg-clip-text text-transparent">
                SmartWaste
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-eco-400 font-semibold -mt-1">
                AI Municipal Eco-Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to={
                    user.role === 'Authority'
                      ? '/authority'
                      : user.role === 'Worker'
                      ? '/worker'
                      : user.role === 'Admin'
                      ? '/admin'
                      : '/citizen'
                  }
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    location.pathname.startsWith('/citizen') ||
                    location.pathname.startsWith('/worker') ||
                    location.pathname.startsWith('/authority') ||
                    location.pathname.startsWith('/admin')
                      ? 'bg-eco-500/10 text-eco-400 border border-eco-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* User Controls & Notifications */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Real-Time Socket Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-eco-500 text-slate-950 font-bold text-xs flex items-center justify-center animate-bounce">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popup */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card rounded-2xl p-4 shadow-2xl border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                          <Bell className="w-4 h-4 text-eco-400" /> Live Real-Time Alerts
                        </h4>
                        <span className="text-xs text-slate-400">{notifications.length} unread</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto mt-2 space-y-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-sm">
                            No new notifications yet.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-2 hover:border-slate-700 transition-all"
                            >
                              <div>
                                <h5 className="text-xs font-semibold text-eco-400">{n.title}</h5>
                                <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                                <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                              </div>
                              <button
                                onClick={() => removeNotification(n.id)}
                                className="text-slate-500 hover:text-slate-300 text-xs"
                              >
                                &times;
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Pill */}
                <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-800">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border border-eco-500/50 object-cover"
                  />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-200 leading-tight">{user.name}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider inline-block mt-0.5 ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all ml-1"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-eco-500 to-teal-500 text-slate-950 hover:from-eco-400 hover:to-teal-400 font-semibold shadow-glow-emerald transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to={
                  user.role === 'Authority'
                    ? '/authority'
                    : user.role === 'Worker'
                    ? '/worker'
                    : user.role === 'Admin'
                    ? '/admin'
                    : '/citizen'
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-eco-400 font-medium hover:bg-slate-900"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-900"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
