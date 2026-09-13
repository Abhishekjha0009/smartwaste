import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Cpu,
  Activity,
  ShieldCheck,
  MapPin,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Users,
  Building2,
  Truck,
  Camera
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-eco-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-eco-500/40 text-xs font-mono text-eco-300 shadow-glow-emerald">
            <Sparkles className="w-4 h-4 text-eco-400" />
            AI Vision Computer Vision & Socket.IO Real-Time Engine
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-none">
            Smart Municipal Waste Management <br />
            <span className="bg-gradient-to-r from-eco-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Powered by Vision AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report waste in seconds with instant AI classification, track resolution live with real-time Socket.IO notifications, and optimize urban sanitation with Recharts analytics.
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
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
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-glow-emerald flex items-center gap-2 transition-all group"
              >
                Go to {user.role} Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-glow-emerald flex items-center gap-2 transition-all group"
                >
                  Report Waste Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl glass-card hover:bg-slate-800 text-white font-semibold text-base border border-slate-700 transition-all"
                >
                  Log In & Demo Roles
                </Link>
              </>
            )}
          </div>

          {/* Role Quick Tester Cards */}
          <div className="pt-12">
            <p className="text-xs uppercase tracking-widest font-mono text-slate-400 mb-6">
              Instant 1-Click Role Testing Access
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              
              <div className="glass-card p-5 rounded-2xl border border-slate-800 text-left space-y-3 hover:border-eco-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-eco-500/10 text-eco-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Citizen</h3>
                <p className="text-xs text-slate-400">File reports with AI auto-detect, GPS pin, & track live progress timeline.</p>
                <Link to="/login?role=Citizen" className="text-xs font-semibold text-eco-400 hover:underline inline-flex items-center gap-1">
                  Test Citizen Role &rarr;
                </Link>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800 text-left space-y-3 hover:border-amber-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Sanitation Worker</h3>
                <p className="text-xs text-slate-400">View assigned tasks, navigate location, upload before/after proof.</p>
                <Link to="/login?role=Worker" className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1">
                  Test Worker Role &rarr;
                </Link>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800 text-left space-y-3 hover:border-purple-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Municipal Authority</h3>
                <p className="text-xs text-slate-400">Recharts command center, heatmap, assign tasks, live socket alert feed.</p>
                <Link to="/login?role=Authority" className="text-xs font-semibold text-purple-400 hover:underline inline-flex items-center gap-1">
                  Test Authority Role &rarr;
                </Link>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-slate-800 text-left space-y-3 hover:border-rose-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">System Admin</h3>
                <p className="text-xs text-slate-400">Manage user accounts, RBAC roles, category settings, & system logs.</p>
                <Link to="/login?role=Admin" className="text-xs font-semibold text-rose-400 hover:underline inline-flex items-center gap-1">
                  Test Admin Role &rarr;
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Full-Stack Production Capabilities</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Built with React, Express, MongoDB, Socket.IO, and AI Vision integration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 rounded-3xl space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-eco-500/10 border border-eco-500/30 flex items-center justify-center text-eco-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Vision Classifier</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analyzes uploaded waste photos to detect category (Plastic, Organic, HazMat, E-Waste), estimate severity, check duplicate reports nearby, and output handling rules.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Socket.IO Real-Time System</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instant web sockets events push notifications to Authorities when complaints are reported, to Workers when tasks are assigned, and to Citizens when waste is cleaned.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Recharts Command Analytics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Authority dashboards feature dynamic data visualization: resolution time trends, category distributions, worker leaderboard, and area cleanliness index scores.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
