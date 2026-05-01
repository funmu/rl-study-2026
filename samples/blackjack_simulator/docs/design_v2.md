# Implementation Plan: V2 Interactive Web App Layout (design_v2.md)

## 1. Overview
This document outlines the UI/UX architecture and implementation strategy for the V2 web application of the Multi-Armed Bandit Testbed. The interface will feature a distinct two-column layout designed to maximize interactive experimentation and real-time visualization of algorithmic performance.

## 2. Global Layout Architecture
The application will be structured as a full-screen, responsive web dashboard with two primary columns:
* **Left Column (Control Panel & Results):** ~20-25% of the screen width. Scrollable vertically if content overflows. Contains all user inputs, configurations, and post-run statistics.
* **Right Column (Visual Canvas):** ~75-80% of the screen width. Fixed position or independently scrollable. Dedicated entirely to rendering real-time graphs and charts.

---

## 3. Left Column: Control Panel & Results

### 3.1 Global Configuration
At the top of the left column, users will set the overarching parameters for the bandit environment.
* **Number of Arms ($k$):** Input field (default: 10).
* **Number of Steps:** Input field for time horizon (default: 1000).
* **Number of Runs (Bandits):** Input field for statistical averaging (default: 1000).

### 3.2 Agent Strategies Configuration
Below global settings, users will configure the specific algorithms to test.
* **Agent List/Builder:** A dynamic list where users can add and configure multiple agents.
* **Available Agents:**
  * **Greedy:** (No params)
  * **$\epsilon$-Greedy:** Input for $\epsilon$ value (e.g., 0.01, 0.1)
  * **Optimistic Initial Values:** Input for Initial Q-value (e.g., 5.0)
  * **UCB (Upper Confidence Bound):** Input for confidence parameter $c$ (e.g., 2.0)
  * **Gradient Bandit:** Input for step size $\alpha$
* **Color Assignment:** Each configured agent is automatically or manually assigned a distinct color that will correspond to their lines in the right-column graphs.

### 3.3 Execution Controls
* **Run Experiment Button:** A prominent, primary action button to kick off the simulation.
* **Clear/Reset Button:** To reset the visual canvas and start a fresh configuration.

### 3.4 Post-Run Results Display
*At the end of the run, this section will dynamically populate next to or directly below the defined experiments on the Left Panel.*
* **Scoreboard Cards:** For each configured agent, display a summarization card containing:
  * **Final Average Reward:** (e.g., 1.35)
  * **% Optimal Action:** (e.g., 89.2%)
  * **Cumulative Average Reward:** (e.g., 0.96)
* This allows users to immediately associate the numerical outcomes with the hyperparameters they just defined.
* Allow the data to be copied to the clipboard or exported as a CSV file or markdown file.

---

## 4. Right Column: Visual Canvas

The right column will house a 2x2 grid of interactive charts, mirroring the comprehensive output previously generated as `bandit_comparison.png` in the CLI version. The charts will ideally use a modern charting library (e.g., Recharts, Chart.js, or Plotly) for interactive tooltips and smooth rendering.

### 4.1 Average Reward Over Time (Top Left)
* **Type:** Line Chart
* **X-Axis:** Steps (0 to configured max)
* **Y-Axis:** Average Reward
* **Purpose:** Shows how the average reward per timestep evolves. Visualizes how quickly an agent learns to exploit and what asymptotic limit it reaches.

### 4.2 Percentage Optimal Actions (Top Right)
* **Type:** Line Chart
* **X-Axis:** Steps
* **Y-Axis:** % Optimal Action (0% to 100%)
* **Purpose:** Demonstrates how often an agent successfully identifies and chooses the true best arm, indicating convergence to the optimal policy.

### 4.3 Cumulative Average Reward (Bottom Left)
* **Type:** Line Chart
* **X-Axis:** Steps
* **Y-Axis:** Cumulative Average Reward
* **Purpose:** Displays the running average of all cumulative rewards, highlighting the learning efficiency, particularly in the early exploratory phases.

### 4.4 Final Reward Comparison (Bottom Right)
* **Type:** Bar Chart
* **X-Axis:** Agent Names
* **Y-Axis:** Final Average Reward
* **Purpose:** A direct, side-by-side comparison of the final performance state of all competing algorithms at the end of the simulation.

* Allow the charts to be copied into the clipboard or exported as an image.

## 5. Implementation Considerations
* **Web Framework:** Let us go with modern JS / typescript / ESLint / Prettier / NextJS / Vite.
* **Styling:** CSS Grid or Flexbox to maintain the strict two-column layout. Left column `overflow-y: auto`, right column grid layout for 4 charts.
* **Charting Library:** Let us use Recharts for the charts.
* **Monitoring:** Let us show the logs of the simulation in the left panel at the bottom or as appropriate.
* **Performance:** Running thousands of simulations in the browser can be CPU intensive. Depending on the scale, the simulation logic might need to be run in a Web Worker to prevent UI freezing, or batched efficiently to allow real-time graph updates during the run. Start with the browser based run and optimize later on.

