# Conceptual Specification: Interactive Multi-Armed Bandit Testbed

## 1. Overview
The Interactive Multi-Armed Bandit Testbed is a web-based application designed to simulate, visualize, and analyze experiments on the classic k-armed bandit problem. It provides an intuitive, dynamic interface for users to compare different exploration-exploitation strategies applied in reinforcement learning. By abstracting away code-level execution, the tool enables users to focus purely on algorithm behavior, parameter tuning, and statistical outcomes through real-time, interactive feedback.

## 2. The Core Problem: The k-Armed Bandit
At its core, the application models a fundamental decision-making problem under uncertainty:
* **Environment:** A scenario with $k$ independent choices (often conceptually represented as $k$ slot machines or "arms").
* **Reward Mechanism:** Each arm provides a stochastic reward drawn from a hidden, stationary probability distribution (e.g., a standard Gaussian/Normal distribution). The true expected reward (mean) of each arm is initially unknown.
* **Objective:** An agent must iteratively select arms over a finite number of time steps to maximize its total accumulated reward.
* **The Core Dilemma:** The agent must balance **Exploration** (gathering information about unknown arms to discover better payouts) with **Exploitation** (leveraging the current best-known arm to maximize immediate reward).

## 3. Agent Strategies
The tool simulates several distinct algorithmic approaches to solve this problem:

1. **Pure Greedy:** Continually exploits by choosing the action with the highest currently estimated value. Typically gets stuck prioritizing suboptimal actions because it fails to explore.
2. **ε-Greedy (Epsilon-Greedy):** Primarily exploits its best-known action but explores a random arm with a small probability $ε$. Ensures continuous, albeit random, exploration.
3. **Optimistic Initial Values:** Initializes action-value estimates artificially high. This forces natural, systemic exploration early in the run because any actual observed reward is a "disappointment," causing the agent to systematically try different actions before settling.
4. **Upper Confidence Bound (UCB):** Deterministically balances exploitation and exploration by considering both the estimated value of an action and the uncertainty (or variance) around that estimate. It favors actions that are either highly promising or highly uncertain.
5. **Gradient Bandit:** Instead of estimating explicit expected reward values, it learns relative "preferences" for actions. It updates these preferences using stochastic gradient ascent and selects actions using a softmax distribution.

## 4. Experiment Workflow
The web application allows users to fluently define, execute, and iterate on experiments:

* **Global Configuration:** Users can define the scope of the problem by setting the number of arms ($k$), the total number of execution steps (time horizon), and the number of independent bandit problem instances (runs) to average results across to ensure statistical significance.
* **Agent Configuration:** Users can select which algorithms to pit against each other. They can configure multiple instances of the same algorithm with different hyperparameters (e.g., competing an $ε$-greedy agent with $ε=0.1$ against one with $ε=0.01$, or tuning the confidence level $c$ for UCB).
* **Execution Engine:** The system aggregates the configuration, simulates the specified agents interacting within the defined environments over time, and processes the raw reward sequences into aggregated analytical metrics.

## 5. Metrics and Analysis
The application measures and contrasts agent performance using several key statistical metrics across the aggregated independent runs:

* **Average Reward Target:** The mean reward received by the agent at each discrete time step.
* **% Optimal Action:** The percentage of runs where the agent successfully chose the single theoretically best possible action at a given step.
* **Cumulative Average Reward:** The running mean of all rewards accumulated over time, indicating how quickly an agent achieves asymptotic efficiency.
* **Regret:** The cumulative opportunity cost representing the difference between the maximum possible reward (if the agent had omniscience and chose the best arm from step 1) and the actual reward received. Lower is better.

## 6. Interactive Interface & Visualization
To maximize educational and analytical value, the web tool requires a highly visual and responsive user interface:

* **Experiment Control Panel:** Form controls to immediately tweak parameters, toggle agents on or off, and trigger new simulation runs.
* **Real-Time Data Visualization (Multi-Series Charts):**
    * Smooth line charts tracking **Average Reward over time** for all selected agents simultaneously.
    * Comparative line charts tracking **% Optimal Action** to visually demonstrate learning convergence.
    * **Regret curves** displaying the accumulation of opportunity costs over the time horizon.
* **Statistic Scoreboards:** Tabular or card-based summaries showcasing the final state of each agent at the end of the simulation (e.g., final regret, asymptotic average reward).
* **Dynamic Interactivity:** Smooth transitions that redraw charts as users manipulate hyperparameters, offering immediate visual feedback on how parameter adjustments influence learning behavior and exploration trade-offs.
