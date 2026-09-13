import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';
import MapPicker from '../components/MapPicker';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import {
  PlusCircle,
  Sparkles,
  Camera,
  MapPin,
  Cpu,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my-reports');

  // Report Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.2090);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // AI Preview & Processing State
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTimelineComplaint, setSelectedTimelineComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await API.get('/complaints');
      if (res.data?.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error('Failed to load citizen complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setAiResult(null); // Reset AI result when image changes
    }
  };

  // Run AI Vision Classification Preview
  const handleAnalyzeAi = async () => {
    if (!imageFile && !imagePreview) {
      alert('Please upload or select a waste image first.');
      return;
    }

    setAnalyzingAi(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('imageUrl', imagePreview);
      }
      formData.append('description', description);

      const res = await API.post('/ai/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        const analysis = res.data.analysis;
        setAiResult(analysis);
        setCategory(analysis.detectedCategory);
        setSeverity(analysis.severity);
        if (!title) {
          setTitle(`${analysis.detectedCategory} Waste Mound Report`);
        }
      }
    } catch (err) {
      console.error('AI analysis error:', err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!imageFile && !imagePreview) {
      alert('Please attach a waste image.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title || 'Waste Cleanup Report');
      formData.append('description', description);
      formData.append('category', category || 'Mixed');
      formData.append('severity', severity || 'Medium');
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('address', address || 'Pin point on map');

      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('imageUrl', imagePreview);
      }

      const res = await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        setShowReportModal(false);
        resetForm();
        fetchComplaints();
        alert('Waste complaint submitted successfully! AI Vision analyzed and sent live alert to Authorities.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setSeverity('');
    setAddress('');
    setImageFile(null);
    setImagePreview('');
    setAiResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Stats Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/30 text-xs font-semibold">
              Citizen Eco-Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Welcome back, {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Report Waste & Track Cleanups Live
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Upload waste photos for instant Vision AI analysis, auto-detect location, and monitor real-time worker cleanup timeline.
          </p>
        </div>

        {/* Action Button & Reward Points */}
        <div className="flex items-center gap-4 z-10">
          <div className="glass-card px-4 py-3 rounded-2xl border border-amber-500/30 text-center">
            <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-lg">
              <Award className="w-5 h-5" />
              {user?.stats?.pointsEarned || 240} pts
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Citizen Rewards</span>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-eco-500 to-teal-500 hover:from-eco-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-glow-emerald flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            File Waste Report
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-eco-400" />
            My Reported Waste Complaints ({complaints.length})
          </h2>

          <button
            onClick={fetchComplaints}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-eco-400" />
            <p className="text-sm">Fetching real-time complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-slate-500 mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No waste complaints filed yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Help keep your city clean! Click "File Waste Report" to upload a photo and notify municipal workers.
            </p>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-5 py-2.5 rounded-xl bg-eco-500 text-slate-950 font-bold text-xs"
            >
              Report First Waste Mound
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((item) => (
              <div key={item._id} className="relative group">
                <ComplaintCard
                  complaint={item}
                  currentRole="Citizen"
                />
                
                {/* Timeline Modal Trigger */}
                <button
                  onClick={() => setSelectedTimelineComplaint(item)}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Clock className="w-3.5 h-3.5 text-eco-400" />
                  View Live Progress Timeline & Proof
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* NEW REPORT WIZARD MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-eco-400" />
                  Report Waste Incident
                </h3>
                <p className="text-xs text-slate-400">AI Vision will auto-detect category & severity</p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-5">
              
              {/* Step 1: Upload Image & AI Vision Preview */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  1. Upload Waste Photo (Camera / File) *
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="h-40 border-2 border-dashed border-slate-700 hover:border-eco-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/40 p-4 text-center">
                    <Camera className="w-8 h-8 text-eco-400 mb-2" />
                    <span className="text-xs font-semibold text-slate-200">Click to Select Image</span>
                    <span className="text-[10px] text-slate-500">JPG, PNG, WebP up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>

                  {/* Preview Box */}
                  <div className="h-40 rounded-2xl border border-slate-800 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 text-slate-500 text-xs">
                        Image Preview will appear here
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Vision Trigger Button */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleAnalyzeAi}
                    disabled={analyzingAi}
                    className="w-full py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-purple-600/30 transition-all"
                  >
                    <Cpu className={`w-4 h-4 text-purple-400 ${analyzingAi ? 'animate-spin' : ''}`} />
                    {analyzingAi ? 'Analyzing Waste with AI Vision Engine...' : 'Run AI Vision Auto-Classification'}
                  </button>
                )}

                {/* AI Vision Feedback Card */}
                {aiResult && (
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2 text-xs text-slate-200 animate-in fade-in">
                    <div className="flex items-center justify-between text-purple-400 font-bold">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> AI Vision Results</span>
                      <span className="font-mono">{Math.round(aiResult.confidence * 100)}% Match Confidence</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>Category Detected: <strong className="text-white">{aiResult.detectedCategory}</strong></div>
                      <div>Severity Suggested: <strong className="text-amber-400">{aiResult.severity}</strong></div>
                    </div>
                    <p className="text-[11px] text-slate-300 pt-1 border-t border-purple-900/50">
                      Recommendation: {aiResult.recommendation}
                    </p>
                  </div>
                )}
              </div>

              {/* Step 2: Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Plastic bottle dump near station"
                    className="w-full glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full glass-input text-xs bg-slate-900"
                  >
                    <option value="">Auto-detected or Select Category</option>
                    <option value="Plastic">Plastic Waste</option>
                    <option value="Organic">Organic / Wet Waste</option>
                    <option value="Hazardous">Hazardous / Chemicals</option>
                    <option value="E-Waste">E-Waste / Electronics</option>
                    <option value="Bulky">Bulky / Furniture</option>
                    <option value="Construction">Construction Rubble</option>
                    <option value="Mixed">Mixed Waste</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide additional context for sanitation workers..."
                  className="w-full glass-input text-xs"
                />
              </div>

              {/* Step 3: Location Map Picker */}
              <MapPicker
                defaultLat={latitude}
                defaultLng={longitude}
                onSelectLocation={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Address / Landmark Note</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Sector 4, Opposite Bus Stand Gate 2"
                  className="w-full glass-input text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-eco-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-glow-emerald flex items-center gap-1.5"
                >
                  {submitting ? 'Submitting & Broad-casting...' : 'Publish Waste Report'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* TIMELINE PROGRESS & PROOF MODAL */}
      {selectedTimelineComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card max-w-xl w-full rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Complaint Timeline #{selectedTimelineComplaint._id.slice(-6)}
              </h3>
              <button
                onClick={() => setSelectedTimelineComplaint(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Before / After Proof Comparison (if resolved) */}
            {selectedTimelineComplaint.status === 'Resolved' && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-eco-400 uppercase tracking-wider">
                  Before vs After Cleanup Verification Proof
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl overflow-hidden border border-slate-800 h-32 relative">
                    <img src={selectedTimelineComplaint.beforeImage || selectedTimelineComplaint.imageUrl} alt="Before" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-slate-950/80 text-[10px] px-2 py-0.5 rounded text-rose-400 font-bold">BEFORE</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-emerald-500/40 h-32 relative">
                    <img src={selectedTimelineComplaint.afterImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-emerald-950/90 text-[10px] px-2 py-0.5 rounded text-emerald-400 font-bold">AFTER CLEANUP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Steps */}
            <div className="space-y-4 pl-4 border-l-2 border-slate-800">
              {selectedTimelineComplaint.timeline?.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-eco-500 border-2 border-slate-950" />
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{step.status}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{step.note}</p>
                  <span className="text-[10px] text-slate-500 block">By: {step.updatedBy || 'System'}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedTimelineComplaint(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold"
            >
              Close Timeline
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
