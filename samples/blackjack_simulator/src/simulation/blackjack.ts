export type Action = 'hit' | 'stick';

export interface HandEvaluation {
  value: number;
  usableAce: boolean;
}

export interface State {
  playerSum: number;
  dealerCard: number;
  usableAce: boolean;
}

export class BlackjackEnvironment {
  private deck: number[];

  constructor() {
    this.deck = this.shuffleDeck();
  }

  private shuffleDeck(): number[] {
    const deck = Array.from({ length: 52 }, (_, i) => i + 1);
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  public drawCard(): number {
    if (this.deck.length === 0) {
      this.deck = this.shuffleDeck();
    }
    return this.deck.pop()!;
  }

  public evaluateHand(cards: number[]): HandEvaluation {
    const values = cards.map(c => {
      const val = ((c - 1) % 13) + 1;
      return Math.min(val, 10);
    });

    let sum = values.reduce((a, b) => a + b, 0);
    let usableAce = false;

    if (values.includes(1) && sum <= 11) {
      sum += 10;
      usableAce = true;
    }

    return { value: sum, usableAce };
  }

  public playEpisode(playerThreshold: number, dealerThreshold: number): { states: State[], reward: number } {
    // Initial draw
    let playerHand = [this.drawCard(), this.drawCard()];
    let dealerHand = [this.drawCard(), this.drawCard()];

    let playerEval = this.evaluateHand(playerHand);
    let dealerEval = this.evaluateHand(dealerHand);

    // The dealer shows their first card
    const dealerCardVal = Math.min(((dealerHand[0] - 1) % 13) + 1, 10);

    const statesVisited: State[] = [];

    // Player Policy: Hit until threshold
    while (playerEval.value < playerThreshold) {
      // Only track states where player sum is 12 or more, as per standard MC
      if (playerEval.value >= 12 && playerEval.value <= 21) {
        statesVisited.push({
          playerSum: playerEval.value,
          dealerCard: dealerCardVal,
          usableAce: playerEval.usableAce,
        });
      }

      playerHand.push(this.drawCard());
      playerEval = this.evaluateHand(playerHand);
    }

    // Record the state where player finally decided to stick
    if (playerEval.value >= 12 && playerEval.value <= 21) {
        statesVisited.push({
            playerSum: playerEval.value,
            dealerCard: dealerCardVal,
            usableAce: playerEval.usableAce,
        });
    }

    // Check Player Bust
    if (playerEval.value > 21) {
      return { states: statesVisited, reward: -1 };
    }

    // Dealer Policy: Hit until threshold
    while (dealerEval.value < dealerThreshold) {
      dealerHand.push(this.drawCard());
      dealerEval = this.evaluateHand(dealerHand);
    }

    // Check Dealer Bust
    if (dealerEval.value > 21) {
      return { states: statesVisited, reward: 1 };
    }

    // Compare values
    if (playerEval.value > dealerEval.value) {
      return { states: statesVisited, reward: 1 };
    } else if (playerEval.value < dealerEval.value) {
      return { states: statesVisited, reward: -1 };
    } else {
      return { states: statesVisited, reward: 0 };
    }
  }
}
