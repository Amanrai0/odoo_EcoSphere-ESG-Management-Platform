import React from 'react';
import RewardCatalog from './components/RewardCatalog';
import ReportBuilder from './components/ReportBuilder';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <header className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-7xl mx-auto">
        <h1 className="text-xl font-black text-gray-800">EcoSphere ESG Management Platform</h1>
        <p className="text-xs text-gray-500 font-medium">Ayush's Workspace: Gamification & Aggregation Center</p>
      </header>
      
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RewardCatalog />
        <ReportBuilder />
      </main>
    </div>
  );
}

export default App;