import React, { useState, useEffect } from 'react';
import { Award, ShoppingBag, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function RewardCatalog() {
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/rewards/').then(res => setRewards(res.data));
  }, []);

  const handleRedeem = (id) => {
    axios.post(`/api/rewards/${id}/redeem/`)
      .then(() => setMessage('Incentive successfully redeemed![cite: 1]'))
      .catch(err => setMessage(err.response.data.error || 'Redemption failed.'));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
        <Award className="text-amber-500" /> Rewards Marketplace
      </h2>
      {message && <div className="p-3 mb-4 bg-gray-50 text-sm text-gray-700 rounded-lg border">{message}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewards.map(item => (
          <div key={item.id} className="p-4 border rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.points_required} Points Needed[cite: 1]</p>
              <p className="text-xs text-gray-400 mt-1">Stock: {item.stock}</p>
            </div>
            <button 
              onClick={() => handleRedeem(item.id)}
              disabled={item.stock <= 0}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <ShoppingBag size={14} /> Redeem[cite: 1]
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}