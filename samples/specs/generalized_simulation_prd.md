# Generalized PRD: Interactive RL Simulators

## 1. Overview
This Product Requirements Document (PRD) serves as a generalized blueprint for building web-based, interactive Reinforcement Learning (RL) simulators. 
This framework provides a standardized approach to visualizing RL algorithms, comparing policies, and tweaking hyperparameters in real-time.
It was used in the construction of [Multi-armed-bandit simulator](./v2app_prd.md).
It acts as a reference for future simulator projects, including a planned interactive simulator for Blackjack.

## 2. Core Architecture
The architecture must cleanly separate the mathematical simulation logic from the visual presentation layer, allowing rapid execution while maintaining UI responsiveness.

- **Frontend Application Layer**: React, TypeScript, and Vite.
- **Styling**: Tailwind CSS for a consistent, flexible component system.
- **Visualization Layer**: Recharts (or D3.js for complex state spaces) for responsive charting.
- **Simulation Engine Layer**: Pure, environment-agnostic TypeScript/JavaScript classes. The engine must decouple the environment logic from the agents.
  - `Environment` (e.g., Bandit Problem, Blackjack MDP)
  - `Agent` (e.g., Epsilon-Greedy, Monte Carlo Control)
  - `Testbed` (The runner that orchestrates episodes, collects metrics, and averages runs)

## 3. Standard UI Components
### 3.1 The Control Panel
A persistent side-panel containing:
- **Global Environment Settings**: Variables that dictate the shape of the environment (e.g., number of arms in bandit, starting conditions in Blackjack).
- **Run Settings**: Number of episodes per run, and the number of runs to average over for statistical significance.
- **Agent Sandbox**: Dynamic interface to add, remove, and configure agents. Each agent should be customizable via algorithm-specific hyperparameters (e.g., learning rate $\alpha$, exploration rate $\epsilon$, discount factor $\gamma$).

### 3.2 The Metrics Canvas
The main view area that dynamically updates during or after simulations.
- **Real-time or Post-Run Charts**: Comparing the performance of configured agents.
- **Standard Metrics**:
  - Average Return/Reward per Episode
  - Cumulative Reward
  - Optimal Action % / Win Rate

### 3.3 Data Export
- All simulations must include a feature to export the underlying raw tabular data (CSV) to allow researchers to verify the visualization externally.

---

## 4. Case Study: Interactive Blackjack Simulator
To demonstrate the flexibility of this generalized PRD, here is how the framework translates to creating a new Interactive Simulator for Blackjack (Chapter 5 of Sutton & Barto).

### 4.1 Environment (The Blackjack MDP)
- **State Space**: Player sum (12-21), Dealer showing card (1-10), Usable Ace (boolean).
- **Action Space**: Hit, Stick.
- **Dynamics**: Cards drawn from an infinite deck (or fixed shuffled deck). Dealer plays a fixed policy (Hit until 17).
- **Rewards**: +1 for player win, -1 for loss, 0 for draw.

### 4.2 Agents (Blackjack Policies)
The Sandbox should allow adding various learning agents to compare their efficiency in discovering the optimal policy:
- **Fixed Dealer Policy Agent**: Acts just like the dealer (Hit until 17).
- **Fixed Threshold Agent**: Configurable threshold (e.g., Hit until 20).
- **Monte Carlo Control Agent**: Exploring Starts or $\epsilon$-soft on-policy learning.
- **TD Learning Agent**: SARSA or Q-Learning (Chapter 6).

### 4.3 Visualizations Specific to Blackjack
While standard line charts (Win rate over time) are useful, Blackjack requires state-value visualization:
- **Value Function Heatmaps**: 2D heatmaps or 3D surface plots showing the learned state values for a specific agent across the Player Sum and Dealer Showing axes (separated by usable ace status).
- **Policy Heatmaps**: Showing the learned optimal action (Hit vs Stick) at each state coordinate.
- **Interactive Step-Through**: (Optional) A UI mode allowing a human to play a single episode alongside the agent's live Q-value predictions for educational purposes.
