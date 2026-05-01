import React from 'react';
import Plot from 'react-plotly.js';

interface Heatmap2DProps {
  title: string;
  data: number[][];
}

export const Heatmap2D: React.FC<Heatmap2DProps> = ({ title, data }) => {
  const yValues = Array.from({ length: 10 }, (_, i) => i + 12); // Player Sum: 12-21
  const xValues = Array.from({ length: 10 }, (_, i) => i + 1);  // Dealer Card: 1-10

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <h3 className="text-md font-semibold p-4 pb-0 text-gray-700">{title}</h3>
      <div className="flex-grow">
        <Plot
          data={[
            {
              z: data,
              x: xValues,
              y: yValues,
              type: 'heatmap',
              colorscale: 'Viridis',
              zmin: -1,
              zmax: 1,
            }
          ]}
          layout={{
            autosize: true,
            margin: { l: 50, r: 20, b: 50, t: 20 },
            xaxis: { title: 'Dealer Showing' },
            yaxis: { title: 'Player Sum' }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};
