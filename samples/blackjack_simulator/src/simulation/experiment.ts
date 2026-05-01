import { BlackjackEnvironment } from './blackjack';

export interface StateValueFunction {
  // Array [usableAce: 0|1][dealerCard: 1-10][playerSum: 12-21] -> value
  // We'll store it flat or structured. For ease of plotting:
  noUsableAce: number[][]; // [playerSum: 12-21][dealerCard: 1-10]
  usableAce: number[][];   // [playerSum: 12-21][dealerCard: 1-10]
}

export class MonteCarloTestbed {
  public numEpisodes: number;
  public playerThreshold: number;
  public dealerThreshold: number;

  constructor(numEpisodes: number, playerThreshold: number, dealerThreshold: number) {
    this.numEpisodes = numEpisodes;
    this.playerThreshold = playerThreshold;
    this.dealerThreshold = dealerThreshold;
  }

  public run(): StateValueFunction {
    const env = new BlackjackEnvironment();
    
    // We need to accumulate returns and counts for each state.
    // Dimensions: usableAce (2) x playerSum (10: 12-21) x dealerCard (10: 1-10)
    // Indexes:
    // usable: 0 for no, 1 for yes
    // pSumIdx: sum - 12 (0 to 9)
    // dCardIdx: card - 1 (0 to 9)

    const returnsSum = new Array(2).fill(0).map(() => 
      new Array(10).fill(0).map(() => new Array(10).fill(0))
    );
    const returnsCount = new Array(2).fill(0).map(() => 
      new Array(10).fill(0).map(() => new Array(10).fill(0))
    );

    for (let ep = 0; ep < this.numEpisodes; ep++) {
      const { states, reward } = env.playEpisode(this.playerThreshold, this.dealerThreshold);
      
      // First-visit MC: only count the first occurrence of a state in the episode.
      // We can use a set to track visited states
      const visited = new Set<string>();

      for (const state of states) {
        const key = `${state.usableAce}-${state.playerSum}-${state.dealerCard}`;
        if (!visited.has(key)) {
          visited.add(key);
          const uIdx = state.usableAce ? 1 : 0;
          const pIdx = state.playerSum - 12;
          const dIdx = state.dealerCard - 1;
          
          returnsSum[uIdx][pIdx][dIdx] += reward;
          returnsCount[uIdx][pIdx][dIdx] += 1;
        }
      }
    }

    // Compute averages
    const noUsableAce: number[][] = [];
    const usableAce: number[][] = [];

    // For Plotly Heatmap/Surface, X usually corresponds to columns, Y to rows.
    // Let's structure the result as an array of rows, where each row corresponds to a playerSum,
    // and each column corresponds to a dealerCard.
    // So output[pIdx][dIdx]

    for (let pIdx = 0; pIdx < 10; pIdx++) {
      const rowNoAce = [];
      const rowAce = [];
      for (let dIdx = 0; dIdx < 10; dIdx++) {
        const cntNo = returnsCount[0][pIdx][dIdx];
        const valNo = cntNo > 0 ? returnsSum[0][pIdx][dIdx] / cntNo : 0;
        rowNoAce.push(valNo);

        const cntAce = returnsCount[1][pIdx][dIdx];
        const valAce = cntAce > 0 ? returnsSum[1][pIdx][dIdx] / cntAce : 0;
        rowAce.push(valAce);
      }
      noUsableAce.push(rowNoAce);
      usableAce.push(rowAce);
    }

    return {
      noUsableAce,
      usableAce
    };
  }
}
