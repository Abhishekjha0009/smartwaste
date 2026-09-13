import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import MapView from '../components/MapView';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  Building2,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  MapPin,
  UserPlus,
  X,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AuthorityDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Assign Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, complaintsRes, workersRes] = await Promise.all([
        API.get('/analytics/dashboard'),
        API.get('/complaints'),
        API.get('/users/workers')
      ]);

      if (analyticsRes.data?.success) setAnalytics(analyticsRes.data);
      if (complaintsRes.data?.success) setComplaints(complaintsRes.data.complaints);
      if (workersRes.data?.success) setWorkers(workersRes.data.workers);
    } catch (err) {
      console.error('Failed to load authority analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedWorkerId(workers[0]?._id || '');
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedWorkerId) return;

    setAssigning(true);
    try {
      const res = await API.put(`/complaints/${selectedComplaint._id}/assign`, {
        workerId: selectedWorkerId
      });

      if (res.data?.success) {
        setSelectedComplaint(null);
        fetchDashboardData();
        alert(`Worker successfully assigned! Socket.IO real-time alert dispatched.`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign worker');
    } finally {
      setAssigning(false);
    }
  };

  // Recharts Color Palettes
  const PIE_COLORS = ['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#64748B'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold">
              Municipal Command Center
            </span>
            <span className="text-xs text-slate-400 font-mono">Recharts Analytics & Live Socket Broadcast</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Authority Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor real-time waste hotspots, allocate field sanitation crews, and analyze resolution performance metrics.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-purple-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analytics Feed
        </button>
      </div>

      {/* KPI STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Complaints</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {analytics?.kpis?.totalComplaints || complaints.length}
          </div>
          <span className="text-[11px] text-eco-400 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3" /> Live MERN Data
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Pending Resolution</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
            {analytics?.kpis?.pendingCount || complaints.filter(c => c.status === 'Pending').length}
          </div>
          <span className="text-[11px] text-rose-400 font-mono">Requires Dispatch</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Avg Resolution Time</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {analytics?.kpis?.avgResolutionTime || '2.4 hrs'}
          </div>
          <span className="text-[11px] text-amber-400 font-mono">SLA Performance</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">Area Cleanliness Index</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-eco-400">
            {analytics?.kpis?.cleanlinessScore || '88/100'}
          </div>
          <span className="text-[11px] text-eco-400 font-mono">Municipal Score</span>
        </div>

      </div>

      {/* RECHARTS DATA VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown Pie Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Waste Category Distribution
          </h3>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.categoriesData || [
                    { name: 'Plastic', count: 42 },
                    { name: 'Organic', count: 28 },
                    { name: 'Hazardous', count: 12 },
                    { name: 'E-Waste', count: 18 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {(analytics?.categoriesData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(analytics?.categoriesData || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="text-slate-300 font-medium">{item.name}</span>
                <span className="text-slate-500 font-mono ml-auto">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Trend Area Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 lg:col-span-2">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-eco-400" /> Weekly Complaint & Resolution Velocity
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.trendData || []}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="reported" stroke="#EF4444" fillOpacity={1} fill="url(#colorReported)" name="Reported" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Interactive Map View */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-purple-400" /> Live Waste Hotspot Map & Worker Fleet Positions
        </h2>
        <MapView complaints={complaints} height="400px" />
      </div>

      {/* Complaints Table / Cards for Assignment */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white">All Municipal Complaints ({complaints.length})</h2>
          <span className="text-xs text-purple-400 font-mono">Click 'Assign Worker' on pending items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((item) => (
            <ComplaintCard
              key={item._id}
              complaint={item}
              currentRole="Authority"
              onAssignClick={handleOpenAssignModal}
            />
          ))}
        </div>
      </div>

      {/* WORKER ASSIGNMENT MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" /> Dispatch Worker to Task
              </h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-white">{selectedComplaint.title}</div>
              <div className="text-slate-400">Category: {selectedComplaint.category} | Severity: {selectedComplaint.severity}</div>
              <div className="text-eco-400">Area: {selectedComplaint.location?.area || 'Central'}</div>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Select Available Worker</label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full glass-input text-xs bg-slate-900"
                >
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name} ({w.assignedZone || 'Central Zone'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-extrabold text-xs shadow-glow-purple"
                >
                  {assigning ? 'Dispatching...' : 'Dispatch Task & Send Live Alert'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
