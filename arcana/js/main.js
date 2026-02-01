document.addEventListener('DOMContentLoaded', () => {
  const engine = new QuizEngine(QUIZ_DATA);
  let currentQuestionIndex = 0;
  const questions = QUIZ_DATA.questions;

  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');

  // Elements for result
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const scoreBreakdown = document.getElementById('score-breakdown');
  const restartButton = document.getElementById('restart-btn');

  function startQuiz() {
    engine.reset();
    currentQuestionIndex = 0;
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    showQuestion();
  }

  function showQuestion() {
    const questionData = questions[currentQuestionIndex];
    questionElement.textContent = questionData.prompt;
    answersElement.innerHTML = '';

    questionData.answers.forEach(answer => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.classList.add('answer-btn');
      button.addEventListener('click', () => selectAnswer(answer.weights));
      answersElement.appendChild(button);
    });
  }

  function selectAnswer(weights) {
    engine.processAnswer(weights);
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    const result = engine.getResult(); // Now returns { identity, colorScores }
    const bestIdentity = result.identity;
    const individualColorScores = result.colorScores;

    // Main Result Display
    resultTitle.textContent = bestIdentity.name || bestIdentity.id; // Use name if available, else id
    resultDesc.textContent = bestIdentity.description;

    // Set color-specific class for styling based on the first color of the identity
    resultContainer.className = 'container'; // Reset classes
    if (bestIdentity.colors && bestIdentity.colors.length > 0) {
      resultContainer.classList.add(`color-${bestIdentity.colors[0].toLowerCase()}`);
    } else {
      // Fallback or default styling if no colors are defined for some reason
      resultContainer.classList.add('color-default');
    }

    // Generate Breakdown using individual color scores
    // Find the max score among individual colors for percentage calculation
    const maxIndividualScore = individualColorScores.reduce((max, item) => Math.max(max, item.score), 0);
    renderBreakdown(individualColorScores, maxIndividualScore);
  }

  function renderBreakdown(scores, maxScore) {
    scoreBreakdown.innerHTML = '<h3>Color Resonance</h3>';

    // Ensure we don't divide by zero if maxScore is 0
    const calcMax = maxScore > 0 ? maxScore : 1;

    scores.forEach(item => {
      const row = document.createElement('div');
      row.className = 'score-row';

      const label = document.createElement('span');
      label.className = 'score-label';
      label.textContent = item.color;

      const barContainer = document.createElement('div');
      barContainer.className = 'score-bar-container';

      const bar = document.createElement('div');
      bar.className = `score-bar bg-${item.color.toLowerCase()}`;

      // Calculate width percentage relative to the highest individual score
      const widthPct = (item.score / calcMax) * 100;
      bar.style.width = `${Math.max(widthPct, 1)}%`; // Min 1% visibility for very low scores

      const value = document.createElement('span');
      value.className = 'score-value';
      value.textContent = item.score;

      barContainer.appendChild(bar);
      row.appendChild(label);
      row.appendChild(barContainer);
      row.appendChild(value);
      scoreBreakdown.appendChild(row);
    });
  }

  restartButton.addEventListener('click', startQuiz);

  // Initialize
  startQuiz();
});
