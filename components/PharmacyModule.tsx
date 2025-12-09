import React, { useState } from 'react';
import { Package, TrendingUp, AlertTriangle, Sparkles, ShoppingCart } from 'lucide-react';
import { InventoryItem, ForecastResult } from '../types';
import { predictInventoryNeeds } from '../services/geminiService';

interface PharmacyModuleProps {
  inventory: InventoryItem[];
}

const PharmacyModule: React.FC<PharmacyModuleProps> = ({ inventory }) => {
  const [forecasts, setForecasts] = useState<ForecastResult[]>([]);
  const [isForecasting, setIsForecasting] = useState(false);

  const handleForecast = async () => {
    setIsForecasting(true);
    const results = await predictInventoryNeeds(inventory);
    setForecasts(results);
    setIsForecasting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pharmacy & Inventory</h2>
          <p className="text-slate-500 text-sm">Material Management & Predictive Supply Chain</p>
        </div>
        <button 
          onClick={handleForecast}
          disabled={isForecasting}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all
            ${isForecasting ? 'bg-slate-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'}`}
        >
          {isForecasting ? (
            <span className="flex items-center gap-2">Thinking...</span>
          ) : (
            <>
              <Sparkles size={16} />
              Run AI Forecast
            </>
          )}
        </button>
      </div>

      {/* Forecast Section - Only shows when data exists */}
      {forecasts.length > 0 && (
        <div className="bg-gradient-to-br from-violet-50 to-white p-6 rounded-xl border border-violet-100 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-violet-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Gemini Predictive Demand Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forecasts.map((item) => (
              <div key={item.itemId} className="bg-white p-4 rounded-lg border border-violet-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800">{item.itemName}</h4>
                  <span className="text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded-full font-medium">
                    Order: {item.recommendedOrder}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Predicted Demand:</span>
                    <span className="font-medium text-slate-700">{item.predictedDemand} units</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                  "{item.reasoning}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Current Stock Levels</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">In Stock</th>
              <th className="px-6 py-4 text-center">Reorder Level</th>
              <th className="px-6 py-4 text-center">Weekly Usage</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => {
              const isLowStock = item.currentStock <= item.reorderLevel;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded text-slate-500">
                      <Package size={16} />
                    </div>
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 text-center font-mono font-medium">{item.currentStock}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{item.reorderLevel}</td>
                  <td className="px-6 py-4 text-center text-slate-500">{item.lastUsageRate}</td>
                  <td className="px-6 py-4">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PharmacyModule;