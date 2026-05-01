export abstract class ActionValueAgent {
  k: number;
  initialValue: number;
  qEstimates: number[];
  actionCounts: number[];
  t: number;

  constructor(k: number, initialValue: number = 0.0) {
    this.k = k;
    this.initialValue = initialValue;
    this.qEstimates = Array(k).fill(initialValue);
    this.actionCounts = Array(k).fill(0);
    this.t = 0;
  }

  abstract selectAction(): number;

  update(action: number, reward: number): void {
    if (action < 0 || action >= this.k) {
      throw new Error("Invalid action for update");
    }
    this.actionCounts[action] += 1;
    const n = this.actionCounts[action];
    const prevQ = this.qEstimates[action];
    
    // Incremental update formula
    this.qEstimates[action] = prevQ + (1.0 / n) * (reward - prevQ);
    this.t += 1;
  }
}

export class GreedyAgent extends ActionValueAgent {
  selectAction(): number {
    return this.argmaxTieRandom(this.qEstimates);
  }

  private argmaxTieRandom(arr: number[]): number {
    let maxVal = arr[0];
    let maxIndices = [0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
            maxIndices = [i];
        } else if (Math.abs(arr[i] - maxVal) < 1e-10) {
            maxIndices.push(i);
        }
    }
    return maxIndices[Math.floor(Math.random() * maxIndices.length)];
  }
}

export class EpsilonGreedyAgent extends GreedyAgent {
  epsilon: number;
  
  constructor(k: number, epsilon: number = 0.1) {
    super(k, 0.0);
    this.epsilon = epsilon;
  }

  selectAction(): number {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.k);
    }
    return super.selectAction();
  }
}

export class OptimisticGreedyAgent extends GreedyAgent {
  constructor(k: number, initialValue: number = 5.0) {
    super(k, initialValue);
  }
}

export class UCBAgent extends ActionValueAgent {
  c: number;

  constructor(k: number, c: number = 2.0) {
    super(k, 0.0);
    this.c = c;
  }

  selectAction(): number {
    const ucbValues = this.qEstimates.map((q, a) => {
      const n = this.actionCounts[a];
      if (n === 0) return Infinity; // Ensure all actions are tried at least once
      const explorationTerm = this.c * Math.sqrt(Math.log(this.t) / n);
      return q + explorationTerm;
    });

    return this.argmaxTieRandom(ucbValues);
  }

  private argmaxTieRandom(arr: number[]): number {
    let maxVal = arr[0];
    let maxIndices = [0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
            maxIndices = [i];
        } else if (Math.abs(arr[i] - maxVal) < 1e-10) {
            maxIndices.push(i);
        }
    }
    return maxIndices[Math.floor(Math.random() * maxIndices.length)];
  }
}

export class GradientAgent extends ActionValueAgent {
  alpha: number;
  preferences: number[];

  constructor(k: number, alpha: number = 0.1) {
    super(k, 0.0);
    this.alpha = alpha;
    this.preferences = Array(k).fill(0.0);
  }

  private softmax(): number[] {
    // Subtract max for numerical stability
    const maxPref = Math.max(...this.preferences);
    const exps = this.preferences.map(p => Math.exp(p - maxPref));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sumExps);
  }

  selectAction(): number {
    const probs = this.softmax();
    const r = Math.random();
    let cumsum = 0;
    for (let i = 0; i < this.k; i++) {
        cumsum += probs[i];
        if (r <= cumsum) return i;
    }
    return this.k - 1; // Fallback
  }

  update(action: number, reward: number): void {
    const probs = this.softmax();
    
    // Calculate average reward baseline
    let avgReward = 0;
    if (this.t > 0) {
      avgReward = this.qEstimates[0]; // Reuse qEstimates[0] as our running average reward baseline
    }
    
    // Update preferences appropriately
    for (let a = 0; a < this.k; a++) {
        if (a === action) {
            this.preferences[a] += this.alpha * (reward - avgReward) * (1 - probs[a]);
        } else {
            this.preferences[a] -= this.alpha * (reward - avgReward) * probs[a];
        }
    }

    // Update the average reward baseline seamlessly
    this.t += 1;
    const prevBaseline = avgReward;
    this.qEstimates[0] = prevBaseline + (1.0 / this.t) * (reward - prevBaseline);
  }
}
