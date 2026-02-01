const QUIZ_DATA = {
  questions: [
    {
      id: "Q1",
      prompt: "When facing a serious problem, what matters most to you?",
      answers: [
        { text: "Doing what is fair and protects everyone involved", weights: { White: 3, Blue: 1, Black: 0, Red: 0, Green: 0 } },
        { text: "Understanding the situation completely before acting", weights: { White: 0, Blue: 3, Black: 1, Red: 0, Green: 0 } },
        { text: "Making sure I come out ahead", weights: { White: 0, Blue: 0, Black: 3, Red: 1, Green: 0 } },
        { text: "Acting quickly based on how I feel", weights: { White: 0, Blue: 0, Black: 0, Red: 3, Green: 1 } },
        { text: "Trusting my instincts and experience", weights: { White: 0, Blue: 0, Black: 0, Red: 1, Green: 3 } }
      ]
    },
    {
      id: "Q2",
      prompt: "Which statement feels most true to you?",
      answers: [
        { text: "A strong society needs rules everyone follows", weights: { White: 3, Blue: 0, Black: 0, Red: 0, Green: 1 } },
        { text: "Improvement comes from knowledge and refinement", weights: { White: 0, Blue: 3, Black: 0, Red: 0, Green: 1 } },
        { text: "Power should never be denied if you can take it", weights: { White: 0, Blue: 0, Black: 3, Red: 1, Green: 0 } },
        { text: "Life is meant to be lived intensely", weights: { White: 0, Blue: 0, Black: 0, Red: 3, Green: 1 } },
        { text: "Everything has a natural place and rhythm", weights: { White: 1, Blue: 0, Black: 0, Red: 0, Green: 3 } }
      ]
    }
  ],
  results: {
    single: {
      White: "White values law, order, and community.",
      Blue: "Blue values knowledge, logic, and improvement.",
      Black: "Black values ambition, power, and self determination.",
      Red: "Red values freedom, emotion, and authenticity.",
      Green: "Green values nature, instinct, and growth."
    }
  }
};
