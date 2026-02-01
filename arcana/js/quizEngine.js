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
    // Flatten all identities into a single array for easier processing
    this.allIdentities = this._flattenIdentities(data.results.colors);
  }

  _flattenIdentities(colorsData) {
    let identities = [];
    identities = identities.concat(colorsData.single);
    identities = identities.concat(colorsData.twoColor);
    identities = identities.concat(colorsData.threeColor.shards);
    identities = identities.concat(colorsData.threeColor.wedges);
    identities = identities.concat(colorsData.fourColor);
    identities = identities.concat(colorsData.fiveColor);

    // Add a 'rank' for deterministic tie-breaking based on original order
    return identities.map((identity, index) => ({ ...identity, originalRank: index }));
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
   * Determines the best-fitting multi-color identity based on accumulated scores.
   * Uses a match score calculation: (sum of scores in identity) - (sum of scores NOT in identity).
   * @returns {Object} An object containing the best-fitting identity and the raw color scores.
   */
  getResult() {
    const baseColors = ["White", "Blue", "Black", "Red", "Green"];
    let bestMatch = null;
    let highestMatchScore = -Infinity;

    this.allIdentities.forEach(identity => {
      let scoreInIdentity = 0;
      let scoreNotInIdentity = 0;

      baseColors.forEach(color => {
        if (identity.colors.includes(color)) {
          scoreInIdentity += this.scores[color];
        } else {
          scoreNotInIdentity += this.scores[color];
        }
      });

      const currentMatchScore = scoreInIdentity - scoreNotInIdentity;

      // Select the best match:
      // 1. Higher match score wins.
      // 2. If match scores are equal, prefer identities with fewer colors (simpler identity).
      // 3. If still tied, use the original order of definition (originalRank) for determinism.
      if (currentMatchScore > highestMatchScore) {
        highestMatchScore = currentMatchScore;
        bestMatch = identity;
      } else if (currentMatchScore === highestMatchScore) {
        if (identity.colors.length < bestMatch.colors.length) {
          bestMatch = identity;
        } else if (identity.colors.length === bestMatch.colors.length) {
          if (identity.originalRank < bestMatch.originalRank) {
            bestMatch = identity;
          }
        }
      }
    });

    // Also prepare the individual color scores for display
    const sortedColorScores = baseColors.map((color, index) => ({
      color: color,
      score: this.scores[color],
      originalIndex: index // for deterministic sorting if main.js sorts them
    })).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.originalIndex - b.originalIndex;
    }).map(({ color, score }) => ({ color, score })); // remove temp originalIndex


    return {
      identity: bestMatch,
      colorScores: sortedColorScores
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
