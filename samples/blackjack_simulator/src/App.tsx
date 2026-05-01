import { useState } from 'react';
import { StateValueFunction, MonteCarloTestbed } from './simulation/experiment';
import { ControlPanel } from './components/ControlPanel';
import { SurfacePlot3D } from './visual_components/SurfacePlot3D';
import { Heatmap2D } from './visual_components/Heatmap2D';
import './index.css';

function App() {
  const [results, setResults] = useState<StateValueFunction | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = (numEpisodes: number, playerThreshold: number, dealerThreshold: number) => {
    setIsSimulating(true);

    // Use setTimeout to allow UI to update to "Simulating..." state before blocking main thread
    setTimeout(() => {
      try {
        const testbed = new MonteCarloTestbed(numEpisodes, playerThreshold, dealerThreshold);
        const simResults = testbed.run();
        setResults(simResults);
      } catch (err) {
        console.error("Simulation failed:", err);
      } finally {
        setIsSimulating(false);
      }
    }, 50);
  };

  const handleClear = () => {
    setResults(null);
  };

  return (
    <div className="app-container h-screen w-screen overflow-hidden bg-gray-100 text-gray-900 flex font-sans">
      {/* Left Column (20-25%) */}
      <div className="left-column w-1/4 min-w-[320px] max-w-[400px] h-full flex flex-col border-r border-gray-200 bg-slate-50 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <ControlPanel
          onRunSimulation={handleRunSimulation}
          isSimulating={isSimulating}
          onClear={handleClear}
          results={results}
        />
      </div>

      {/* Right Column (75-80%) Visual Canvas */}
      <div className="right-column flex-grow h-full p-4 overflow-y-auto bg-slate-50">
        {!results && !isSimulating ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <svg className="w-24 h-24 mb-6 opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 16H5V5h14v14z" />
              <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 5h2v5h-2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-300">No Data Available</h2>
            <p className="mt-2 text-gray-400">Run a simulation from the control panel to view state-value functions</p>
          </div>
        ) : (
          <div className="graphs-grid w-full h-[1200px] grid grid-cols-2 grid-rows-2 gap-4 pb-4">
            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm h-full">
              {results && (
                <SurfacePlot3D
                  title="State-Value Function (No Usable Ace)"
                  data={results.noUsableAce}
                />
              )}
            </div>

            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm h-full">
              {results && (
                <SurfacePlot3D
                  title="State-Value Function (Usable Ace)"
                  data={results.usableAce}
                />
              )}
            </div>

            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm h-full">
              {results && (
                <Heatmap2D
                  title="Heatmap (No Usable Ace)"
                  data={results.noUsableAce}
                />
              )}
            </div>

            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm h-full">
              {results && (
                <Heatmap2D
                  title="Heatmap (Usable Ace)"
                  data={results.usableAce}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
