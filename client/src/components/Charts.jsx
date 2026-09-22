import React from 'react';

export function RevenueChart({ data = [] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxRevenue = Math.max(...data.map(d => d.revenue || 0), 50000);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Revenue Growth Trend</h3>
          <p className="text-xs text-slate-400">Monthly revenue breakdown in ₹ (INR)</p>
        </div>
        <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-semibold">
          Live Data
        </span>
      </div>

      <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
        {data.length > 0 ? (
          data.map((item, idx) => {
            const heightPercent = Math.max(10, Math.min(100, ((item.revenue || 0) / maxRevenue) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-slate-700 pointer-events-none z-10 whitespace-nowrap">
                  ₹{(item.revenue || 0).toLocaleString('en-IN')}
                </div>
                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[28px] bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-lg group-hover:brightness-125 transition-all"
                ></div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {months[(item._id - 1) % 12] || `M${item._id}`}
                </span>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
            No revenue recorded yet
          </div>
        )}
      </div>
    </div>
  );
}

export function TopProductsChart({ products = [] }) {
  const maxSold = Math.max(...products.map(p => p.totalSold || 0), 1);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <h3 className="text-sm font-bold text-white">Top 5 Best Selling Products</h3>
      <div className="space-y-3">
        {products.map((prod, idx) => {
          const widthPercent = Math.max(8, ((prod.totalSold || 0) / maxSold) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-300">
                <span className="truncate max-w-[200px]">{prod.name}</span>
                <span className="text-indigo-400 font-semibold">{prod.totalSold} Units</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
