import { useState } from 'react';
import { AgentConfig, SimulationResults, Testbed } from './simulation/experiment';
import { ControlPanel } from './components/ControlPanel';
import { MetricLineChart } from './components/MetricLineChart';
import { MetricBarChart } from './components/MetricBarChart';
import './index.css';

function App() {
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [configuredAgents, setConfiguredAgents] = useState<{ name: string, color: string }[]>([]);

  const handleRunSimulation = (kArms: number, numSteps: number, numRuns: number, agents: AgentConfig[]) => {
    setIsSimulating(true);
    setConfiguredAgents(agents.map(a => ({ name: a.name, color: a.color })));

    // Use setTimeout to allow UI to update to "Simulating..." state before blocking main thread
    setTimeout(() => {
      try {
        const testbed = new Testbed(kArms, numSteps, numRuns, agents);
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
            <p className="mt-2 text-gray-400">Run a simulation from the control panel to view charts</p>
          </div>
        ) : (
          <div className="graphs-grid w-full h-full grid grid-cols-2 grid-rows-2 gap-4 pb-4">
            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm">
              <MetricLineChart
                title="Average Reward Over Time"
                yAxisLabel="Average Reward"
                data={results?.averageReward || []}
                agents={configuredAgents}
              />
            </div>

            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm">
              <MetricLineChart
                title="% Optimal Action Over Time"
                yAxisLabel="Optimal Action %"
                data={results?.optimalActionPercent || []}
                agents={configuredAgents}
                yDomain={[0, 100]}
              />
            </div>

            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm">
              <MetricLineChart
                title="Cumulative Average Reward"
                yAxisLabel="Cumulative Avg Reward"
                data={results?.cumulativeAverageReward || []}
                agents={configuredAgents}
              />
            </div>

            <div className="chart-wrapper rounded-xl overflow-hidden shadow-sm">
              {results?.finalStats && (
                <MetricBarChart
                  title="Final Average Reward Comparison"
                  data={results.finalStats || []}
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
