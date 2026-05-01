import React from 'react';
import Plot from 'react-plotly.js';

interface SurfacePlot3DProps {
  title: string;
  data: number[][];
}

export const SurfacePlot3D: React.FC<SurfacePlot3DProps> = ({ title, data }) => {
  // data is a 10x10 array: rows are playerSum (12-21), cols are dealerCard (1-10)
  
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
              type: 'surface',
              colorscale: 'Viridis',
              showscale: true,
            }
          ]}
          layout={{
            autosize: true,
            margin: { l: 0, r: 0, b: 0, t: 0 },
            scene: {
              xaxis: { title: 'Dealer Showing' },
              yaxis: { title: 'Player Sum' },
              zaxis: { title: 'Value', range: [-1, 1] },
              camera: {
                eye: { x: -1.5, y: -1.5, z: 0.5 }
              }
            }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};
