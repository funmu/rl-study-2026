import { MetricPoint } from '../simulation/experiment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: MetricPoint[];
  title: string;
  yAxisLabel: string;
  agents: { name: string; color: string }[];
  yDomain?: [number | string, number | string];
}

export function MetricLineChart({ data, title, yAxisLabel, agents, yDomain }: ChartProps) {
  // We sub-sample data if it's too large to prevent complete browser lockups during rendering
  // rendering 1000 points * 5 lines * 3 charts = 15,000 SVG elements. Recharts gets slow.
  // We can safely sample down to ~150 points for visualization without losing the shape of the curve.
  
  const sampleRate = Math.max(1, Math.floor(data.length / 150));
  const sampledData = data.filter((_, idx) => idx % sampleRate === 0 || idx === data.length - 1);

  return (
    <div className="flex flex-col h-full w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">{title}</h3>
      <div className="flex-grow min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampledData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="step" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: 'Steps', position: 'bottom', fill: '#1F2937', fontSize: 13, fontWeight: 'bold', offset: 5 }}
            />
            <YAxis 
              domain={yDomain || ['auto', 'auto']}
              tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#1F2937', fontSize: 13, fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: 13 }}
              labelStyle={{ fontSize: 13, fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
              formatter={(value: number) => [value.toFixed(3), '']}
              labelFormatter={(label) => `Step: ${label}`}
            />
            <Legend 
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: 12, fontWeight: 500, paddingBottom: '15px' }}
              iconType="circle"
              iconSize={8}
            />
            {agents.map(agent => (
              <Line 
                key={agent.name}
                type="monotone" 
                dataKey={agent.name} 
                stroke={agent.color} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false} // Disable animation for performance on thousands of points
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
