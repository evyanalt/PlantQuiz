const quizFiles = {
    algemeen: 'quizzes/algemeen.json',
    blauwgeletuin: 'quizzes/blauwgeletuin.json',
    wittetuin: 'quizzes/wittetuin.json'
};

const quizApp = document.querySelector('#quiz-app');
const selectedQuiz = new URLSearchParams(window.location.search).get('quiz');

function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
}

function showError(message) {
    quizApp.innerHTML = `
        <section class="quiz-panel">
            <p class="quiz-eyebrow">Plant Quiz</p>
            <h1>Quiz niet beschikbaar</h1>
            <p class="quiz-status">${message}</p>
            <a class="quiz-button quiz-button-secondary" href="./">Terug naar quizzen</a>
        </section>`;
}

function startQuiz(quiz, questions) {
    const round = shuffle(questions).slice(0, 10);
    const answers = Array(round.length).fill(null);
    let currentQuestion = 0;

    function renderQuestion() {
        const question = round[currentQuestion];
        const selectedAnswer = answers[currentQuestion];
        const options = question.options.map((option, index) => `
            <button class="quiz-option${selectedAnswer === index ? ' is-selected' : ''}" type="button" data-option="${index}" aria-pressed="${selectedAnswer === index}">
                <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
                <span>${option}</span>
            </button>`).join('');

        quizApp.innerHTML = `
            <section class="quiz-panel">
                <a class="quiz-back-link" href="./"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span> Alle quizzen</a>
                <p class="quiz-eyebrow">${quiz.quiz}</p>
                <div class="quiz-progress-row"><span>Vraag ${currentQuestion + 1} van ${round.length}</span><span>${Math.round((currentQuestion / round.length) * 100)}%</span></div>
                <progress class="quiz-progress" value="${currentQuestion}" max="${round.length}" aria-label="Voortgang"></progress>
                <h1 class="quiz-question">${question.question}</h1>
                <div class="quiz-options">${options}</div>
                <div class="quiz-navigation">
                    <button class="quiz-button quiz-button-secondary" type="button" data-action="back" ${currentQuestion === 0 ? 'disabled' : ''}>Terug</button>
                    <button class="quiz-button" type="button" data-action="next" ${selectedAnswer === null ? 'disabled' : ''}>${currentQuestion === round.length - 1 ? 'Bekijk resultaat' : 'Volgende'}</button>
                </div>
            </section>`;

        quizApp.querySelectorAll('[data-option]').forEach((button) => {
            button.addEventListener('click', () => {
                answers[currentQuestion] = Number(button.dataset.option);
                renderQuestion();
            });
        });

        quizApp.querySelector('[data-action="back"]').addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion -= 1;
                renderQuestion();
            }
        });

        quizApp.querySelector('[data-action="next"]').addEventListener('click', () => {
            if (answers[currentQuestion] === null) return;
            if (currentQuestion < round.length - 1) {
                currentQuestion += 1;
                renderQuestion();
            } else {
                renderResult();
            }
        });
    }

    function renderResult() {
        const score = round.reduce((total, question, index) => total + (question.options[answers[index]] === question.correct ? 1 : 0), 0);
        const percentage = Math.round((score / round.length) * 100);
        const resultText = percentage === 100 ? 'Geweldig gedaan!' : percentage >= 60 ? 'Goed bezig!' : 'Blijf ontdekken!';

        quizApp.innerHTML = `
            <section class="quiz-panel quiz-result">
                <p class="quiz-eyebrow">${quiz.quiz}</p>
                <span class="material-symbols-outlined quiz-result-icon" aria-hidden="true">${percentage >= 60 ? 'workspace_premium' : 'yard'}</span>
                <h1>${resultText}</h1>
                <p class="quiz-score">${score}<span> / ${round.length}</span></p>
                <p class="quiz-status">Je had ${score} van de ${round.length} vragen goed.</p>
                <div class="quiz-navigation quiz-result-actions">
                    <button class="quiz-button quiz-button-secondary" type="button" data-action="restart">Opnieuw spelen</button>
                    <a class="quiz-button" href="./">Andere quiz</a>
                </div>
            </section>`;

        quizApp.querySelector('[data-action="restart"]').addEventListener('click', () => startQuiz(quiz, questions));
    }

    renderQuestion();
}

async function loadQuiz() {
    if (!selectedQuiz || !quizFiles[selectedQuiz]) {
        showError('Kies een quiz via de quizzenpagina.');
        return;
    }

    try {
        const response = await fetch(quizFiles[selectedQuiz]);
        if (!response.ok) throw new Error('De vragen konden niet worden geladen.');
        const quiz = await response.json();
        if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
            throw new Error('Deze quiz bevat nog geen vragen.');
        }
        const validQuestions = quiz.questions.filter((question) =>
            typeof question.question === 'string' &&
            Array.isArray(question.options) &&
            question.options.length >= 2 &&
            question.options.includes(question.correct)
        );
        if (validQuestions.length === 0) throw new Error('Deze quiz heeft geen geldige vragen.');
        startQuiz(quiz, validQuestions);
    } catch (error) {
        showError(error.message);
    }
}

loadQuiz();