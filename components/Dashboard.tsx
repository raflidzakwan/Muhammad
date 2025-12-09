import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, Users, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { FinancialTransaction, InsightResult } from '../types';
import { generateFinancialInsights } from '../services/geminiService';

interface DashboardProps {
  transactions: FinancialTransaction[];
}

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className={`text-xs mt-2 ${subtext.includes('+') ? 'text-emerald-600' : 'text-slate-400'}`}>
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [insights, setInsights] = useState<InsightResult[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Mock data for the chart
  const data = [
    { name: 'Mon', revenue: 4000, expenses: 2400 },
    { name: 'Tue', revenue: 3000, expenses: 1398 },
    { name: 'Wed', revenue: 2000, expenses: 9800 },
    { name: 'Thu', revenue: 2780, expenses: 3908 },
    { name: 'Fri', revenue: 1890, expenses: 4800 },
    { name: 'Sat', revenue: 2390, expenses: 3800 },
    { name: 'Sun', revenue: 3490, expenses: 4300 },
  ];

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const results = await generateFinancialInsights(transactions);
      setInsights(results);
      setLoadingInsights(false);
    };

    // In a real app, we might cache this or trigger manually to save API calls
    // For demo, we run it on mount if we have data
    if (transactions.length > 0) {
      fetchInsights();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Overview</h2>
          <p className="text-slate-500 text-sm">Real-time operational and financial intelligence</p>
        </div>
        <button 
          onClick={() => generateFinancialInsights(transactions).then(setInsights)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Lightbulb size={16} />
          Refresh AI Insights
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$1,240,500" 
          subtext="+12.5% vs last month" 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Active Patients" 
          value="342" 
          subtext="85% Bed Occupancy Rate" 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Avg. Waiting Time" 
          value="14 min" 
          subtext="-2 min improvement" 
          icon={Activity} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Net Profit Margin" 
          value="18.2%" 
          subtext="+1.2% year over year" 
          icon={TrendingUp} 
          color="bg-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue vs Expenses</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            Gemini Strategic Analysis
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] custom-scrollbar">
            {loadingInsights ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-20 bg-slate-100 rounded-lg"></div>
                <div className="h-20 bg-slate-100 rounded-lg"></div>
                <div className="h-20 bg-slate-100 rounded-lg"></div>
              </div>
            ) : insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-800 text-sm">{insight.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                      ${insight.severity === 'high' ? 'bg-red-100 text-red-700' : 
                        insight.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {insight.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{insight.insight}</p>
                  <div className="text-xs font-medium text-indigo-700 bg-indigo-50 p-2 rounded">
                    Recommended: {insight.actionable}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-10">
                <p>No insights generated yet.</p>
                <p className="text-xs mt-2">Click Refresh to analyze financial data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;