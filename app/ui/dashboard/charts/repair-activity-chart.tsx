'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RepairActivityTimeline({ data }: { data: { month: string; repairs: number }[] }) {
  return (
    <div className="mt-8 p-4 rounded-xl bg-white shadow-md dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Repair Activity Timeline (Last 12 Months)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#8884d8" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="repairs" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
