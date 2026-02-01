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

    const result = engine.getResult();
    resultTitle.textContent = result.color;
    resultDesc.textContent = result.description;

    // Set color-specific class for styling
    resultContainer.className = 'container'; // Reset classes
    resultContainer.classList.add(`color-${result.color.toLowerCase()}`);
  }

  restartButton.addEventListener('click', startQuiz);

  // Initialize
  startQuiz();
});
