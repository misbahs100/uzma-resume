"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ['#ccfbf1', '#14b8a6'];

export default function BookingTrendChart({
  data,
}: {
  data: { name: string; bookings: number }[];
}) {
  return (
    <div className="w-full h-80 bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">
        Bookings Overview (Last 6 Months)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="area-color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="bookings"
            stroke={COLORS[0]}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#area-color)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
