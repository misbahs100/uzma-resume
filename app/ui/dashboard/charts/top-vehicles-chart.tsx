'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopVehiclesChart({ data }: { data: { vehicle: string; totalBookings: number }[] }) {
  return (
    
    <div className="w-full h-80 bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">
       Top Performing Vehicles (Last 30 Days)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="vehicle" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalBookings" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
