import { FinalStats } from '../simulation/experiment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface ChartProps {
  data: FinalStats[];
  title: string;
}

export function MetricBarChart({ data, title }: ChartProps) {
  // Sort data by final reward for better visualization
  const sortedData = [...data].sort((a, b) => b.finalReward - a.finalReward);

  return (
    <div className="flex flex-col h-full w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">{title}</h3>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="agentName" 
              tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: 13 }}
              formatter={(value: number) => [`${value.toFixed(3)}`, 'Final Reward']}
            />
            <Bar 
              dataKey="finalReward" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList 
                dataKey="finalReward" 
                position="top" 
                formatter={(val: number) => val.toFixed(2)}
                style={{ fontSize: 11, fill: '#374151', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
