import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse">
      <div className="w-full aspect-4/3 bg-slate-800 rounded-xl"></div>
      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
      <div className="h-3 bg-slate-800/80 rounded w-1/2"></div>
      <div className="h-4 bg-slate-800 rounded w-1/3"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-800 rounded w-20"></div>
        <div className="h-8 bg-slate-800 rounded w-16"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-800">
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-16"></div></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
      <td className="py-4 px-4"><div className="h-6 bg-slate-800 rounded w-12"></div></td>
    </tr>
  );
}
