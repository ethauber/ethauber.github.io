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
    "meta": {
      "domain": "Magic The Gathering Color Pie",
      "version": "1.0",
      "coverage": "All single, dual, triple, quadruple, and five-color identities"
    },
    "colors": {
      "single": [
        {
          "id": "WHITE",
          "name": "White",
          "colors": ["White"],
          "description": "I value law, order, and community. I believe peace is built through structure and cooperation. At my best, I am just, protective, and selfless. At my worst, I am authoritarian, inflexible, and intolerant."
        },
        {
          "id": "BLUE",
          "name": "Blue",
          "colors": ["Blue"],
          "description": "I value knowledge, logic, and improvement. I seek understanding and mastery through careful thought. At my best, I am brilliant, curious, and innovative. At my worst, I am manipulative, detached, and paralyzed by overthinking."
        },
        {
          "id": "BLACK",
          "name": "Black",
          "colors": ["Black"],
          "description": "I value power, ambition, and self determination. I believe strength comes from embracing reality without shame. At my best, I am resourceful, honest, and resilient. At my worst, I am ruthless, selfish, and cruel."
        },
        {
          "id": "RED",
          "name": "Red",
          "colors": ["Red"],
          "description": "I value freedom, emotion, and authenticity. I believe truth is found through action and feeling. At my best, I am passionate, creative, and courageous. At my worst, I am reckless, volatile, and destructive."
        },
        {
          "id": "GREEN",
          "name": "Green",
          "colors": ["Green"],
          "description": "I value nature, instinct, and growth. I believe life has an inherent order that should be respected. At my best, I am patient, grounded, and nurturing. At my worst, I am resistant to change and dismissive of progress."
        }
      ],
      "twoColor": [
        { "id": "AZORIUS", "name": "Azorius", "colors": ["White", "Blue"], "description": "Order, logic, and structure through rules and planning." },
        { "id": "DIMIR", "name": "Dimir", "colors": ["Blue", "Black"], "description": "Knowledge, secrecy, and ambition through information control." },
        { "id": "RAKDOS", "name": "Rakdos", "colors": ["Black", "Red"], "description": "Freedom, indulgence, and intensity without restraint." },
        { "id": "GRUUL", "name": "Gruul", "colors": ["Red", "Green"], "description": "Instinct, freedom, and raw life over civilization." },
        { "id": "SELESNYA", "name": "Selesnya", "colors": ["Green", "White"], "description": "Community, harmony, and shared growth." },
        { "id": "ORZHOV", "name": "Orzhov", "colors": ["White", "Black"], "description": "Structure and ambition through systems and hierarchy." },
        { "id": "IZZET", "name": "Izzet", "colors": ["Blue", "Red"], "description": "Curiosity, creativity, and experimentation." },
        { "id": "GOLGARI", "name": "Golgari", "colors": ["Black", "Green"], "description": "Survival, decay, and renewal as natural cycles." },
        { "id": "BOROS", "name": "Boros", "colors": ["Red", "White"], "description": "Justice, action, and conviction through force." },
        { "id": "SIMIC", "name": "Simic", "colors": ["Blue", "Green"], "description": "Growth, evolution, and improvement." }
      ],
      "threeColor": {
        "shards": [
          { "id": "BANT", "colors": ["White", "Blue", "Green"], "description": "Order, harmony, and moral balance." },
          { "id": "ESPER", "colors": ["White", "Blue", "Black"], "description": "Perfection, control, and engineered progress." },
          { "id": "GRIXIS", "colors": ["Blue", "Black", "Red"], "description": "Power, knowledge, and emotional freedom." },
          { "id": "JUND", "colors": ["Black", "Red", "Green"], "description": "Survival, dominance, and instinct." },
          { "id": "NAYA", "colors": ["Red", "Green", "White"], "description": "Life, passion, and communal strength." }
        ],
        "wedges": [
          { "id": "ABZAN", "colors": ["White", "Black", "Green"], "description": "Endurance, tradition, and resilience." },
          { "id": "JESKAI", "colors": ["White", "Blue", "Red"], "description": "Discipline, insight, and expression." },
          { "id": "MARDU", "colors": ["White", "Black", "Red"], "description": "Action, loyalty, and conquest." },
          { "id": "SULTAI", "colors": ["Blue", "Black", "Green"], "description": "Patience, growth, and domination." },
          { "id": "TEMUR", "colors": ["Blue", "Red", "Green"], "description": "Instinct, curiosity, and raw potential." }
        ]
      },
      "fourColor": [
        {
          "id": "NO_GREEN",
          "name": "Artifice",
          "colors": ["White", "Blue", "Black", "Red"],
          "description": "Progress and control without natural limits."
        },
        {
          "id": "NO_WHITE",
          "name": "Chaos",
          "colors": ["Blue", "Black", "Red", "Green"],
          "description": "Growth, instinct, and power without imposed order."
        },
        {
          "id": "NO_BLUE",
          "name": "Aggression",
          "colors": ["White", "Black", "Red", "Green"],
          "description": "Action, survival, and strength without reflection."
        },
        {
          "id": "NO_BLACK",
          "name": "Altruism",
          "colors": ["White", "Blue", "Red", "Green"],
          "description": "Growth and freedom without selfish ambition."
        },
        {
          "id": "NO_RED",
          "name": "Growth",
          "colors": ["White", "Blue", "Black", "Green"],
          "description": "Structure and evolution without emotional impulse."
        }
      ],
      "fiveColor": [
        {
          "id": "WUBRG",
          "name": "Five Color",
          "colors": ["White", "Blue", "Black", "Red", "Green"],
          "description": "All paths, all truths, and complete adaptability."
        }
      ]
    }
  }
};