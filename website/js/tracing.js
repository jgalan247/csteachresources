/**
 * Code Tracing Interactive Component
 * Step through code and track variable values
 */

class CodeTracing {
    constructor(container, config) {
        this.container = container;
        this.config = {
            id: config.id || 'tracing-' + Date.now(),
            title: config.title || 'Code Tracing',
            code: config.code || '',
            variables: config.variables || [],
            solution: config.solution || [],
            includeOutput: config.includeOutput !== false,
            prefilled: config.prefilled || [],
            hints: config.hints || {},
            topicId: config.topicId || null,
            onComplete: config.onComplete || null
        };

        this.currentStep = 0;
        this.userAnswers = {};
        this.init();
    }

    init() {
        this.render();
        this.setupEvents();
        Progress.startActivity(this.config.id, this.config.topicId);
    }

    render() {
        const codeLines = this.config.code.trim().split('\n');

        const html = `
            <div class="tracing-header">
                <h3>${this.config.title}</h3>
                <p>Trace through the code step by step. Fill in the variable values after each line executes.</p>
            </div>

            <div class="tracing-code">
                <div class="code-display">
                    <div class="code-header">
                        <span class="code-filename">program.py</span>
                    </div>
                    <pre class="code-content"><div class="code-with-lines">${this.renderCodeLines(codeLines)}</div></pre>
                </div>
            </div>

            <div class="trace-table-container">
                <table class="trace-table">
                    <thead>
                        <tr>
                            <th>Step</th>
                            <th>Line</th>
                            ${this.config.variables.map(v => `<th>${v}</th>`).join('')}
                            ${this.config.includeOutput ? '<th>Output</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderTraceRows()}
                    </tbody>
                </table>
            </div>

            <div class="tracing-controls">
                <button class="btn btn-primary" id="${this.config.id}-check">Check Answers</button>
                <button class="btn btn-secondary" id="${this.config.id}-reset">Reset</button>
                <button class="btn btn-secondary" id="${this.config.id}-show-solution">Show Solution</button>
                <span class="step-indicator" id="${this.config.id}-progress">0 / ${this.config.solution.length} steps completed</span>
            </div>

            <div class="parsons-feedback" id="${this.config.id}-feedback"></div>
        `;

        this.container.innerHTML = html;
        this.container.classList.add('tracing-container');
    }

    renderCodeLines(lines) {
        return lines.map((line, index) => `
            <div class="code-line" data-line="${index + 1}">
                <span class="line-number">${index + 1}</span>
                <span class="line-content">${this.syntaxHighlight(line)}</span>
            </div>
        `).join('');
    }

    syntaxHighlight(code) {
        // Simple Python syntax highlighting
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

    renderTraceRows() {
        return this.config.solution.map((step, index) => {
            const isPrefilled = this.config.prefilled.includes(index);

            return `
                <tr data-step="${index}">
                    <td>${step.step}</td>
                    <td>${step.line}</td>
                    ${this.config.variables.map(varName => {
                        const value = step.variables[varName];
                        const displayValue = value === null ? '-' : String(value);

                        if (isPrefilled) {
                            return `<td class="prefilled">${displayValue}</td>`;
                        }
                        return `
                            <td>
                                <input type="text"
                                       data-step="${index}"
                                       data-var="${varName}"
                                       placeholder="?"
                                       aria-label="${varName} at step ${step.step}">
                            </td>
                        `;
                    }).join('')}
                    ${this.config.includeOutput ? `
                        <td class="output-cell">
                            ${isPrefilled ?
                                (step.output || '') :
                                `<input type="text"
                                        data-step="${index}"
                                        data-var="output"
                                        placeholder="?"
                                        aria-label="Output at step ${step.step}">`
                            }
                        </td>
                    ` : ''}
                </tr>
            `;
        }).join('');
    }

    setupEvents() {
        // Check button
        this.container.querySelector(`#${this.config.id}-check`)
            .addEventListener('click', () => this.checkAnswers());

        // Reset button
        this.container.querySelector(`#${this.config.id}-reset`)
            .addEventListener('click', () => this.reset());

        // Show solution button
        this.container.querySelector(`#${this.config.id}-show-solution`)
            .addEventListener('click', () => this.showSolution());

        // Input change events
        this.container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', (e) => this.handleInputChange(e));
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswers();
                }
            });
        });

        // Highlight code line on row hover
        this.container.querySelectorAll('tr[data-step]').forEach(row => {
            row.addEventListener('mouseenter', () => {
                const step = parseInt(row.dataset.step);
                const lineNum = this.config.solution[step].line;
                this.highlightLine(lineNum);
            });
            row.addEventListener('mouseleave', () => {
                this.clearHighlights();
            });
        });
    }

    handleInputChange(e) {
        const step = e.target.dataset.step;
        const varName = e.target.dataset.var;

        if (!this.userAnswers[step]) {
            this.userAnswers[step] = {};
        }
        this.userAnswers[step][varName] = e.target.value.trim();
    }

    highlightLine(lineNum) {
        this.clearHighlights();
        const line = this.container.querySelector(`.code-line[data-line="${lineNum}"]`);
        if (line) {
            line.classList.add('active');
        }
    }

    clearHighlights() {
        this.container.querySelectorAll('.code-line').forEach(line => {
            line.classList.remove('active');
        });
    }

    checkAnswers() {
        let correctCount = 0;
        let totalChecked = 0;
        const feedback = this.container.querySelector(`#${this.config.id}-feedback`);

        this.container.querySelectorAll('input').forEach(input => {
            const step = parseInt(input.dataset.step);
            const varName = input.dataset.var;
            const userValue = input.value.trim();

            let expectedValue;
            if (varName === 'output') {
                expectedValue = this.config.solution[step].output || '';
            } else {
                expectedValue = this.config.solution[step].variables[varName];
            }

            // Normalize values for comparison
            const normalizedExpected = this.normalizeValue(expectedValue);
            const normalizedUser = this.normalizeValue(userValue);

            totalChecked++;

            if (normalizedUser === normalizedExpected) {
                input.classList.remove('incorrect');
                input.classList.add('correct');
                correctCount++;
            } else if (userValue !== '') {
                input.classList.remove('correct');
                input.classList.add('incorrect');
            }
        });

        // Update progress indicator
        const progressIndicator = this.container.querySelector(`#${this.config.id}-progress`);
        progressIndicator.textContent = `${correctCount} / ${totalChecked} correct`;

        // Show feedback
        const percentage = Math.round((correctCount / totalChecked) * 100);

        if (correctCount === totalChecked) {
            feedback.className = 'parsons-feedback show correct';
            feedback.innerHTML = `
                <strong>🎉 Perfect!</strong>
                <p>You traced through the code correctly!</p>
            `;
            Progress.completeActivity(this.config.id, 100);

            if (this.config.onComplete) {
                this.config.onComplete(true, percentage);
            }
        } else if (percentage >= 50) {
            feedback.className = 'parsons-feedback show';
            feedback.style.background = 'var(--warning-light)';
            feedback.style.borderColor = 'var(--warning)';
            feedback.style.color = 'var(--warning)';
            feedback.innerHTML = `
                <strong>Good progress!</strong>
                <p>You got ${correctCount} out of ${totalChecked} correct (${percentage}%).</p>
                <p>Check the red boxes and try again.</p>
            `;
            Progress.recordAttempt(this.config.id, percentage);
        } else {
            feedback.className = 'parsons-feedback show incorrect';
            feedback.innerHTML = `
                <strong>Keep trying!</strong>
                <p>You got ${correctCount} out of ${totalChecked} correct.</p>
                <p>Think about what happens at each line step by step.</p>
            `;
            Progress.recordAttempt(this.config.id, percentage);
        }
    }

    normalizeValue(value) {
        if (value === null || value === undefined) return '-';
        if (value === '') return '';

        const str = String(value).trim().toLowerCase();

        // Handle 'null', 'none', '-' equivalence
        if (str === 'null' || str === 'none' || str === '-' || str === 'undefined') {
            return '-';
        }

        return str;
    }

    showSolution() {
        this.container.querySelectorAll('input').forEach(input => {
            const step = parseInt(input.dataset.step);
            const varName = input.dataset.var;

            let expectedValue;
            if (varName === 'output') {
                expectedValue = this.config.solution[step].output || '';
            } else {
                expectedValue = this.config.solution[step].variables[varName];
            }

            const displayValue = expectedValue === null ? '-' : String(expectedValue);
            input.value = displayValue;
            input.classList.add('correct');
        });

        const feedback = this.container.querySelector(`#${this.config.id}-feedback`);
        feedback.className = 'parsons-feedback show';
        feedback.style.background = 'var(--primary-light)';
        feedback.style.borderColor = 'var(--primary)';
        feedback.style.color = 'var(--primary)';
        feedback.innerHTML = `
            <strong>Solution shown</strong>
            <p>Study the solution to understand how the code executes step by step.</p>
        `;
    }

    reset() {
        this.container.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        });

        this.userAnswers = {};

        const feedback = this.container.querySelector(`#${this.config.id}-feedback`);
        feedback.className = 'parsons-feedback';
        feedback.innerHTML = '';

        const progressIndicator = this.container.querySelector(`#${this.config.id}-progress`);
        progressIndicator.textContent = `0 / ${this.config.solution.length} steps completed`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use
window.CodeTracing = CodeTracing;
