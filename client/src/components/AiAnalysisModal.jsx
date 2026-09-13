import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Tag, X, Sparkles } from 'lucide-react';

export default function AiAnalysisModal({ complaint, onClose }) {
  const ai = complaint?.aiClassification || {};
  const confidencePct = Math.round((ai.confidence || 0.92) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-card max-w-xl w-full rounded-2xl p-6 border border-eco-500/30 shadow-2xl relative space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-500/20 border border-eco-500/40 flex items-center justify-center text-eco-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                AI Vision Classification Report
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">Automated Image Computer Vision Diagnostic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waste Photo */}
        <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
          <img
            src={complaint?.imageUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800'}
            alt="Waste"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 text-xs font-semibold text-white">
            Analyzed Target: <span className="text-eco-400">{complaint?.title}</span>
          </div>
        </div>

        {/* AI Confidence Meter */}
        <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-eco-400" /> Confidence Score
            </span>
            <span className="text-eco-400 font-mono font-bold">{confidencePct}% High Confidence</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-eco-400 rounded-full transition-all duration-1000"
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Metadata Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block uppercase font-mono">Detected Category</span>
            <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              {ai.detectedCategory || complaint?.category}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block uppercase font-mono">Recommended Severity</span>
            <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {ai.severity || complaint?.severity}
            </span>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="p-4 rounded-xl bg-eco-500/10 border border-eco-500/30 text-xs text-slate-200 space-y-1">
          <h5 className="font-semibold text-eco-400 uppercase tracking-wider text-[10px]">AI Action Directive</h5>
          <p>{ai.recommendation || 'Standard recyclable waste collection procedure.'}</p>
        </div>

        {/* Detected Tags */}
        <div className="space-y-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Feature Tags Identified:
          </span>
          <div className="flex flex-wrap gap-2">
            {(ai.tags || ['packaging', 'plastic', 'bottles']).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
