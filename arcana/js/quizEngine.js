class QuizEngine {
  constructor(data) {
    this.data = data;
    this.scores = {
      White: 0,
      Blue: 0,
      Black: 0,
      Red: 0,
      Green: 0
    };
  }

  /**
   * Updates scores based on the weights of the selected answer.
   * @param {Object} weights - The weights object from the answer (e.g., { White: 3, Blue: 1 ... })
   */
  processAnswer(weights) {
    for (const [color, value] of Object.entries(weights)) {
      if (this.scores.hasOwnProperty(color)) {
        this.scores[color] += value;
      }
    }
  }

  /**
   * Determines the highest scoring color.
   * Tie-breaking is deterministic based on the order: White, Blue, Black, Red, Green.
   * @returns {Object} An object containing the color name and description.
   */
  getResult() {
    let maxScore = -1;
    let winningColor = null;

    // Order matters for deterministic tie-breaking
    const colorOrder = ["White", "Blue", "Black", "Red", "Green"];

    for (const color of colorOrder) {
      if (this.scores[color] > maxScore) {
        maxScore = this.scores[color];
        winningColor = color;
      }
    }

    return {
      color: winningColor,
      description: this.data.results.single[winningColor]
    };
  }

  reset() {
    this.scores = {
      White: 0,
      Blue: 0,
      Black: 0,
      Red: 0,
      Green: 0
    };
  }
}
