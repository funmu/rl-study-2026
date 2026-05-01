import { BanditProblem } from './bandit';
import { ActionValueAgent, EpsilonGreedyAgent, GreedyAgent, OptimisticGreedyAgent, UCBAgent, GradientAgent } from './agents';

export interface AgentConfig {
  id: string;
  type: string;
  name: string;
  color: string;
  epsilon?: number;
  initialValue?: number;
  c?: number;
  alpha?: number;
}

export interface MetricPoint {
  step: number;
  [agentName: string]: number;
}

export interface FinalStats {
  agentName: string;
  color: string;
  finalReward: number;
  optimalActionPercent: number;
  cumulativeAverageReward: number;
}

export interface SimulationResults {
  averageReward: MetricPoint[];
  optimalActionPercent: MetricPoint[];
  cumulativeAverageReward: MetricPoint[];
  finalStats: FinalStats[];
}

export class Testbed {
  problem: BanditProblem;
  numSteps: number;
  numRuns: number;
  kArms: number;
  agentConfigs: AgentConfig[];

  constructor(kArms: number, numSteps: number, numRuns: number, configurations: AgentConfig[]) {
    this.kArms = kArms;
    this.numSteps = numSteps;
    this.numRuns = numRuns;
    this.problem = new BanditProblem(numRuns, kArms);
    this.agentConfigs = configurations;
  }

  private createAgentInstance(config: AgentConfig): ActionValueAgent {
    switch (config.type) {
      case 'greedy':
        return new GreedyAgent(this.kArms);
      case 'epsilon_greedy':
        return new EpsilonGreedyAgent(this.kArms, config.epsilon || 0.1);
      case 'optimistic':
        return new OptimisticGreedyAgent(this.kArms, config.initialValue || 5.0);
      case 'ucb':
        return new UCBAgent(this.kArms, config.c || 2.0);
      case 'gradient':
        return new GradientAgent(this.kArms, config.alpha || 0.1);
      default:
        throw new Error(`Unknown agent type: ${config.type}`);
    }
  }

  public run(): SimulationResults {
    const optimalActionsForRuns = this.problem.getOptimalActions();
    
    // Initialize results storage for charts
    const rewardsMap: Record<string, number[]> = {};
    const optimalActionsMap: Record<string, number[]> = {};
    const cumulativeRewardsMap: Record<string, number[]> = {};

    this.agentConfigs.forEach(config => {
      rewardsMap[config.name] = new Array(this.numSteps).fill(0);
      optimalActionsMap[config.name] = new Array(this.numSteps).fill(0);
      cumulativeRewardsMap[config.name] = new Array(this.numSteps).fill(0);
    });

    // Run independent simulations
    for (const config of this.agentConfigs) {
      const allRewards: number[][] = [];
      const allOptActions: number[][] = [];

      for (let run = 0; run < this.numRuns; run++) {
        const agent = this.createAgentInstance(config);
        const bandit = this.problem['bandits'][run]; // Type override to run individually since they maintain internal hidden state cleanly this way
        
        const runRewards: number[] = new Array(this.numSteps);
        const runOptimal: number[] = new Array(this.numSteps);
        const optimalAction = optimalActionsForRuns[run];

        for (let step = 0; step < this.numSteps; step++) {
          const action = agent.selectAction();
          const reward = bandit.step(action);
          agent.update(action, reward);

          runRewards[step] = reward;
          runOptimal[step] = action === optimalAction ? 1 : 0;
        }

        allRewards.push(runRewards);
        allOptActions.push(runOptimal);
      }

      // Average across standard runs
      let runningSum = 0;
      for (let step = 0; step < this.numSteps; step++) {
        let stepRSum = 0;
        let stepOSum = 0;

        for (let run = 0; run < this.numRuns; run++) {
          stepRSum += allRewards[run][step];
          stepOSum += allOptActions[run][step];
        }

        const avgR = stepRSum / this.numRuns;
        const avgO = stepOSum / this.numRuns;

        rewardsMap[config.name][step] = avgR;
        optimalActionsMap[config.name][step] = avgO * 100; // Format as percentage
        
        runningSum += avgR;
        cumulativeRewardsMap[config.name][step] = runningSum / (step + 1);
      }
    }

    // Transform into Recharts format
    const averageReward: MetricPoint[] = [];
    const optimalActionPercent: MetricPoint[] = [];
    const cumulativeAverageReward: MetricPoint[] = [];
    
    for (let step = 0; step < this.numSteps; step++) {
        const avgPoint: MetricPoint = { step };
        const optPoint: MetricPoint = { step };
        const cumPoint: MetricPoint = { step };

        this.agentConfigs.forEach(config => {
            avgPoint[config.name] = rewardsMap[config.name][step];
            optPoint[config.name] = optimalActionsMap[config.name][step];
            cumPoint[config.name] = cumulativeRewardsMap[config.name][step];
        });

        averageReward.push(avgPoint);
        optimalActionPercent.push(optPoint);
        cumulativeAverageReward.push(cumPoint);
    }

    // Extract final scoreboard stats
    const finalStats: FinalStats[] = this.agentConfigs.map(config => {
        // We take the average over the last 50 steps for the final reward to smooth it slightly
        const last50R = rewardsMap[config.name].slice(-50).reduce((a, b) => a + b, 0) / 50;
        const last50O = optimalActionsMap[config.name].slice(-50).reduce((a, b) => a + b, 0) / 50;
        
        return {
            agentName: config.name,
            color: config.color,
            finalReward: last50R,
            optimalActionPercent: last50O,
            cumulativeAverageReward: cumulativeRewardsMap[config.name][this.numSteps - 1]
        };
    });

    return {
        averageReward,
        optimalActionPercent,
        cumulativeAverageReward,
        finalStats
    };
  }
}
