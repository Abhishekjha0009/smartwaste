import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import {
  Truck,
  CheckCircle2,
  Clock,
  Play,
  Camera,
  MapPin,
  RefreshCw,
  X,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Status Update Modal State
  const [newStatus, setNewStatus] = useState('In Progress');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [afterFile, setAfterFile] = useState(null);
  const [afterPreview, setAfterPreview] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/complaints');
      if (res.data?.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Failed to fetch worker tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdateModal = (complaint) => {
    setSelectedTask(complaint);
    setNewStatus(complaint.status === 'Assigned' ? 'In Progress' : 'Resolved');
    setResolutionNotes(complaint.resolutionNotes || '');
    setAfterPreview(complaint.afterImage || '');
    setAfterFile(null);
  };

  const handleAfterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append('resolutionNotes', resolutionNotes);

      if (afterFile) {
        formData.append('afterImage', afterFile);
      } else if (afterPreview) {
        formData.append('afterImage', afterPreview);
      }

      const res = await API.put(`/complaints/${selectedTask._id}/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        setSelectedTask(null);
        fetchTasks();
        alert(`Task status updated to '${newStatus}'! Live Socket alert dispatched.`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const pendingTasks = complaints.filter(c => c.status === 'Assigned' || c.status === 'In Progress');
  const completedTasks = complaints.filter(c => c.status === 'Resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
              Sanitation Field Crew App
            </span>
            <span className="text-xs text-slate-400 font-mono">Zone: {user?.assignedZone || 'Central'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Assigned Work Orders & Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Navigate to assigned waste locations, start cleanup tasks, and upload completion photos for verification.
          </p>
        </div>

        {/* Worker Performance Stats */}
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-3 rounded-2xl border border-emerald-500/30 text-center">
            <span className="text-emerald-400 font-extrabold text-lg block">{completedTasks.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Completed Jobs</span>
          </div>

          <div className="glass-card px-4 py-3 rounded-2xl border border-amber-500/30 text-center">
            <span className="text-amber-400 font-extrabold text-lg block">{pendingTasks.length}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active Tasks</span>
          </div>
        </div>
      </div>

      {/* Map View of Active Tasks */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" /> Active Dispatch Map & Route Pins
        </h2>
        <MapView complaints={complaints} height="350px" />
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            Assigned Complaints List ({complaints.length})
          </h2>
          <button
            onClick={fetchTasks}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading assigned tasks...</div>
        ) : complaints.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center border border-slate-800 text-slate-400">
            No waste collection tasks currently assigned to you.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((item) => (
              <ComplaintCard
                key={item._id}
                complaint={item}
                currentRole="Worker"
                onUpdateClick={handleOpenUpdateModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Update Task Status #{selectedTask._id.slice(-6)}
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitStatusUpdate} className="space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Target Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full glass-input text-xs bg-slate-900"
                >
                  <option value="In Progress">In Progress (Commenced Cleanup)</option>
                  <option value="Resolved">Resolved (Cleanup Completed)</option>
                  <option value="Rejected">Rejected (Invalid Report / Site Cleared)</option>
                </select>
              </div>

              {/* Upload After/Cleaned Image Proof */}
              {newStatus === 'Resolved' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Attach Cleaned Site Proof Photo (After Image) *
                  </label>

                  <label className="h-32 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/40 p-4 text-center">
                    <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-200">Upload Clean Site Photo</span>
                    <input type="file" accept="image/*" onChange={handleAfterFileChange} className="hidden" />
                  </label>

                  {afterPreview && (
                    <div className="h-32 rounded-xl overflow-hidden border border-emerald-500/40">
                      <img src={afterPreview} alt="After Proof" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Resolution Notes</label>
                <textarea
                  rows="3"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Waste collected using loader truck, site sprayed with disinfectant..."
                  className="w-full glass-input text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs"
                >
                  {updating ? 'Saving...' : 'Confirm Status Update'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
