document.getElementById('configForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const rangeMin = parseInt(document.getElementById('rangeMin').value);
    const rangeMax = parseInt(document.getElementById('rangeMax').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const includeTimer = document.getElementById('timer').checked;

    startQuiz(rangeMin, rangeMax, quantity, includeTimer);
});

let currentQuestion = 0;
let score = 0;
let questions = [];

function startQuiz(rangeMin, rangeMax, quantity, includeTimer) {
    document.getElementById('configForm').classList.add('hidden');
    document.getElementById('questionContainer').style.display = 'block';

    questions = generateQuestions(rangeMin, rangeMax, quantity);
    displayQuestion(currentQuestion);

    if (includeTimer) {
        startTimer();
    }
}

function generateQuestions(rangeMin, rangeMax, quantity) {
    const questions = [];
    for (let i = 0; i < quantity; i++) {
        const num1 = getRandomInt(rangeMin, rangeMax);
        const num2 = getRandomInt(rangeMin, rangeMax);
        questions.push({ num1, num2, userAnswer: null });
    }
    return questions;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayQuestion(index) {
    const question = questions[index];
    document.getElementById('question').textContent = `${question.num1} + ${question.num2} = ?`;
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
}

document.getElementById('answerInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        submitAnswer();
    }
});

document.getElementById('submitAnswer').addEventListener('click', submitAnswer);

function submitAnswer() {
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    if (isNaN(userAnswer)) return;

    const question = questions[currentQuestion];
    question.userAnswer = userAnswer;

    if (userAnswer === question.num1 + question.num2) {
        score++;
    }

    addSubmittedValue(question);

    currentQuestion++;

    if (currentQuestion < questions.length) {
        displayQuestion(currentQuestion);
    } else {
        endQuiz();
    }
}

function addSubmittedValue(question) {
    const submittedValuesContainer = document.getElementById('submittedValues');
    const newSubmission = document.createElement('p');
    newSubmission.className = 'scroll-animation';
    newSubmission.textContent = `${question.num1} + ${question.num2} = ${question.userAnswer}`;
    submittedValuesContainer.appendChild(newSubmission);
}

function endQuiz() {
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';

    document.getElementById('finalScore').textContent = `Your final score: ${score} / ${questions.length}`;
}

document.getElementById('exportResults').addEventListener('click', function() {
    const results = questions.map((q, index) =>
        `Question ${index + 1}: ${q.num1} + ${q.num2} = ${q.num1 + q.num2}, Your Answer: ${q.userAnswer}`).join('\n');

    const blob = new Blob([results], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'results.txt';
    link.click();
});

document.getElementById('exportPDF').addEventListener('click', function() {
    const pdfContent = questions.map((q, index) =>
        `Question ${index + 1}: ${q.num1} + ${q.num2} = ?`).join('\n');

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'questions.pdf';
    link.click();
});

function startTimer() {
    let timeLeft = 60;
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.classList.remove('hidden');

    const timerInterval = setInterval(() => {
        timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}
