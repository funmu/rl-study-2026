import { useState } from 'react';
import { StateValueFunction } from '../simulation/experiment';
import { Shuffle, Download } from 'lucide-react';

interface ControlPanelProps {
  onRunSimulation: (
    numEpisodes: number,
    playerThreshold: number,
    dealerThreshold: number
  ) => void;
  isSimulating: boolean;
  onClear: () => void;
  results: StateValueFunction | null;
}

export function ControlPanel({ onRunSimulation, isSimulating, onClear, results }: ControlPanelProps) {
  const [numEpisodes, setNumEpisodes] = useState<number>(100000);
  const [playerThreshold, setPlayerThreshold] = useState<number>(20);
  const [dealerThreshold, setDealerThreshold] = useState<number>(17);

  const handleRun = () => {
    onRunSimulation(numEpisodes, playerThreshold, dealerThreshold);
  };

  const exportCsv = () => {
    if (!results) return;
    
    let csvContent = "data:text/csv;charset=utf-8,UsableAce,PlayerSum,DealerShowing,StateValue\n";
    
    for (let u = 0; u < 2; u++) {
      const dataMatrix = u === 1 ? results.usableAce : results.noUsableAce;
      for (let pIdx = 0; pIdx < 10; pIdx++) {
        for (let dIdx = 0; dIdx < 10; dIdx++) {
          const pSum = pIdx + 12;
          const dShow = dIdx + 1;
          const val = dataMatrix[pIdx][dIdx];
          csvContent += `${u === 1 ? 'Yes' : 'No'},${pSum},${dShow},${val.toFixed(4)}\n`;
        }
      }
    }

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "blackjack_state_values.csv";
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="px-5 pt-6 pb-4 bg-white border-b border-gray-200 z-10 shadow-sm flex-shrink-0">
        <h2 className="text-xl font-black text-gray-900 mb-1 tracking-tight">Blackjack Testbed</h2>
        <p className="text-xs text-gray-500 font-medium">Monte Carlo State-Value Evaluation</p>
      </div>

      <div className="flex-grow overflow-y-auto px-5 py-4 space-y-6">
        
        {/* Environment Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <span className="bg-gray-800 w-1.5 h-4 rounded-sm mr-2 inline-block"></span> Environment
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase truncate" title="Number of Episodes">Episodes</label>
              <input type="number" min={10} max={5000000} step={10000} value={numEpisodes} onChange={e => setNumEpisodes(Number(e.target.value))} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Agent Policy Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center">
              <span className="bg-blue-600 w-1.5 h-4 rounded-sm mr-2 inline-block"></span> Policy Config
            </h3>
            {results && (
              <button onClick={exportCsv} className="text-[11px] px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center rounded-md transition-colors"><Download size={12} className="mr-1"/> CSV</button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase truncate" title="Player Threshold">Player Sticks At:</label>
              <input type="number" min={12} max={21} value={playerThreshold} onChange={e => setPlayerThreshold(Number(e.target.value))} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase truncate" title="Dealer Threshold">Dealer Sticks At:</label>
              <input type="number" min={12} max={21} value={dealerThreshold} onChange={e => setDealerThreshold(Number(e.target.value))} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section Wrapper */}
      <div className="px-5 py-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_rgba(0,0,0,0.02)] z-10">
        <div className="flex space-x-3">
          <button onClick={onClear} disabled={isSimulating} className="flex-1 py-2.5 px-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none disabled:opacity-50 text-sm flex items-center justify-center space-x-2 transition-all">
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
