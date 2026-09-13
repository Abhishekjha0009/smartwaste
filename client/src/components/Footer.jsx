import React from 'react';
import { Sparkles, ShieldCheck, Cpu, MapPin, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-eco-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-bold text-lg text-white">SmartWaste System</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              AI-powered municipal waste collection and real-time tracking platform. Empowering citizens, field workers, and municipal authorities for a cleaner tomorrow.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-eco-400">
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Socket.IO Real-time</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Gemini Vision AI</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> MERN Enterprise</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Roles & Access</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/citizen" className="hover:text-eco-400 transition-colors">Citizen Portal</a></li>
              <li><a href="/worker" className="hover:text-eco-400 transition-colors">Sanitation Worker App</a></li>
              <li><a href="/authority" className="hover:text-eco-400 transition-colors">Authority Command Center</a></li>
              <li><a href="/admin" className="hover:text-eco-400 transition-colors">Admin Console</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Tech Stack</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>React.js & Tailwind CSS</li>
              <li>Node.js + Express REST API</li>
              <li>MongoDB & Mongoose</li>
              <li>Socket.IO & Recharts</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SmartWaste Municipal Systems Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for Full-Stack Web Development Production Showcase.
          </p>
        </div>
      </div>
    </footer>
  );
}
