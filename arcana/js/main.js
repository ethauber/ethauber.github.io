document.addEventListener('DOMContentLoaded', () => {
  const engine = new QuizEngine(QUIZ_DATA);
  let currentQuestionIndex = 0;
  const questions = QUIZ_DATA.questions;

  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const progressElement = document.getElementById('progress');

  // Elements for result
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const scoreBreakdown = document.getElementById('score-breakdown');
  const restartButton = document.getElementById('restart-btn');
  const shareBBCode = document.getElementById('share-bbcode');
  const copyBtn = document.getElementById('copy-btn');

  function startQuiz() {
    engine.reset();
    currentQuestionIndex = 0;
    quizContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    // Clear URL params if starting new quiz
    if (window.history.pushState) {
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({path:newurl},'',newurl);
    }

    showQuestion();
  }

  function showQuestion() {
    const questionData = questions[currentQuestionIndex];
    progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    questionElement.textContent = questionData.prompt;
    answersElement.innerHTML = '';

    questionData.answers.forEach(answer => {
      const button = document.createElement('button');
      button.type = 'button';
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

  function showResult(preloadedIdentity = null) {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    let bestIdentity, individualColorScores;

    if (preloadedIdentity) {
      bestIdentity = preloadedIdentity;
      individualColorScores = null; // No scores available when loading from URL
    } else {
      const result = engine.getResult();
      bestIdentity = result.identity;
      individualColorScores = result.colorScores;
    }

    // Main Result Display
    resultTitle.textContent = bestIdentity.name || bestIdentity.id;
    resultDesc.textContent = bestIdentity.description;

    const resultEmoji = document.getElementById('result-emoji');
    if (resultEmoji && bestIdentity.emoji) {
        resultEmoji.textContent = bestIdentity.emoji;
    }

    // Styling
    resultContainer.className = 'container';
    if (bestIdentity.colors && bestIdentity.colors.length > 0) {
      resultContainer.classList.add(`color-${bestIdentity.colors[0].toLowerCase()}`);
    } else {
      resultContainer.classList.add('color-default');
    }

    // Breakdown
    if (individualColorScores) {
        scoreBreakdown.classList.remove('hidden');
        const maxIndividualScore = individualColorScores.reduce((max, item) => Math.max(max, item.score), 0);
        renderBreakdown(individualColorScores, maxIndividualScore);
    } else {
        scoreBreakdown.classList.add('hidden');
    }

    // Share Section & Button Logic
    const shareSection = document.getElementById('share-section');
    if (preloadedIdentity) {
        shareSection.classList.add('hidden');
        restartButton.textContent = "Take The Quiz";
    } else {
        shareSection.classList.remove('hidden');
        restartButton.textContent = "Take Quiz Again";
        generateShareData(bestIdentity);
    }
    // Focus management for accessibility
    resultTitle.focus();
  }

  function renderBreakdown(scores, maxScore) {
    scoreBreakdown.innerHTML = '<h3>Color Resonance</h3>';
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

      const widthPct = (item.score / calcMax) * 100;
      bar.style.width = `${Math.max(widthPct, 1)}%`;

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

  function generateShareData(identity) {
      // Base URL without params
      const baseUrl = window.location.href.split('?')[0];
      // Link back to the start of the quiz (baseUrl) instead of the specific result
      const shareUrl = baseUrl;

      // Construct badge URL relative to current location
      const badgeUrl = new URL(`assets/badges/${identity.id.toLowerCase()}.svg`, baseUrl).href;

      const bbcode = `[url=${shareUrl}]\n[img]${badgeUrl}[/img]\n[/url]`;
      shareBBCode.value = bbcode;
  }

  function checkUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const resultId = params.get('result');
      if (resultId) {
          const identity = engine.getIdentityById(resultId);
          if (identity) {
              showResult(identity);
              return true;
          }
      }
      return false;
  }

  copyBtn.addEventListener('click', () => {
      shareBBCode.select();
      document.execCommand('copy');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
          copyBtn.textContent = originalText;
      }, 2000);
  });

  restartButton.addEventListener('click', startQuiz);

  // Initialize
  if (!checkUrlParams()) {
      startQuiz();
  }
});