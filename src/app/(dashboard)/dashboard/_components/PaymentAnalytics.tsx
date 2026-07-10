'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { IndianRupeeIcon, CreditCard, Banknote, Landmark } from 'lucide-react';

export function PaymentAnalytics({ 
  paymentData,
  totalRevenue,
  pendingPayments,
  failedPayments
}: { 
  paymentData: { name: string; value: number; color: string }[],
  totalRevenue: number,
  pendingPayments: number,
  failedPayments: number
}) {
  return (
    <div className="bg-white border border-brand-border rounded-xl p-5">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-brand-dark">Payment Methods & Activity</h3>
          <p className="text-sm text-brand-muted">Transaction distribution across platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Chart */}
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [`${value}%`, 'Usage']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <IndianRupeeIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900">Total Processed</p>
                <p className="text-xs text-emerald-700">Successful transactions</p>
              </div>
            </div>
            <p className="font-bold text-emerald-700">{formatCurrency(totalRevenue)}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Landmark className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">Pending Clearance</p>
                <p className="text-xs text-amber-700">Awaiting bank settlement</p>
              </div>
            </div>
            <p className="font-bold text-amber-700">{formatCurrency(pendingPayments)}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-900">Failed Payments</p>
                <p className="text-xs text-red-700">Declined or expired</p>
              </div>
            </div>
            <p className="font-bold text-red-700">{formatCurrency(failedPayments)}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
