# Interactive Multi-Armed Bandit Testbed (V2 App)

Welcome to the interactive, web-based version of the Multi-Armed Bandit Testbed! This application translates the core reinforcement learning concepts of the $k$-armed bandit problem into a visual, real-time interactive simulator running directly in your browser.

## Overview

The classic $k$-armed bandit problem explores the fundamental trade-off between **exploration** (trying new actions to find better rewards) and **exploitation** (leveraging known actions to maximize current rewards).

This testbed allows you to configure different learning agents, pit them against each other in standardized simulations, and compare their performance using interactive charts.

### Supported Strategies
- **Greedy:** Always chooses the action with the highest estimated value.
- **$\epsilon$-Greedy:** Usually exploits the best known action, but explores randomly with probability $\epsilon$.
- **Optimistic Initial Values:** Encourages early exploration by initializing action-value estimates artificially high.
- **Upper-Confidence-Bound (UCB):** Balances exploration and exploitation based on uncertainty and how often actions have been selected.
- **Gradient Bandit:** Learns a relative preference for each action using a soft-max distribution, independent of absolute reward values.

## Key Features
- **Control Panel:** Configure global environment variables (number of arms, steps per run, statistical averaging runs).
- **Agent Sandbox:** Add up to 7 distinct agents to face off against each other in the same simulation, tuning hyperparameters dynamically (like $\epsilon$, $c$, or $\alpha$).
- **Visual Canvas:** Built with [Recharts](https://recharts.org/), watch the agents compete over time with visual graphs tracking:
  - Average Reward
  - % Optimal Action Selected
  - Cumulative Average Reward
  - Final Average Reward Comparison
- **Export Data:** Export your simulation's final tabular statistics cleanly to a CSV file.

---

## Local Installation and Setup

This application is built with modern, performant web tools: **Vite, React, TypeScript, and TailwindCSS.**

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine (v18+ recommended).

### 1. Install Dependencies
Open your terminal, navigate to the `v2app` directory, and run the npm install command:

```bash
cd v2app
npm install
```

### 2. Start the Development Server
To run the web app in your browser locally, use:

```bash
npm run dev
```

This will output a local address (usually `http://localhost:5173/`). Command-click or open that link in your browser to launch the testbed.

### 3. Build for Production
To create an optimized production build, run:

```bash
npm run build
```

This will run TypeScript checks, ESLint, and bundle your assets efficiently using Rollup. The generated static files will be placed in the `v2app/dist` directory, ready to be hosted by any web server.

### 4. Code Formatting & Linting
The project uses ESLint (flat config) to maintain code quality. To manually verify:

```bash
npm run lint
```
