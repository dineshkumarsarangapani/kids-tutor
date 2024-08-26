document.addEventListener('DOMContentLoaded', function() {
    let currentQuestion = 0;
    let score = 0;
    let questions = [];
    let isSettingPractice = false;

    document.getElementById('startReading').addEventListener('click', function() {
        isSettingPractice = false;
        startPractice();
    });

    document.getElementById('startSetting').addEventListener('click', function() {
        isSettingPractice = true;
        startPractice();
    });

    function startPractice() {
        document.querySelectorAll('.info').forEach(el => el.classList.add('hidden'));
        document.getElementById('practiceSection').classList.remove('hidden');
        generateQuestions();
        displayQuestion(currentQuestion);
    }

    function generateQuestions() {
        questions = [];
        for (let i = 0; i < 10; i++) {
            let hour = Math.floor(Math.random() * 12) + 1;
            let minute = Math.floor(Math.random() * 60);
            questions.push({
                hour,
                minute,
                userAnswer: '',
                isCorrect: false
            });
        }
    }

    function displayQuestion(index) {
        const question = questions[index];
        document.getElementById('clockContainer').innerHTML = '';
        const clock = createAnalogClock(question.hour, question.minute);
        document.getElementById('clockContainer').appendChild(clock);
        document.getElementById('inputContainer').classList.remove('hidden');
    }

    function createAnalogClock(hour, minute) {
        const clock = document.createElement('div');
        clock.className = 'clock';

        // Create hour hand
        const hourHand = document.createElement('div');
        hourHand.className = 'hand hour-hand';
        const hourRotation = (hour % 12) * 30 + (minute / 60) * 30; // 30 degrees per hour
        hourHand.style.transform = `rotate(${hourRotation}deg)`;
        clock.appendChild(hourHand);

        // Create minute hand
        const minuteHand = document.createElement('div');
        minuteHand.className = 'hand minute-hand';
        minuteHand.style.transform = `rotate(${minute * 6}deg)`; // 6 degrees per minute
        clock.appendChild(minuteHand);

        // Add numbers to the clock
        const numberPositions = [
            { top: '5%', left: '50%' },   // 12
            { top: '18%', left: '82%' },  // 1
            { top: '38%', left: '92%' },  // 2
            { top: '60%', left: '90%' },  // 3
            { top: '78%', left: '78%' },  // 4
            { top: '88%', left: '50%' },  // 5
            { top: '78%', left: '22%' },  // 6
            { top: '60%', left: '10%' },  // 7
            { top: '38%', left: '8%' },   // 8
            { top: '18%', left: '18%' },  // 9
            { top: '5%', left: '50%' },   // 10 (similar to 12 for more accuracy)
            { top: '18%', left: '82%' },  // 11 (adjusted position)
        ];

        for (let i = 1; i <= 12; i++) {
            const number = document.createElement('div');
            number.className = 'number';
            number.textContent = i;
            const position = numberPositions[i - 1];
            number.style.top = position.top;
            number.style.left = position.left;
            clock.appendChild(number);
        }

        return clock;
    }




    document.getElementById('submitAnswer').addEventListener('click', function() {
        const userAnswer = document.getElementById('timeInput').value;
        const question = questions[currentQuestion];
        question.userAnswer = userAnswer;

        const correctTime = `${question.hour}:${question.minute < 10 ? '0' : ''}${question.minute}`;
        question.isCorrect = userAnswer === correctTime;

        addResult(question);
        updateScore();
        document.getElementById('inputContainer').classList.add('hidden');
        document.getElementById('resultContainer').classList.remove('hidden');
    });

    function addResult(question) {
        const resultContainer = document.getElementById('resultContainer');
        const result = document.createElement('p');
        result.textContent = `Question ${currentQuestion + 1}: ${question.hour}:${question.minute < 10 ? '0' : ''}${question.minute} - Your Answer: ${question.userAnswer} ${question.isCorrect ? '✔️' : '✖️'}`;
        result.className = question.isCorrect ? 'correct' : 'incorrect';
        resultContainer.insertBefore(result, document.getElementById('resultContainer').firstChild);
    }

    function updateScore() {
        score = questions.filter(q => q.isCorrect).length;
        document.getElementById('score').textContent = `Score: ${score} / ${questions.length}`;
    }

    document.getElementById('nextQuestion').addEventListener('click', function() {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            displayQuestion(currentQuestion);
        } else {
            document.getElementById('practiceSection').innerHTML = `<p>Your final score is ${score} / ${questions.length}</p>`;
        }
    });
});
