const quizFiles = {
    algemeen: 'quizzes/algemeen.json',
    blauwgeletuin: 'quizzes/blauwgeletuin.json',
    wittetuin: 'quizzes/wittetuin.json'
};

const quizApp = document.querySelector('#quiz-app');
const selectedQuiz = new URLSearchParams(window.location.search).get('quiz');
let activeKeyboardHandler = null;
let shouldConfirmExit = false;

window.addEventListener('beforeunload', (event) => {
    if (!shouldConfirmExit) return;
    event.preventDefault();
    event.returnValue = '';
});

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
    if (activeKeyboardHandler) {
        document.removeEventListener('keydown', activeKeyboardHandler);
    }

    const round = shuffle(questions).slice(0, 10);
    const answers = Array(round.length).fill(null);
    let currentQuestion = 0;
    let phase = 'question';
    shouldConfirmExit = false;

    function selectAnswer(index) {
        if (phase !== 'question' || index < 0 || index >= round[currentQuestion].options.length) return;

        answers[currentQuestion] = index;
        quizApp.querySelectorAll('[data-option]').forEach((button, optionIndex) => {
            const isSelected = optionIndex === index;
            button.classList.toggle('is-selected', isSelected);
            button.setAttribute('aria-pressed', String(isSelected));
        });
        quizApp.querySelector('[data-action="next"]').disabled = false;
    }

    function renderQuestion(animate = false) {
        phase = 'question';
        const question = round[currentQuestion];
        const selectedAnswer = answers[currentQuestion];
        const options = question.options.map((option, index) => `
            <button class="quiz-option${selectedAnswer === index ? ' is-selected' : ''}" type="button" data-option="${index}" aria-pressed="${selectedAnswer === index}">
                <span class="quiz-option-letter">${String.fromCharCode(65 + index)}</span>
                <span>${option}</span>
            </button>`).join('');

        quizApp.innerHTML = `
            <section class="quiz-panel${animate ? ' is-question-changing' : ''}">
                <a class="quiz-back-link" href="./"><span class="material-symbols-outlined" aria-hidden="true">arrow_back</span> Alle quizzen</a>
                <p class="quiz-eyebrow">${quiz.quiz}</p>
                <div class="quiz-progress-row"><span>Vraag ${currentQuestion + 1} van ${round.length}</span><span>${Math.round((currentQuestion / round.length) * 100)}%</span></div>
                <progress class="quiz-progress" value="${currentQuestion}" max="${round.length}" aria-label="Voortgang"></progress>
                <h1 class="quiz-question">${question.question}</h1>
                <div class="quiz-options">${options}</div>
                <p class="quiz-keyboard-hint">Kies met 1–${question.options.length} of A–${String.fromCharCode(64 + question.options.length)} · druk op Enter om verder te gaan</p>
                <div class="quiz-navigation">
                    <button class="quiz-button quiz-button-secondary" type="button" data-action="back" ${currentQuestion === 0 ? 'disabled' : ''}>Terug</button>
                    <button class="quiz-button" type="button" data-action="next" ${selectedAnswer === null ? 'disabled' : ''}>${currentQuestion === round.length - 1 ? 'Bekijk resultaat' : 'Volgende'}</button>
                </div>
            </section>`;

        quizApp.querySelectorAll('[data-option]').forEach((button) => {
            button.addEventListener('click', () => {
                selectAnswer(Number(button.dataset.option));
            });
        });

        quizApp.querySelector('[data-action="back"]').addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion -= 1;
                shouldConfirmExit = currentQuestion > 0;
                renderQuestion();
            }
        });

        quizApp.querySelector('[data-action="next"]').addEventListener('click', () => {
            if (answers[currentQuestion] === null) return;
            renderFeedback();
        });
    }

    function renderFeedback() {
        phase = 'feedback';
        const question = round[currentQuestion];
        const selectedOption = question.options[answers[currentQuestion]];
        const isCorrect = selectedOption === question.correct;
        const explanation = typeof question.explanation === 'string' && question.explanation.trim()
            ? question.explanation
            : 'Voor deze vraag is nog geen uitleg beschikbaar.';

        quizApp.innerHTML = `
            <section class="quiz-panel quiz-feedback is-entering ${isCorrect ? 'is-correct' : 'is-incorrect'}">
                <p class="quiz-eyebrow">${quiz.quiz} · Vraag ${currentQuestion + 1} van ${round.length}</p>
                <span class="material-symbols-outlined quiz-feedback-icon" aria-hidden="true">${isCorrect ? 'check_circle' : 'info'}</span>
                <h1>${isCorrect ? 'Goed gedaan!' : 'Dat is niet helemaal goed'}</h1>
                ${!isCorrect ? `<p class="quiz-feedback-answer">Jouw antwoord: <strong>${selectedOption}</strong></p>` : ''}
                <p class="quiz-feedback-answer">${isCorrect ? 'Jouw antwoord' : 'Het juiste antwoord'}: <strong>${question.correct}</strong></p>
                <div class="quiz-feedback-explanation">
                    <h2>Uitleg</h2>
                    <p class="quiz-status">${explanation}</p>
                </div>
                <div class="quiz-navigation quiz-feedback-actions">
                    <button class="quiz-button" type="button" data-action="continue">${currentQuestion === round.length - 1 ? 'Bekijk resultaat' : 'Volgende vraag'}</button>
                </div>
            </section>`;

        quizApp.querySelector('[data-action="continue"]').addEventListener('click', () => {
            if (phase !== 'feedback') return;
            phase = 'feedback-exiting';
            const feedbackPanel = quizApp.querySelector('.quiz-feedback');
            const continueButton = quizApp.querySelector('[data-action="continue"]');
            continueButton.disabled = true;
            feedbackPanel.classList.remove('is-entering');
            feedbackPanel.classList.add('is-exiting');

            const exitDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
            window.setTimeout(() => {
                if (currentQuestion < round.length - 1) {
                    currentQuestion += 1;
                    if (currentQuestion > 0) shouldConfirmExit = true;
                    renderQuestion(true);
                } else {
                    renderResult();
                }
            }, exitDelay);
        });
    }

    function renderResult() {
        phase = 'result';
        shouldConfirmExit = false;
        const score = round.reduce((total, question, index) => total + (question.options[answers[index]] === question.correct ? 1 : 0), 0);
        const resultText = score <= 3
            ? 'Owh, niet helemaal, wil je het opnieuw doen?'
            : score <= 7
                ? 'Prima! Wil je een andere quiz doen of deze opnieuw doen?'
                : 'Dat ging goed! Wil je een andere quiz proberen?';
        const showRestart = score <= 7;

        quizApp.innerHTML = `
            <section class="quiz-panel quiz-result">
                <p class="quiz-eyebrow">${quiz.quiz}</p>
                <span class="material-symbols-outlined quiz-result-icon" aria-hidden="true">${score >= 8 ? 'workspace_premium' : 'yard'}</span>
                <h1>${score >= 8 ? 'Dat ging goed!' : score >= 4 ? 'Prima!' : 'Owh, niet helemaal'}</h1>
                <p class="quiz-score">${score}<span> / ${round.length}</span></p>
                <p class="quiz-status">Je had ${score} van de ${round.length} vragen goed.</p>
                <p class="quiz-status">${resultText}</p>
                <div class="quiz-navigation quiz-result-actions">
                    ${showRestart ? '<button class="quiz-button quiz-button-secondary" type="button" data-action="restart">Opnieuw spelen</button>' : ''}
                    ${score >= 4 ? '<a class="quiz-button" href="./">Andere quiz</a>' : ''}
                </div>
            </section>`;

        quizApp.querySelector('[data-action="restart"]')?.addEventListener('click', () => startQuiz(quiz, questions));
    }

    activeKeyboardHandler = (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;

        if (phase === 'question') {
            const question = round[currentQuestion];
            const choiceKeys = '123456789'.slice(0, question.options.length) + 'abcdefghijklmnopqrstuvwxyz'.slice(0, question.options.length);
            const keyIndex = choiceKeys.indexOf(event.key.toLowerCase());

            if (keyIndex >= 0) {
                const optionIndex = keyIndex % question.options.length;
                event.preventDefault();
                selectAnswer(optionIndex);
                quizApp.querySelector(`[data-option="${optionIndex}"]`).focus();
                return;
            }

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                const focusedIndex = Number(document.activeElement.dataset.option);
                const currentIndex = Number.isInteger(focusedIndex) && document.activeElement.hasAttribute('data-option')
                    ? focusedIndex
                    : answers[currentQuestion] ?? (event.key === 'ArrowDown' ? -1 : 0);
                const offset = event.key === 'ArrowDown' ? 1 : -1;
                const nextIndex = (currentIndex + offset + question.options.length) % question.options.length;
                event.preventDefault();
                selectAnswer(nextIndex);
                quizApp.querySelector(`[data-option="${nextIndex}"]`).focus();
                return;
            }

            if ((event.key === 'Enter' || event.key === ' ') && answers[currentQuestion] !== null) {
                event.preventDefault();
                quizApp.querySelector('[data-action="next"]').click();
            }
        } else if (phase === 'feedback' && event.key === 'Enter') {
            event.preventDefault();
            quizApp.querySelector('[data-action="continue"]').click();
        }
    };
    document.addEventListener('keydown', activeKeyboardHandler);

    renderQuestion();
}

async function loadQuiz() {
    if (!selectedQuiz || !quizFiles[selectedQuiz]) {
        showError('Kies een quiz via de quizzenpagina.');
        return;
    }
    // No way als je dit echt zit te lezen
    // Of zoek je gwn comments
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
            question.options.every((option) => typeof option === 'string') &&
            question.options.includes(question.correct)
        );
        if (validQuestions.length === 0) throw new Error('Deze quiz heeft geen geldige vragen.');
        startQuiz(quiz, validQuestions);
    } catch (error) {
        showError(error.message);
    }
}

loadQuiz();