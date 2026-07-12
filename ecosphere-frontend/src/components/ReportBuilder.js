import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';

export default function ReportBuilder() {
  const [filters, setFilters] = useState({ department: '', dateRange: '', module: 'esg-summary' });

  const handleExport = (format) => {
    // Window print operation natively targets clean local document prints[cite: 1]
    if (format === 'pdf') {
      window.print();
    } else {
      alert(`Exporting dynamic query selection context into format: ${format.toUpperCase()}[cite: 1]`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="text-emerald-600" /> Custom Analytics Report Builder
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Target Dimension</label>
          <select 
            className="w-full p-2.5 border rounded-lg text-sm bg-gray-50"
            value={filters.module}
            onChange={(e) => setFilters({...filters, module: e.target.value})}
          >
            <option value="environmental">Environmental Matrix[cite: 1]</option>
            <option value="social">Social Metrics[cite: 1]</option>
            <option value="governance">Governance Logs[cite: 1]</option>
            <option value="esg-summary">Unified ESG Summary Report[cite: 1]</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Filter by Department</label>
          <input 
            type="text" 
            placeholder="e.g. Logistics, HR[cite: 1]" 
            className="w-full p-2.5 border rounded-lg text-sm bg-gray-50"
            onChange={(e) => setFilters({...filters, department: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Target Window</label>
          <input 
            type="date" 
            className="w-full p-2.5 border rounded-lg text-sm bg-gray-50"
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <button onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors">
          <Download size={14} /> Export Standalone PDF[cite: 1]
        </button>
        <button onClick={() => handleExport('csv')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
          CSV Sheet[cite: 1]
        </button>
      </div>
    </div>
  );
}