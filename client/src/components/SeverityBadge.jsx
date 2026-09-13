import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldAlert, Check } from 'lucide-react';

export default function SeverityBadge({ severity }) {
  const getStyle = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse';
      case 'High':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'Medium':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'Low':
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold uppercase tracking-wider ${getStyle(severity)}`}>
      <AlertTriangle className="w-3 h-3" />
      {severity}
    </span>
  );
}
