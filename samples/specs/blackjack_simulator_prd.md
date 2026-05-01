# Product Requirements Document: Interactive Blackjack Simulator

## 1. Overview
This PRD defines the requirements for building a web-based, interactive Reinforcement Learning simulator for the game of Blackjack. The simulator will reproduce the First-Visit Monte Carlo state-value evaluation results found in Chapter 5 (Figure 5.1) of Sutton and Barto's *Reinforcement Learning: An Introduction*. 

Crucially, this application will be built as a layered, reusable solution, heavily adopting the structural patterns and code established in the `Multi-armed-bandit-Simulator`.

## 2. Core Architecture
The architecture must cleanly separate the mathematical simulation logic from the visual presentation layer, allowing rapid execution while maintaining UI responsiveness.

### 2.1 Technology Stack
- **Frontend Framework**: React with TypeScript, bundled with Vite.
- **Styling**: Tailwind CSS.
- **Visualization**: A specialized charting library (such as Plotly.js or Recharts) capable of rendering the required 3D surface meshes and 2D heatmaps.

### 2.2 Layered Engine Design
The core engine will reside in a decoupled directory (e.g., `src/simulation/`), containing pure TypeScript modules:
- **Environment (`blackjack.ts`)**: Represents the Blackjack MDP.
  - *State Space*: Player Hand Sum (12-21), Dealer Showing Card (1-10), Usable Ace (boolean).
  - *Action Space*: Hit, Stick.
  - *Dynamics*: Infinite/shuffled deck, Dealer policy (e.g., Hit until 17).
  - *Reward Signal*: +1 (Win), -1 (Loss), 0 (Draw/Tie).
- **Agent (`agents.ts`)**: Encapsulates the evaluation policy. Initially, this will be a fixed policy agent (e.g., Hit until 20).
- **Testbed (`experiment.ts`)**: The orchestrator that runs $N$ episodes, tracks first-visits to states, accumulates rewards, and computes the final expected value for each state coordinate using Monte Carlo prediction.

## 3. Standard UI Components
The UI will adhere to the established generalized simulator layout:

### 3.1 Control Panel (Left Sidebar)
- **Simulation Settings**:
  - `Number of Episodes` to play (e.g., default 100,000 to reach convergence).
- **Agent Configuration**:
  - `Player Policy Threshold`: Configure the sum at which the player sticks (default: 20).
  - `Dealer Policy Threshold`: Configure the sum at which the dealer sticks (default: 17).
- **Execution Controls**: Run Simulation, Clear Data.

### 3.2 Metrics Canvas (Main View)
Unlike the Bandit testbed which relies on 2D line charts over time, the Blackjack simulator's primary output is the learned state-value function across a multi-dimensional state space. The canvas will display four primary visualizations:
1. **3D Mesh Plot**: State-value function with **no usable ace**. (Axes: Dealer Showing vs. Player Sum).
2. **3D Mesh Plot**: State-value function with **a usable ace**.
3. **2D Heatmap**: State-value function with **no usable ace**.
4. **2D Heatmap**: State-value function with **a usable ace**.

### 3.3 Data Export
- **CSV/JSON Export**: A utility to export the final converged state-value arrays, allowing users to verify the numerical estimates externally.

## 4. Development Phases
1. **Project Scaffold**: Copy the build setup, Tailwind config, and basic UI layout shell from the `v2app` directory to maintain consistency.
2. **Engine Implementation**: Port the mathematical logic from `matlab-blackjack` into pure TypeScript (Deck shuffling, Hand evaluation, State mapping, Reward determination, and the Monte Carlo loop).
3. **Visualization Integration**: Integrate a charting component capable of 3D surface plots and Heatmaps to render the state-value functions accurately.
4. **Interactive Wiring**: Connect the React Control Panel to the Testbed engine to allow dynamic, in-browser execution.
