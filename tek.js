import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Leaf, Users, ShieldCheck, Sprout, Award, AlertTriangle, Upload, CheckCircle 
} from 'lucide-react';

// Mock Data matching the database structure
const departmentData = [
  { name: 'Logistics', environmental: 88, social: 94, governance: 95 },
  { name: 'Manufacturing', environmental: 62, social: 80, governance: 78 },
  { name: 'HR & Admin', environmental: 85, social: 90, governance: 88 },
  { name: 'Sales & Mktg', environmental: 75, social: 76, governance: 82 },
];

export default function EsgDashboard() {
  const [treeCount, setTreeCount] = useState(1);
  const [species, setSpecies] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePlantationSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900 selection:bg-emerald-100">
      
      {/* Top Professional Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 text-white p-2 rounded-lg font-bold text-xl tracking-tight">🌱</div>
          <span className="text-xl font-bold tracking-tight text-gray-800">EcoSphere <span className="text-emerald-600">ESG</span></span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <button className="text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1">Dashboard</button>
          <button className="hover:text-emerald-600 transition-colors">Environmental</button>
          <button className="hover:text-emerald-600 transition-colors">Social</button>
          <button className="hover:text-emerald-600 transition-colors">Governance</button>
          <button className="hover:text-emerald-600 transition-colors">Gamification</button>
          <button className="bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">Settings</button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* 1. Global Score Summary Card */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Global Corporate Performance Summary</h2>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-gray-800">Overall ESG Status: <span className="text-emerald-600">82.5 / 100</span></h1>
            <p className="text-sm text-gray-500 mt-1">Weighted configuration: 40% Environmental | 30% Social | 30% Governance</p>
          </div>
          <div className="w-full md:w-72 bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: '82.5%' }}></div>
          </div>
        </section>

        {/* 2. Key Metric Pillar Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Environmental</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Leaf size={20} /></div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-gray-800">78 <span className="text-sm text-gray-400">/100</span></span>
              <p className="text-xs text-gray-500 mt-1">Carbon: 240 Tons CO2 (Target: 200 Max)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Social Matrix</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-gray-800">85 <span className="text-sm text-gray-400">/100</span></span>
              <p className="text-xs text-gray-500 mt-1">CSR Participation: 78% (142 Active Volunteers)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Governance Integrity</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><ShieldCheck size={20} /></div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black text-gray-800">86 <span className="text-sm text-gray-400">/100</span></span>
              <p className="text-xs text-gray-500 mt-1">Policy Sign-offs: 94% | 2 Open Issues ⚠️</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-xl text-white shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold opacity-80">Plantation Total</span>
              <div className="p-2 bg-white/20 text-white rounded-lg"><Sprout size={20} /></div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black">1,420 <span className="text-xs font-normal opacity-70">Trees</span></span>
              <p className="text-xs opacity-90 mt-1">Generated +14,200 Environmental Credits</p>
            </div>
          </div>
          
        </section>

        {/* 3. Main Data Visualization Block */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Wrapper */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4">Departmental Performance Comparison</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, pt: 10 }} />
                  <Bar dataKey="environmental" name="Environmental" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="social" name="Social" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="governance" name="Governance" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Plantation Module Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Sprout size={20} /></div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Log a Tree Plantation</h3>
                  <p className="text-xs text-gray-400">Earn 10 ESG credits per sapling</p>
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-8 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200 my-4">
                  <CheckCircle className="mx-auto text-emerald-500 mb-2" size={36} />
                  <p className="text-emerald-900 font-bold text-sm">Plantation Logged Successfully!</p>
                  <p className="text-emerald-600 text-xs mt-1">Pending verification for credit issuance.</p>
                </div>
              ) : (
                <form onSubmit={handlePlantationSubmit} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Tree Species</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Neem, Mahogany, Mango" 
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Quantity</label>
                      <input 
                        type="number" 
                        min="1"
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        value={treeCount}
                        onChange={(e) => setTreeCount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Evidence</label>
                      <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-xs font-semibold text-gray-500 transition-colors">
                        <Upload size={14} /> Upload Selfie
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg text-sm font-bold shadow-sm transition-all mt-2">
                    Claim Environmental Credits
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 4. Leaderboard & Alerts Block */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Leaderboard Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-amber-500" size={20} />
              <h3 className="text-base font-bold text-gray-800">Top ESG Champions</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <span className="font-medium text-gray-700">🥇 1. Logistics Team</span>
                <span className="font-bold text-emerald-600">92.4 Pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <span className="font-medium text-gray-700">🥈 2. HR & Administration</span>
                <span className="font-bold text-emerald-600">88.1 Pts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <span className="font-medium text-gray-700">🥉 3. Sales & Marketing</span>
                <span className="font-bold text-emerald-600">79.5 Pts</span>
              </div>
            </div>
          </div>

          {/* Compliance Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="text-base font-bold text-gray-800">Critical Compliance Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 text-red-900 border border-red-100 rounded-lg text-xs">
                <p className="font-bold">🚨 HIGH SEVERITY: Audit #2026-A passed due date!</p>
                <p className="text-red-600 mt-0.5">Assigned Owner: System Admin | Due: 2 Days Ago</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-900 border border-amber-100 rounded-lg text-xs">
                <p className="font-semibold">🔔 POLICY REMINDER: 12 Employees Pending Signature</p>
                <p className="text-amber-600 mt-0.5">Document: Mandatory Data Governance Privacy Policy v2</p>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}