"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";

type InventoryStatsProps = {
  pieChartData: { name: string; value: number }[];
  barChartData: { name: string; old: number; new: number }[];
};

const COLORS = ["#00BFFF", "#14b8a6"]; // New, Old

export default function InventoryStats({
  pieChartData,
  barChartData,
}: InventoryStatsProps) {
  return (
    <div className="w-full bg-white rounded-xl p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Pie Chart */}
        <div className="rounded-xl bg-white shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Stock by Condition
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-xl bg-white shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Stock by Item Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill={COLORS[1]} name="New Stock" />
                <Bar dataKey="old" fill={COLORS[0]} name="Old Stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
