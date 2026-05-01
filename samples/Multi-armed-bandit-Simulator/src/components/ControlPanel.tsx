import { useState } from 'react';
import { AgentConfig, SimulationResults } from '../simulation/experiment';
import { PlusCircle, X, Shuffle, AlertCircle, Download } from 'lucide-react';

interface ControlPanelProps {
  onRunSimulation: (
    kArms: number, 
    numSteps: number, 
    numRuns: number, 
    agents: AgentConfig[]
  ) => void;
  isSimulating: boolean;
  onClear: () => void;
  results: SimulationResults | null;
}

const DEFAULT_COLORS = [
  '#2563EB', '#DC2626', '#16A34A', '#D97706', '#9333EA', '#0891B2', '#BE185D'
];

export function ControlPanel({ onRunSimulation, isSimulating, onClear, results }: ControlPanelProps) {
  const [kArms, setKArms] = useState<number>(10);
  const [numSteps, setNumSteps] = useState<number>(1000);
  const [numRuns, setNumRuns] = useState<number>(1000);

  const [agents, setAgents] = useState<AgentConfig[]>([
    { id: '1', type: 'greedy', name: 'Greedy', color: DEFAULT_COLORS[0] },
    { id: '2', type: 'epsilon_greedy', name: 'Epsilon = 0.01', epsilon: 0.01, color: DEFAULT_COLORS[1] },
    { id: '3', type: 'epsilon_greedy', name: 'Epsilon = 0.1', epsilon: 0.1, color: DEFAULT_COLORS[2] },
    { id: '4', type: 'optimistic', name: 'Optimistic (Q=5)', initialValue: 5.0, color: DEFAULT_COLORS[3] },
    { id: '5', type: 'ucb', name: 'UCB (c=2)', c: 2.0, color: DEFAULT_COLORS[4] },
  ]);

  const [newAgentType, setNewAgentType] = useState<string>('epsilon_greedy');
  const [error, setError] = useState<string | null>(null);

  const handleAddAgent = () => {
    if (agents.length >= 7) {
      setError("Maximum 7 agents supported for visual clarity.");
      return;
    }
    setError(null);
    const id = Date.now().toString();
    const color = DEFAULT_COLORS[agents.length % DEFAULT_COLORS.length];
    
    const baseConfig: AgentConfig = { id, type: newAgentType, name: '', color };
    
    switch (newAgentType) {
      case 'greedy': baseConfig.name = `Greedy ${id.slice(-3)}`; break;
      case 'epsilon_greedy': baseConfig.name = `Eps=0.1`; baseConfig.epsilon = 0.1; break;
      case 'optimistic': baseConfig.name = `Opt (Q=5)`; baseConfig.initialValue = 5.0; break;
      case 'ucb': baseConfig.name = `UCB (c=2)`; baseConfig.c = 2.0; break;
      case 'gradient': baseConfig.name = `Gradient (a=0.1)`; baseConfig.alpha = 0.1; break;
    }
    setAgents([...agents, baseConfig]);
  };

  const removeAgent = (id: string) => { setAgents(agents.filter(a => a.id !== id)); setError(null); };
  const updateAgent = (id: string, updates: Partial<AgentConfig>) => { setAgents(agents.map(a => a.id === id ? { ...a, ...updates } : a)); };

  const handleRun = () => {
    if (agents.length === 0) {
      setError("Add at least one agent to run simulation.");
      return;
    }
    setError(null);
    onRunSimulation(kArms, numSteps, numRuns, agents);
  };

  const exportCsv = () => {
    if (!results || results.finalStats.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,Agent,Final Average Reward,Optimal Action %,Cumulative Average Reward\n";
    results.finalStats.forEach(stat => {
        csvContent += `"${stat.agentName}",${stat.finalReward.toFixed(4)},${stat.optimalActionPercent.toFixed(2)}%,${stat.cumulativeAverageReward.toFixed(4)}\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "bandit_results.csv";
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="px-5 pt-6 pb-4 bg-white border-b border-gray-200 z-10 shadow-sm flex-shrink-0">
        <h2 className="text-xl font-black text-gray-900 mb-1 tracking-tight">Bandit Testbed</h2>
        <p className="text-xs text-gray-500 font-medium">Configure parameters and agents</p>
      </div>

      <div className="flex-grow overflow-y-auto px-5 py-4 space-y-6">
        
        {/* Environment Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <span className="bg-gray-800 w-1.5 h-4 rounded-sm mr-2 inline-block"></span> Environment
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase truncate" title="Number of Arms (k)">Arms (k)</label>
              <input type="number" min={2} max={100} value={kArms} onChange={e => setKArms(Number(e.target.value))} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase truncate" title="Number of Steps">Steps</label>
              <input type="number" min={10} max={10000} value={numSteps} onChange={e => setNumSteps(Number(e.target.value))} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase truncate" title="Number of Runs for Averaging">Runs</label>
              <input type="number" min={1} max={5000} value={numRuns} onChange={e => setNumRuns(Number(e.target.value))} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Agents & Results Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center">
              <span className="bg-blue-600 w-1.5 h-4 rounded-sm mr-2 inline-block"></span> Agents & Results
            </h3>
            {results && results.finalStats.length > 0 && (
              <button onClick={exportCsv} className="text-[11px] px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center rounded-md transition-colors"><Download size={12} className="mr-1"/> CSV</button>
            )}
            {!results && <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-100">{agents.length} / 7</span>}
          </div>

          <div className="space-y-3">
            {agents.map((agent) => {
              const agentResult = results?.finalStats.find(s => s.agentName === agent.name);
              return (
                <div key={agent.id} className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm relative group overflow-hidden" style={agentResult ? { borderLeftWidth: '4px', borderLeftColor: agentResult.color } : {}}>
                  <div className="p-2.5">
                    <button onClick={() => removeAgent(agent.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-0.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                    
                    <div className="flex items-center space-x-2 pr-6">
                      <input type="color" value={agent.color} onChange={e => updateAgent(agent.id, { color: e.target.value })} className="w-4 h-4 rounded-sm cursor-pointer border-0 p-0 flex-shrink-0" />
                      
                      <input type="text" value={agent.name} onChange={e => updateAgent(agent.id, { name: e.target.value })} className="flex-grow min-w-[80px] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none text-sm font-bold text-gray-800 truncate transition-colors" />
                      
                      <div className="flex-shrink-0 flex items-center justify-end space-x-1.5 ml-auto">
                        {agent.type === 'epsilon_greedy' && (
                          <><span className="text-[10px] text-gray-500 font-bold uppercase">Eps:</span><input type="number" step="0.01" min="0" max="1" value={agent.epsilon} onChange={e => updateAgent(agent.id, { epsilon: Number(e.target.value) })} className="w-14 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1" /></>
                        )}
                        {agent.type === 'optimistic' && (
                          <><span className="text-[10px] text-gray-500 font-bold uppercase">Q0:</span><input type="number" step="0.5" value={agent.initialValue} onChange={e => updateAgent(agent.id, { initialValue: Number(e.target.value) })} className="w-14 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1" /></>
                        )}
                        {agent.type === 'ucb' && (
                          <><span className="text-[10px] text-gray-500 font-bold uppercase">c:</span><input type="number" step="0.1" value={agent.c} onChange={e => updateAgent(agent.id, { c: Number(e.target.value) })} className="w-14 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1" /></>
                        )}
                        {agent.type === 'gradient' && (
                          <><span className="text-[10px] text-gray-500 font-bold uppercase">α:</span><input type="number" step="0.05" value={agent.alpha} onChange={e => updateAgent(agent.id, { alpha: Number(e.target.value) })} className="w-14 px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:ring-1" /></>
                        )}
                      </div>
                    </div>
                  </div>

                  {agentResult && (
                    <div className="bg-white px-3 py-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs">
                      <div className="flex flex-col"><span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Reward</span><span className="font-bold text-gray-900">{agentResult.finalReward.toFixed(3)}</span></div>
                      <div className="flex flex-col"><span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Optimal %</span><span className="font-bold text-gray-900">{agentResult.optimalActionPercent.toFixed(1)}%</span></div>
                      <div className="flex flex-col"><span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Cum. Avg</span><span className="font-bold text-gray-900">{agentResult.cumulativeAverageReward.toFixed(3)}</span></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
            <select value={newAgentType} onChange={e => setNewAgentType(e.target.value)} className="flex-grow px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="greedy">Greedy</option>
              <option value="epsilon_greedy">Epsilon-Greedy</option>
              <option value="optimistic">Optimistic Init</option>
              <option value="ucb">UCB</option>
              <option value="gradient">Gradient</option>
            </select>
            <button onClick={handleAddAgent} disabled={agents.length >= 7 || isSimulating} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md border border-blue-200 disabled:opacity-50 transition-colors shadow-sm"><PlusCircle size={18} /></button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-5 mb-3 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg flex items-start space-x-2 border border-red-100 shadow-sm z-10">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Controls Section Wrapper */}
      <div className="px-5 py-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_rgba(0,0,0,0.02)] z-10">
        <div className="flex space-x-3">
          <button onClick={onClear} disabled={isSimulating || agents.length === 0} className="flex-1 py-2.5 px-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 text-sm flex items-center justify-center space-x-2 transition-all">
            <Shuffle size={16} /><span>Clear</span>
          </button>
          <button onClick={handleRun} disabled={isSimulating} className="flex-[2] py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.98]">
            {isSimulating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span>Running...</span></> : <span>Run Simulation</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
