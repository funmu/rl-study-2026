# MATLAB Blackjack: Monte Carlo State-Value Evaluation

This directory contains MATLAB code to simulate and evaluate the game of Blackjack using First-Visit Monte Carlo prediction. It is designed to reproduce the state-value function results found in Figure 5.1 of Chapter 5 in Sutton and Barto's *Reinforcement Learning: An Introduction*.

## Overview

The code estimates the state-value function for Blackjack using a fixed policy for both the player and the dealer:
- **Player's Policy**: Hit until the hand value reaches 20 or 21, then stick.
- **Dealer's Policy**: Hit until the hand value reaches 17 or greater, then stick.

By playing a large number of simulated hands (the default is set to 500,000), the algorithm accumulates the rewards (+1 for a win, -1 for a loss, 0 for a draw) to compute the expected value for each possible state.

## State Space Representation

The state space is tracked using three dimensions:
1. **Player's Hand Sum**: Ranging from 12 to 21. (Initial hands below 12 are not tracked as states since the player will always hit and cannot possibly go bust).
2. **Dealer's Showing Card**: Ranging from 1 (Ace) to 10 (face cards are mapped to a value of 10).
3. **Usable Ace**: A boolean (1 or 0) indicating whether the player currently holds an ace that can be counted as 11 without busting.

## File Structure

- `blackjack.m`: The main script. It initializes the simulation, loops through the specified number of hands, updates the Monte Carlo averages, and plots the results.
- `shufflecards.m`: Helper function that returns a randomly shuffled 52-card deck using `randperm`.
- `handValue.m`: Calculates the numerical value of a given hand of cards, automatically promoting a soft ace to 11 if it doesn't cause a bust, and returns whether a usable ace exists.
- `stateFromHand.m`: Maps the player's hand and the dealer's showing card into the three-variable state representation used for tracking values.
- `determineReward.m`: Calculates the final reward (`+1` for a win, `-1` for a loss, `0` for a draw) by comparing the player's and dealer's final hand values, accounting for busts.

## Usage

To run the simulation, execute the main script from your MATLAB environment:

```matlab
blackjack
```

Upon completion, the script will generate four figures:
- 3D Mesh plot of the state-value function with **no usable ace**.
- 3D Mesh plot of the state-value function with **a usable ace**.
- 2D Heatmap (`imagesc`) of the state-value function with **no usable ace**.
- 2D Heatmap (`imagesc`) of the state-value function with **a usable ace**.
