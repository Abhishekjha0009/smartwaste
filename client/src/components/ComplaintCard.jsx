import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import { MapPin, Cpu, Calendar, User, ArrowRight, Eye, CheckCircle, Sparkles } from 'lucide-react';
import AiAnalysisModal from './AiAnalysisModal';

export default function ComplaintCard({ complaint, onAssignClick, onUpdateClick, currentRole }) {
  const [showAiModal, setShowAiModal] = useState(false);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Plastic': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Organic': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Hazardous': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'E-Waste': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Bulky': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <>
      <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group">
        
        <div>
          {/* Image & Overlay */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <img
              src={complaint.imageUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800'}
              alt={complaint.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {/* Top Badges Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <StatusBadge status={complaint.status} />
              <SeverityBadge severity={complaint.severity} />
            </div>

            {/* AI Confidence Badge */}
            <button
              onClick={() => setShowAiModal(true)}
              className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-eco-500/40 text-[11px] font-mono text-eco-300 flex items-center gap-1.5 hover:bg-slate-900 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-eco-400" />
              AI Vision {Math.round((complaint.aiClassification?.confidence || 0.9) * 100)}%
            </button>

            <span className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-lg border text-xs font-semibold ${getCategoryColor(complaint.category)}`}>
              {complaint.category}
            </span>
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-lg text-white group-hover:text-eco-400 transition-colors line-clamp-1">
              {complaint.title}
            </h3>
            
            <p className="text-xs text-slate-400 line-clamp-2">
              {complaint.description || 'No additional description provided.'}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-eco-400 shrink-0" />
                <span className="truncate">{complaint.location?.address || 'GPS Coordinates logged'}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {complaint.citizenName || 'Citizen'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>

              {complaint.assignedWorkerName && (
                <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Assigned Worker:</span>
                  <span className="font-medium text-amber-400">{complaint.assignedWorkerName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> AI Details
          </button>

          {currentRole === 'Authority' && complaint.status === 'Pending' && (
            <button
              onClick={() => onAssignClick && onAssignClick(complaint)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 font-semibold text-xs flex items-center gap-1 shadow-glow-emerald transition-all"
            >
              Assign Worker <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentRole === 'Worker' && (complaint.status === 'Assigned' || complaint.status === 'In Progress') && (
            <button
              onClick={() => onUpdateClick && onUpdateClick(complaint)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1 transition-all"
            >
              Update Status <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Vision Modal */}
      {showAiModal && (
        <AiAnalysisModal complaint={complaint} onClose={() => setShowAiModal(false)} />
      )}
    </>
  );
}
