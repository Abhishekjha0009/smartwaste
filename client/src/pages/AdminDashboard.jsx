import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldCheck, Users, Edit, Save, RefreshCw, Key, Layers, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRole, setEditRole] = useState('Worker');
  const [editZone, setEditZone] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users');
      if (res.data?.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch user accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user._id);
    setEditRole(user.role);
    setEditZone(user.assignedZone || 'Central Zone');
  };

  const handleSaveUser = async (userId) => {
    try {
      const res = await API.put(`/users/${userId}`, {
        role: editRole,
        assignedZone: editZone
      });

      if (res.data?.success) {
        setEditingUserId(null);
        fetchUsers();
        alert('User details updated successfully');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold">
            System Administration Console
          </span>
          <h1 className="text-2xl font-extrabold text-white">User Management & System Access Control</h1>
          <p className="text-xs text-slate-400">Manage user accounts, assign roles (Citizen, Worker, Authority, Admin), and update zone coverage.</p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 text-rose-400 ${loading ? 'animate-spin' : ''}`} /> Refresh Users
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden space-y-4 p-6">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-400" /> Account Registry ({users.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Current Role</th>
                <th className="p-3.5">Assigned Zone</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/40">
                  <td className="p-3.5 flex items-center gap-2">
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full border border-slate-700 object-cover" />
                    <span className="font-bold text-white">{u.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{u.email}</td>
                  <td className="p-3.5">
                    {editingUserId === u._id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="glass-input py-1 text-xs bg-slate-900"
                      >
                        <option value="Citizen">Citizen</option>
                        <option value="Worker">Worker</option>
                        <option value="Authority">Authority</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold bg-slate-800 border-slate-700 text-slate-200">
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {editingUserId === u._id ? (
                      <input
                        type="text"
                        value={editZone}
                        onChange={(e) => setEditZone(e.target.value)}
                        className="glass-input py-1 text-xs"
                      />
                    ) : (
                      <span>{u.assignedZone || 'Central Zone'}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {editingUserId === u._id ? (
                      <button
                        onClick={() => handleSaveUser(u._id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1 ml-auto"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(u)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 ml-auto"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
