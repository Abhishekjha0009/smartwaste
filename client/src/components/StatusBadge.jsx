import React from 'react';
import { Clock, UserCheck, Play, CheckCircle2, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const getStyle = (s) => {
    switch (s) {
      case 'Pending':
        return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Clock };
      case 'Assigned':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: UserCheck };
      case 'In Progress':
        return { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Play };
      case 'Resolved':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
      case 'Rejected':
        return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: XCircle };
      default:
        return { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30', icon: Clock };
    }
  };

  const { bg, icon: Icon } = getStyle(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
