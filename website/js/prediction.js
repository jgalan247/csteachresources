/**
 * Prediction Quiz Component
 * Students predict code output before running
 */

class PredictionQuiz {
    constructor(container, config) {
        this.container = container;
        this.config = {
            id: config.id || 'prediction-' + Date.now(),
            title: config.title || 'Predict the Output',
            code: config.code || '',
            question: config.question || 'What will this code output?',
            options: config.options || [],
            correctIndex: config.correctIndex || 0,
            explanation: config.explanation || '',
            misconceptions: config.misconceptions || {},
            topicId: config.topicId || null,
            onComplete: config.onComplete || null
        };

        this.answered = false;
        this.selectedIndex = null;
        this.init();
    }

    init() {
        this.render();
        this.setupEvents();
        Progress.startActivity(this.config.id, this.config.topicId);
    }

    render() {
        const html = `
            <div class="prediction-question">
                <h3><span>🔮</span> ${this.config.title}</h3>

                <div class="code-display">
                    <div class="code-header">
                        <span class="code-filename">program.py</span>
                    </div>
                    <pre class="code-content"><code>${this.syntaxHighlight(this.config.code)}</code></pre>
                </div>

                <p class="mt-lg"><strong>${this.config.question}</strong></p>

                <div class="prediction-options">
                    ${this.config.options.map((option, index) => `
                        <div class="prediction-option" data-index="${index}">
                            <input type="radio"
                                   name="${this.config.id}-option"
                                   id="${this.config.id}-option-${index}"
                                   value="${index}">
                            <label for="${this.config.id}-option-${index}">${this.escapeHtml(option)}</label>
                        </div>
                    `).join('')}
                </div>

                <div class="prediction-explanation" id="${this.config.id}-explanation"></div>

                <div class="mt-lg">
                    <button class="btn btn-primary" id="${this.config.id}-submit" disabled>Submit Answer</button>
                    <button class="btn btn-secondary" id="${this.config.id}-next" style="display: none;">Next Question</button>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.container.classList.add('prediction-container');
    }

    setupEvents() {
        // Option selection
        this.container.querySelectorAll('.prediction-option').forEach(option => {
            option.addEventListener('click', () => {
                if (this.answered) return;
                this.selectOption(parseInt(option.dataset.index));
            });
        });

        // Submit button
        this.container.querySelector(`#${this.config.id}-submit`)
            .addEventListener('click', () => this.submitAnswer());

        // Next button (for quiz sequences)
        this.container.querySelector(`#${this.config.id}-next`)
            .addEventListener('click', () => {
                if (this.config.onComplete) {
                    this.config.onComplete(this.selectedIndex === this.config.correctIndex);
                }
            });
    }

    selectOption(index) {
        if (this.answered) return;

        this.selectedIndex = index;

        // Update visual selection
        this.container.querySelectorAll('.prediction-option').forEach((option, i) => {
            option.classList.toggle('selected', i === index);
            option.querySelector('input').checked = i === index;
        });

        // Enable submit button
        this.container.querySelector(`#${this.config.id}-submit`).disabled = false;
    }

    submitAnswer() {
        if (this.answered || this.selectedIndex === null) return;

        this.answered = true;
        const isCorrect = this.selectedIndex === this.config.correctIndex;

        // Update option styles
        this.container.querySelectorAll('.prediction-option').forEach((option, index) => {
            if (index === this.config.correctIndex) {
                option.classList.add('correct');
            } else if (index === this.selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        // Show explanation
        const explanationDiv = this.container.querySelector(`#${this.config.id}-explanation`);
        let explanationText = this.config.explanation;

        // Add misconception feedback if available
        if (!isCorrect && this.config.misconceptions[this.selectedIndex]) {
            explanationText = this.config.misconceptions[this.selectedIndex] + '\n\n' + explanationText;
        }

        explanationDiv.innerHTML = `
            <strong>${isCorrect ? '✅ Correct!' : '❌ Not quite right'}</strong>
            <p>${explanationText}</p>
        `;
        explanationDiv.className = `prediction-explanation show ${isCorrect ? 'correct' : 'incorrect'}`;

        // Update buttons
        this.container.querySelector(`#${this.config.id}-submit`).style.display = 'none';
        this.container.querySelector(`#${this.config.id}-next`).style.display = 'inline-flex';

        // Update progress
        if (isCorrect) {
            Progress.completeActivity(this.config.id, 100);
        } else {
            Progress.recordAttempt(this.config.id, 0);
        }
    }

    syntaxHighlight(code) {
        let highlighted = this.escapeHtml(code);

        // Strings FIRST (before adding any HTML with quotes)
        highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>');
        highlighted = highlighted.replace(/'([^']*)'/g, '<span class="syntax-string">\'$1\'</span>');

        // Comments (before keywords to avoid highlighting keywords in comments)
        highlighted = highlighted.replace(/(#.*)$/gm, '<span class="syntax-comment">$1</span>');

        // Keywords
        const keywords = ['for', 'while', 'if', 'else', 'elif', 'def', 'return', 'in', 'range', 'print', 'True', 'False', 'None', 'and', 'or', 'not'];
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b(${kw})\\b`, 'g');
            highlighted = highlighted.replace(regex, '<span class="syntax-keyword">$1</span>');
        });

        // Numbers
        highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>');

        return highlighted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/**
 * Prediction Quiz Series - Multiple questions in sequence
 */
class PredictionQuizSeries {
    constructor(container, config) {
        this.container = container;
        this.questions = config.questions || [];
        this.topicId = config.topicId || null;
        this.currentIndex = 0;
        this.score = 0;

        this.init();
    }

    init() {
        this.showQuestion(0);
    }

    showQuestion(index) {
        if (index >= this.questions.length) {
            this.showResults();
            return;
        }

        this.currentIndex = index;
        const question = this.questions[index];

        // Add progress indicator
        const progressHtml = `
            <div class="quiz-progress mb-lg">
                <span>Question ${index + 1} of ${this.questions.length}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(index / this.questions.length) * 100}%"></div>
                </div>
            </div>
        `;

        this.container.innerHTML = progressHtml + '<div id="quiz-question"></div>';

        const quiz = new PredictionQuiz(
            this.container.querySelector('#quiz-question'),
            {
                ...question,
                topicId: this.topicId,
                onComplete: (correct) => {
                    if (correct) this.score++;
                    setTimeout(() => this.showQuestion(index + 1), 1500);
                }
            }
        );
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);

        this.container.innerHTML = `
            <div class="prediction-container">
                <div class="text-center">
                    <h2>${percentage >= 70 ? '🎉' : '📚'} Quiz Complete!</h2>
                    <p class="mt-lg">You got <strong>${this.score} out of ${this.questions.length}</strong> correct (${percentage}%)</p>

                    <div class="progress-bar mt-lg" style="height: 20px; max-width: 300px; margin: 0 auto;">
                        <div class="progress-fill" style="width: ${percentage}%; background: ${percentage >= 70 ? 'var(--success)' : percentage >= 50 ? 'var(--warning)' : 'var(--error)'}"></div>
                    </div>

                    <p class="mt-lg">
                        ${percentage >= 70
                            ? "Great job! You have a solid understanding of this concept."
                            : percentage >= 50
                                ? "Good effort! Review the explanations and try again."
                                : "Keep practicing! Read through the explanations carefully."
                        }
                    </p>

                    <button class="btn btn-primary mt-lg" onclick="location.reload()">Try Again</button>
                </div>
            </div>
        `;

        Progress.completeActivity(this.topicId + '-quiz', percentage);
    }
}

// Export for use
window.PredictionQuiz = PredictionQuiz;
window.PredictionQuizSeries = PredictionQuizSeries;
