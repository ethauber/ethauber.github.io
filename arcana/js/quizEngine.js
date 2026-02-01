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
   * Determines the best-fitting color identity based on a significance threshold.
   * A color is included in the identity ONLY if its score is >= 50% of the maximum score achieved.
   * This ensures that low-scoring "splash" colors do not force a multi-color result.
   * @returns {Object} An object containing the best-fitting identity and the raw color scores.
   */
  getResult() {
    const baseColors = ["White", "Blue", "Black", "Red", "Green"];

    // 1. Calculate Max Score
    let maxScore = 0;
    baseColors.forEach(color => {
      if (this.scores[color] > maxScore) {
        maxScore = this.scores[color];
      }
    });

    // 2. Determine Active Colors (Threshold: 50% of Max)
    // If maxScore is 0 (unlikely), prevent everything from being active unless we want that.
    // Assuming if maxScore is 0, we treat it as no color or handle gracefully.
    const threshold = maxScore > 0 ? maxScore * 0.5 : 0.1;

    const activeColors = baseColors.filter(color => this.scores[color] >= threshold);

    // 3. Find the identity that EXACTLY matches the Active Colors
    // Since our data covers all 31 combinations, an exact match should always exist.
    // If activeColors is empty (e.g. all 0), we might default to the first single color or a "Colorless" state if we had it.
    // Defaulting to the highest single score if activeColors is somehow empty.

    let bestMatch = null;

    if (activeColors.length > 0) {
      bestMatch = this.allIdentities.find(identity => {
        if (identity.colors.length !== activeColors.length) return false;
        // Check if every active color is present in the identity's color list
        return activeColors.every(c => identity.colors.includes(c));
      });
    }

    // Fallback: If no exact match found (should theoretically not happen with full coverage)
    // or scores were all 0, pick the single color with the highest value (deterministic).
    if (!bestMatch) {
       // Sort by score desc, then original order
       const fallbackColor = baseColors.slice().sort((a, b) => {
         if (this.scores[b] !== this.scores[a]) return this.scores[b] - this.scores[a];
         return baseColors.indexOf(a) - baseColors.indexOf(b);
       })[0];

       bestMatch = this.allIdentities.find(id => id.colors.length === 1 && id.colors[0] === fallbackColor);
    }

    // Prepare sorted individual scores for display
    const sortedColorScores = baseColors.map((color, index) => ({
      color: color,
      score: this.scores[color],
      originalIndex: index
    })).sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.originalIndex - b.originalIndex;
    }).map(({ color, score }) => ({ color, score }));

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
