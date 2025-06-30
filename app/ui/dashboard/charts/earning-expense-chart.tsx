'use client';

import { ComposedChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer, CartesianGrid } from 'recharts';

interface EarningsData {
  month: string;
  earning: number;
  cost: number;
}

export default function MonthlyEarningsChart({ data }: { data: EarningsData[] }) {


  return (
    <div className="mt-6 rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Monthly Earnings & Costs Trend</h2>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#f0f0f0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="earning" barSize={30} fill="#10b981" name="Earnings" />
          <Bar dataKey="cost" barSize={30} fill="#ef4444" name="Costs" />
          <Line type="monotone" dataKey="earning" stroke="#10b981" name="Earnings Line" />
          <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Costs Line" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
