# Product Requirements Document: Multi-Armed Bandit Testbed (v2app)

## 1. Executive Summary
The `v2app` is a modern, interactive web application that serves as a testbed for the classic $k$-armed bandit problem in reinforcement learning. It translates algorithmic concepts into a highly visual, browser-based simulator, allowing users to experiment with the fundamental trade-off between exploration and exploitation.

## 2. Objectives
- **Educational Tooling**: Provide an intuitive interface for students and researchers to visualize how different RL agents perform under varying conditions.
- **Real-time Interaction**: Allow dynamic configuration of environments and agent hyperparameters without needing to write code.
- **Comparative Analysis**: Enable side-by-side performance comparisons of multiple strategies over statistical averages.

## 3. Core Features
### 3.1 Global Simulation Configuration
Users can define the fundamental parameters of the bandit environment:
- **Number of Arms ($k$)**: The number of possible actions.
- **Steps per Run**: The duration of a single learning episode.
- **Number of Runs**: The number of independent runs to average over for statistical significance.

### 3.2 Agent Sandbox
Users can add, remove, and configure up to 7 distinct agents in a single simulation. Supported strategies include:
- **Greedy**: Always exploits the highest estimated value.
- **$\epsilon$-Greedy**: Explores randomly with probability $\epsilon$.
- **Optimistic Initial Values**: Encourages early exploration via artificially high initial estimates (requires configuring initial value $Q_1$).
- **Upper-Confidence-Bound (UCB)**: Balances exploration/exploitation using uncertainty bounds (requires confidence level $c$).
- **Gradient Bandit**: Learns relative action preferences using a softmax distribution (requires step-size $\alpha$).

### 3.3 Visual Canvas
A dashboard of responsive charts (powered by Recharts) updates upon running the simulation:
- **Average Reward Over Time**: Line chart showing learning curves.
- **% Optimal Action Over Time**: Line chart showing convergence to the true best action.
- **Cumulative Average Reward**: Line chart showing total accumulated reward normalized by time.
- **Final Average Reward Comparison**: Bar chart summarizing the end-state performance of each configured agent.

### 3.4 Data Export
- Ability to export the final tabular simulation statistics to a CSV file for external analysis.

## 4. Technical Architecture
- **Frontend Framework**: React with TypeScript, built using Vite for fast compilation.
- **Styling**: Tailwind CSS for responsive, utility-first UI design.
- **Visualization**: Recharts for rendering SVG-based charts.
- **Simulation Engine**: Pure TypeScript classes decoupled from UI (`experiment.ts`, `bandit.ts`, `agents.ts`). The testbed runs synchronously in the browser, using standard object-oriented patterns to manage bandit states and agent updates.
