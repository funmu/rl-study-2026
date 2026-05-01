export class KArmedBandit {
  readonly k: number;
  private actionValues: number[];

  constructor(k: number = 10) {
    this.k = k;
    // Each arm's true value is selected from a normal distribution with mean 0 and variance 1
    this.actionValues = Array.from({ length: k }, () => this.randn());
  }

  // Box-Muller transform to approximate normal distribution N(0,1)
  private randn(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  step(action: number): number {
    if (action < 0 || action >= this.k) {
      throw new Error(`Invalid action ${action}. Must be between 0 and ${this.k - 1}`);
    }
    // Return reward from N(true_value, 1)
    return this.actionValues[action] + this.randn();
  }

  getOptimalAction(): number {
    let bestAction = 0;
    let maxVal = this.actionValues[0];
    for (let i = 1; i < this.k; i++) {
        if (this.actionValues[i] > maxVal) {
            maxVal = this.actionValues[i];
            bestAction = i;
        }
    }
    return bestAction;
  }
}

export class BanditProblem {
  private bandits: KArmedBandit[];

  constructor(numBandits: number, k: number = 10) {
    this.bandits = Array.from({ length: numBandits }, () => new KArmedBandit(k));
  }

  step(actions: number[]): number[] {
    if (actions.length !== this.bandits.length) {
      throw new Error(`Expected ${this.bandits.length} actions, got ${actions.length}`);
    }
    return actions.map((action, i) => this.bandits[i].step(action));
  }

  getOptimalActions(): number[] {
    return this.bandits.map(b => b.getOptimalAction());
  }
}
