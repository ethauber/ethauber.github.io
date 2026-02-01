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
   * Determines the results with full scoring details.
   * Sorts colors by score descending.
   * Tie-breaking is deterministic based on the order: White, Blue, Black, Red, Green.
   * @returns {Array} An array of objects { color, score, description } sorted by score.
   */
  getResult() {
    // Order matters for deterministic tie-breaking (if scores are equal, earlier index wins)
    const colorOrder = ["White", "Blue", "Black", "Red", "Green"];

    const sortedDetails = colorOrder.map((color, index) => ({
      color: color,
      score: this.scores[color],
      description: this.data.results.single[color],
      originalIndex: index
    })).sort((a, b) => {
      // Primary sort: Score (Descending)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort: Original Index (Ascending) for deterministic ties
      return a.originalIndex - b.originalIndex;
    });

    // Remove the temporary 'originalIndex' before returning
    return sortedDetails.map(({ color, score, description }) => ({ color, score, description }));
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