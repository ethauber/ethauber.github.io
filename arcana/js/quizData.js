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
          "emoji": "☀️",
          "description": "My color is White. I value Peace, Order, and Community. At my best, I am the shield that protects the weak and the structure that upholds society. I believe in the good of the many over the few. However, at my worst, I can be authoritarian, inflexible, and intolerant of dissent. I struggle to accept that individuality is not a threat. Like marble, I am strong and enduring, but can be cold and unyielding. I stand against the chaos of Red and the selfishness of Black."
        },
        {
          "id": "BLUE",
          "name": "Blue",
          "colors": ["Blue"],
          "emoji": "💡",
          "description": "My color is Blue. I value Knowledge, Logic, and Improvement. At my best, I am the innovator who solves impossible problems and the scholar who seeks objective truth. I believe that anything can be improved with enough study. However, at my worst, I can be manipulative, paralyzed by over-analysis, and emotionally detached. I struggle to accept that not everything needs to be perfect. Like water, I am adaptable and deep, but can be formless and overwhelming. I conflict with the impulsiveness of Red and the stagnation of Green."
        },
        {
          "id": "BLACK",
          "name": "Black",
          "colors": ["Black"],
          "emoji": "💀",
          "description": "My color is Black. I value Power, Ambition, and Self-Determination. At my best, I am pragmatic, honest about reality, and fiercely independent. I believe that I am the only one responsible for my destiny. However, at my worst, I can be ruthless, parasitic, and willing to sacrifice anything—or anyone—to get what I want. I do not shy away from the dark truths of the world. Like a swamp, I consume what is weak to feed my own growth. I reject the moral chains of White and the natural limits of Green."
        },
        {
          "id": "RED",
          "name": "Red",
          "colors": ["Red"],
          "emoji": "🔥",
          "description": "My color is Red. I value Freedom, Emotion, and Action. At my best, I am passionate, creative, and undeniably authentic. I believe that life is meant to be felt, not just analyzed. However, at my worst, I can be reckless, destructive, and shortsighted. I act on impulse and often burn bridges in my wake. Like fire, I provide warmth and light, but I can easily consume everything I touch. I stand against the cold logic of Blue and the restrictive laws of White."
        },
        {
          "id": "GREEN",
          "name": "Green",
          "colors": ["Green"],
          "emoji": "🌳",
          "description": "My color is Green. I value Nature, Instinct, and Destiny. At my best, I am grounded, nurturing, and in harmony with the world around me. I believe that everyone has a predetermined role to play in the great web of life. However, at my worst, I can be passive, resistant to necessary change, and savage in my defense of the status quo. Like a great forest, I am ancient and enduring, but I can relentlessly overgrow and stifle progress. I conflict with the artificiality of Blue and the selfishness of Black."
        }
      ],
      "twoColor": [
        {
          "id": "AZORIUS",
          "name": "Azorius",
          "colors": ["White", "Blue"],
          "emoji": "🏛️",
          "description": "I am Azorius aligned. I value Law, Calculation, and Foresight. At my best, I build systems that create perfect justice and societal harmony. At my worst, I create bureaucracy that stifles the human spirit and prioritize the letter of the law over its intent. I am the marble column and the written word. I oppose the chaos and impulsiveness of Red, seeking to bring structure to a disordered world."
        },
        {
          "id": "DIMIR",
          "name": "Dimir",
          "colors": ["Blue", "Black"],
          "emoji": "🕵️",
          "description": "I am Dimir aligned. I value Secrecy, Manipulation, and Control. At my best, I am the mastermind who achieves goals through subtlety and intelligence rather than brute force. At my worst, I am paranoid, isolated, and see others only as pawns in my game. I am the shadow in the library. I oppose the openness and raw honesty of Green and Red, preferring to operate in the unseen corners of the mind."
        },
        {
          "id": "RAKDOS",
          "name": "Rakdos",
          "colors": ["Black", "Red"],
          "emoji": "🎭",
          "description": "I am Rakdos aligned. I value Hedonism, Freedom, and Intensity. At my best, I live without regret, embracing every moment with fierce authenticity. At my worst, I am cruel, nihilistic, and destructive for the sake of entertainment. I am the riot and the carnival. I oppose the restrictions of White and the calculated caution of Blue, tearing down anything that tries to cage me."
        },
        {
          "id": "GRUUL",
          "name": "Gruul",
          "colors": ["Red", "Green"],
          "emoji": "🐗",
          "description": "I am Gruul aligned. I value Instinct, Tradition, and Raw Power. At my best, I am honest, loyal, and inextricably connected to my primal nature. At my worst, I am violent, anti-intellectual, and hostile to anything I don't understand. I am the wildfire and the stampede. I oppose the artificial laws of White and the deceptive manipulations of Blue, trusting only what I can feel and break."
        },
        {
          "id": "SELESNYA",
          "name": "Selesnya",
          "colors": ["Green", "White"],
          "emoji": "🌻",
          "description": "I am Selesnya aligned. I value Community, Nature, and Unity. At my best, I create inclusive societies where everyone supports one another and no one is left behind. At my worst, I demand conformity, suppressing individuality for the sake of the collective. I am the garden and the gathering. I oppose the selfishness of Black, believing that we are stronger together than we could ever be apart."
        },
        {
          "id": "ORZHOV",
          "name": "Orzhov",
          "colors": ["White", "Black"],
          "emoji": "🏦",
          "description": "I am Orzhov aligned. I value Hierarchy, Stability, and Wealth. At my best, I provide structure and security for those loyal to me, building legacies that last for generations. At my worst, I am corrupt, exploitative, and enforce a rigid caste system where the powerful prey on the weak. I am the golden vault and the binding contract. I oppose the unpredictability of Red and the wildness of Green."
        },
        {
          "id": "IZZET",
          "name": "Izzet",
          "colors": ["Blue", "Red"],
          "emoji": "⚡",
          "description": "I am Izzet aligned. I value Creativity, Innovation, and Passion. At my best, I am a genius inventor who pushes the boundaries of what is possible. At my worst, I am reckless, unfocused, and dangerous, creating disasters as often as miracles. I am the lightning storm and the eureka moment. I oppose the stagnation of Green and the rigid morality of White, believing that progress requires breaking a few rules."
        },
        {
          "id": "GOLGARI",
          "name": "Golgari",
          "colors": ["Black", "Green"],
          "emoji": "🍄",
          "description": "I am Golgari aligned. I value Cycle, Acceptance, and Resilience. At my best, I understand that death is just part of life, and I find strength in places others overlook. At my worst, I am fatalistic, morbid, and willing to hasten the end for my own benefit. I am the compost and the fungus. I oppose the artificial preservation of White and the technological arrogance of Blue."
        },
        {
          "id": "BOROS",
          "name": "Boros",
          "colors": ["Red", "White"],
          "emoji": "⚔️",
          "description": "I am Boros aligned. I value Justice, Action, and Zeal. At my best, I am a hero who fights fearlessly for the innocent and upholds righteous laws. At my worst, I am a fanatic who sees the world in black and white, using violence to enforce my version of peace. I am the sword and the sunlight. I oppose the passivity of Green and the selfishness of Black, striking down evil wherever I find it."
        },
        {
          "id": "SIMIC",
          "name": "Simic",
          "colors": ["Blue", "Green"],
          "emoji": "🧬",
          "description": "I am Simic aligned. I value Evolution, Adaptation, and Growth. At my best, I improve upon nature to create a healthier, stronger world. At my worst, I tamper with forces I don't understand, creating monstrosities in the name of progress. I am the bio-lab and the coral reef. I oppose the stagnation of tradition and the chaos of emotion, seeking to engineer a perfect future."
        }
      ],
      "threeColor": {
        "shards": [
          {
            "id": "BANT",
            "name": "Bant",
            "colors": ["White", "Blue", "Green"],
            "emoji": "🏰",
            "description": "I am Bant aligned. I value Honor, Nobility, and Orderly Growth. I combine White's community, Blue's intellect, and Green's wisdom. At my best, I represent the pinnacle of civilized society, where disputes are settled by code and champion. At my worst, I am elitist and rigid, unable to handle threats that don't play by my rules. I am the ivory tower. I lack the selfishness of Black and the chaos of Red."
          },
          {
            "id": "ESPER",
            "name": "Esper",
            "colors": ["White", "Blue", "Black"],
            "emoji": "⚙️",
            "description": "I am Esper aligned. I value Perfection, Progress, and Control. I combine White's structure, Blue's knowledge, and Black's ambition. At my best, I create flawless systems where destiny is engineered, not left to chance. At my worst, I am cold, emotionless, and see living things as mere components to be upgraded. I am the clockwork mechanism. I lack the emotion of Red and the instinct of Green."
          },
          {
            "id": "GRIXIS",
            "name": "Grixis",
            "colors": ["Blue", "Black", "Red"],
            "emoji": "⚰️",
            "description": "I am Grixis aligned. I value Independence, cunning, and Ruthlessness. I combine Blue's planning, Black's ambition, and Red's passion. At my best, I am a survivor who refuses to be constrained by morality or tradition. At my worst, I am a tyrant who enjoys the suffering of others. I am the necropolis. I lack the community of White and the acceptance of Green."
          },
          {
            "id": "JUND",
            "name": "Jund",
            "colors": ["Black", "Red", "Green"],
            "emoji": "🌋",
            "description": "I am Jund aligned. I value Strength, Instinct, and Dominance. I combine Black's ambition, Red's impulse, and Green's nature. At my best, I am a mighty predator, honest and unyielding in the face of a harsh world. At my worst, I am a savage brute who respects only force. I am the volcano and the jungle. I lack the order of White and the logic of Blue."
          },
          {
            "id": "NAYA",
            "name": "Naya",
            "colors": ["Red", "Green", "White"],
            "emoji": "🏞️",
            "description": "I am Naya aligned. I value Life, Spirituality, and Community. I combine Red's passion, Green's nature, and White's unity. At my best, I celebrate existence with unbridled joy and protect my flock with ferocious devotion. At my worst, I am simplistic and xenophobic, rejecting anything civilized or complex. I am the lush valley. I lack the deceit of Blue and the selfishness of Black."
          }
        ],
        "wedges": [
          {
            "id": "ABZAN",
            "name": "Abzan",
            "colors": ["White", "Black", "Green"],
            "emoji": "🛡️",
            "description": "I am Abzan aligned. I value Endurance, Family, and Tradition. I combine White's structure, Black's pragmatism, and Green's interdependence. At my best, I am an unshakeable fortress that ensures the survival of my kin at any cost. At my worst, I am ossified and unforgiving, grinding down outsiders who don't fit my mold. I am the dragon scale. I oppose the impulsiveness of Red and the abstraction of Blue."
          },
          {
            "id": "JESKAI",
            "name": "Jeskai",
            "colors": ["White", "Blue", "Red"],
            "emoji": "🧘",
            "description": "I am Jeskai aligned. I value Enlightenment, Strategy, and Discipline. I combine White's peace, Blue's focus, and Red's creativity. At my best, I am the martial artist who strikes with perfect clarity and purpose. At my worst, I am dogmatic and detached, lost in high-minded concepts while the world burns. I am the mountaintop monastery. I oppose the savagery of Green and the corruption of Black."
          },
          {
            "id": "MARDU",
            "name": "Mardu",
            "colors": ["White", "Black", "Red"],
            "emoji": "🥁",
            "description": "I am Mardu aligned. I value Glory, Speed, and Conquest. I combine White's organization, Black's ambition, and Red's aggression. At my best, I am a fearless commander who inspires absolute loyalty and achieves impossible victories. At my worst, I am a warmonger who creates conflict just to prove my strength. I am the war drum. I oppose the passivity of Green and the hesitation of Blue."
          },
          {
            "id": "SULTAI",
            "name": "Sultai",
            "colors": ["Blue", "Black", "Green"],
            "emoji": "🐍",
            "description": "I am Sultai aligned. I value Power, Resourcefulness, and Evolution. I combine Blue's knowledge, Black's ruthlessness, and Green's growth. At my best, I am the apex of adaptability, using every tool available to thrive. At my worst, I am a decadent tyrant who treats the world as my personal garden to be pruned. I am the opulent palace in the jungle. I oppose the morality of White and the emotion of Red."
          },
          {
            "id": "TEMUR",
            "name": "Temur",
            "colors": ["Blue", "Red", "Green"],
            "emoji": "❄️",
            "description": "I am Temur aligned. I value Potential, Savagery, and Observation. I combine Blue's curiosity, Red's freedom, and Green's instinct. At my best, I am the shaman who understands the deep, elemental truths of the universe. At my worst, I am wild and incomprehensible, rejecting civilization for the raw truth of the wild. I am the frozen lake. I oppose the hierarchy of White and the parasitism of Black."
          }
        ]
      },
      "fourColor": [
        {
          "id": "NO_GREEN",
          "name": "Artifice",
          "colors": ["White", "Blue", "Black", "Red"],
          "emoji": "🏙️",
          "description": "I am the union of Artifice. I represent civilization without limit. I combine order, knowledge, ambition, and emotion, but I lack the grounding of Green. At my best, I create technological wonders and complex societies. At my worst, I destroy the environment and lose touch with what it means to be alive. I am the sprawling metropolis."
        },
        {
          "id": "NO_WHITE",
          "name": "Chaos",
          "colors": ["Blue", "Black", "Red", "Green"],
          "emoji": "🌀",
          "description": "I am the union of Chaos. I represent potential without restraint. I combine knowledge, ambition, emotion, and instinct, but I lack the structure of White. At my best, I am a force of pure, adaptive evolution. At my worst, I am anarchy and confusion, where the strong devour the weak without a code of honor. I am the primordial soup."
        },
        {
          "id": "NO_BLUE",
          "name": "Aggression",
          "colors": ["White", "Black", "Red", "Green"],
          "emoji": "🚩",
          "description": "I am the union of Aggression. I represent action without reflection. I combine order, ambition, emotion, and instinct, but I lack the foresight of Blue. At my best, I am decisive, bold, and unstoppable. At my worst, I am thoughtless and reactionary, charging into danger without a plan. I am the crusade."
        },
        {
          "id": "NO_BLACK",
          "name": "Altruism",
          "colors": ["White", "Blue", "Red", "Green"],
          "emoji": "🤝",
          "description": "I am the union of Altruism. I represent growth without selfishness. I combine order, knowledge, emotion, and instinct, but I lack the ambition of Black. At my best, I create a utopia where everyone acts for the greater good. At my worst, I am naive and easily exploited, sacrificing myself for causes that may not deserve it. I am the commune."
        },
        {
          "id": "NO_RED",
          "name": "Growth",
          "colors": ["White", "Blue", "Black", "Green"],
          "emoji": "🌍",
          "description": "I am the union of Growth. I represent progress without soul. I combine order, knowledge, ambition, and instinct, but I lack the heart of Red. At my best, I am the engine of destiny, moving inexorably forward. At my worst, I am cold, mechanical, and joyless, optimizing life until it is no longer worth living. I am the engineered ecosystem."
        }
      ],
      "fiveColor": [
        {
          "id": "WUBRG",
          "name": "Five Color",
          "colors": ["White", "Blue", "Black", "Red", "Green"],
          "emoji": "💎",
          "description": "I am Five Color aligned. I represent Wholeness and Omniscience. I combine the strengths and weaknesses of every philosophy. At my best, I have the perspective to see every side of an argument and the adaptability to face any challenge. At my worst, I am paralyzed by infinite choice and identity diffusion, belonging everywhere and nowhere. I am the prism of light."
        }
      ]
    }
  }
};