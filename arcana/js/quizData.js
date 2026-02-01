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
    },
    {
      id: "Q3",
      prompt: "How do you handle conflict with others?",
      answers: [
        { text: "I appeal to justice and the greater good", weights: { White: 3, Blue: 1, Black: 0, Red: 0, Green: 0 } },
        { text: "I outsmart them with superior strategy", weights: { White: 0, Blue: 3, Black: 1, Red: 0, Green: 0 } },
        { text: "I do whatever is necessary to win", weights: { White: 0, Blue: 1, Black: 3, Red: 0, Green: 0 } },
        { text: "I confront them directly and emotionally", weights: { White: 0, Blue: 0, Black: 0, Red: 3, Green: 1 } },
        { text: "I rely on my strength and endurance to outlast them", weights: { White: 0, Blue: 0, Black: 0, Red: 1, Green: 3 } }
      ]
    },
    {
      id: "Q4",
      prompt: "What is your ultimate goal in life?",
      answers: [
        { text: "Peace and order for society", weights: { White: 3, Blue: 0, Black: 0, Red: 0, Green: 1 } },
        { text: "Perfection and omniscience", weights: { White: 0, Blue: 3, Black: 0, Red: 0, Green: 0 } },
        { text: "Omnipotence and control", weights: { White: 0, Blue: 0, Black: 3, Red: 1, Green: 0 } },
        { text: "Freedom to do whatever I want", weights: { White: 0, Blue: 0, Black: 1, Red: 3, Green: 0 } },
        { text: "Acceptance and harmony with the world", weights: { White: 1, Blue: 0, Black: 0, Red: 0, Green: 3 } }
      ]
    },
    {
      id: "Q5",
      prompt: "What do you fear the most?",
      answers: [
        { text: "Chaos and lawlessness", weights: { White: 3, Blue: 0, Black: 0, Red: 0, Green: 0 } },
        { text: "Ignorance and deception", weights: { White: 0, Blue: 3, Black: 0, Red: 0, Green: 0 } },
        { text: "Weakness and dependency on others", weights: { White: 0, Blue: 0, Black: 3, Red: 0, Green: 0 } },
        { text: "Boredom and constraints", weights: { White: 0, Blue: 0, Black: 0, Red: 3, Green: 0 } },
        { text: "The unnatural and the artificial", weights: { White: 0, Blue: 0, Black: 0, Red: 0, Green: 3 } }
      ]
    }
  ],
  results: {
    single: {
      White: "White values law, order, and community. You seek peace through structure and selflessness.",
      Blue: "Blue values knowledge, logic, and improvement. You seek perfection through information and strategy.",
      Black: "Black values ambition, power, and self-determination. You seek to control your own destiny at any cost.",
      Red: "Red values freedom, emotion, and authenticity. You act on impulse and value your independence above all.",
      Green: "Green values nature, instinct, and growth. You seek harmony with the natural order and reject the artificial."
    }
  }
};