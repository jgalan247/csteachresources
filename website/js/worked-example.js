/**
 * Worked Example Viewer Component
 * Step-by-step examples with subgoal labels
 */

class WorkedExample {
    constructor(container, config) {
        this.container = container;
        this.config = {
            id: config.id || 'example-' + Date.now(),
            title: config.title || 'Worked Example',
            problem: config.problem || {},
            subgoals: config.subgoals || [],
            completeCode: config.completeCode || '',
            expectedOutput: config.expectedOutput || '',
            topicId: config.topicId || null
        };

        this.currentSubgoal = 0;
        this.viewMode = 'step'; // 'step' or 'complete'
        this.init();
    }

    init() {
        this.render();
        this.setupEvents();
        Progress.startActivity(this.config.id, this.config.topicId);
    }

    render() {
        const html = `
            <div class="worked-example-header">
                <h3><span>📖</span> ${this.config.title}</h3>
            </div>

            <div class="worked-example-problem">
                <h4>Problem:</h4>
                <p>${this.config.problem.statement || ''}</p>
                ${this.config.problem.context ? `<p class="text-muted"><em>${this.config.problem.context}</em></p>` : ''}
            </div>

            <div class="worked-example-controls mb-lg">
                <button class="btn btn-sm ${this.viewMode === 'step' ? 'btn-primary' : 'btn-secondary'}" id="${this.config.id}-view-step">
                    Step by Step
                </button>
                <button class="btn btn-sm ${this.viewMode === 'complete' ? 'btn-primary' : 'btn-secondary'}" id="${this.config.id}-view-complete">
                    Complete Code
                </button>
            </div>

            <div id="${this.config.id}-content">
                ${this.viewMode === 'step' ? this.renderStepView() : this.renderCompleteView()}
            </div>

            ${this.config.expectedOutput ? `
                <div class="worked-example-output mt-lg">
                    <h4>Expected Output:</h4>
                    <pre class="code-display"><code>${this.escapeHtml(this.config.expectedOutput)}</code></pre>
                </div>
            ` : ''}
        `;

        this.container.innerHTML = html;
        this.container.classList.add('worked-example-container');
    }

    renderStepView() {
        return `
            <div class="subgoals-container">
                ${this.config.subgoals.map((subgoal, index) => `
                    <div class="subgoal ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <div class="subgoal-header" data-index="${index}">
                            <span class="subgoal-number">${index + 1}</span>
                            <span class="subgoal-label">${subgoal.label}</span>
                            <span class="subgoal-toggle">${index === 0 ? '▼' : '▶'}</span>
                        </div>
                        <div class="subgoal-content">
                            <div class="subgoal-code">
                                <pre><code>${this.syntaxHighlight(subgoal.code)}</code></pre>
                            </div>
                            <div class="subgoal-explanation">
                                <p>${subgoal.explanation}</p>
                                ${subgoal.misconceptions ? this.renderMisconceptions(subgoal.misconceptions) : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="subgoal-navigation mt-lg">
                <button class="btn btn-secondary" id="${this.config.id}-prev" ${this.currentSubgoal === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="step-indicator">Step ${this.currentSubgoal + 1} of ${this.config.subgoals.length}</span>
                <button class="btn btn-primary" id="${this.config.id}-next" ${this.currentSubgoal === this.config.subgoals.length - 1 ? 'disabled' : ''}>
                    Next →
                </button>
            </div>

            <div class="mt-lg">
                <button class="btn btn-success" id="${this.config.id}-show-all">Show All Steps</button>
            </div>
        `;
    }

    renderCompleteView() {
        return `
            <div class="complete-code-view">
                <div class="code-display">
                    <div class="code-header">
                        <span class="code-filename">complete_solution.py</span>
                    </div>
                    <pre class="code-content"><code>${this.syntaxHighlight(this.config.completeCode)}</code></pre>
                </div>

                <div class="subgoal-labels-legend mt-lg">
                    <h4>Subgoal Labels:</h4>
                    <ol>
                        ${this.config.subgoals.map(sg => `<li><strong>${sg.label}</strong></li>`).join('')}
                    </ol>
                </div>
            </div>
        `;
    }

    renderMisconceptions(misconceptions) {
        if (!Array.isArray(misconceptions) || misconceptions.length === 0) return '';

        return `
            <div class="misconceptions mt-md">
                <h5>⚠️ Common Mistakes:</h5>
                ${misconceptions.map(m => `
                    <div class="misconception-item">
                        <p><strong>Wrong:</strong> <code>${m.wrong_approach || m.wrongApproach}</code></p>
                        <p><strong>Why:</strong> ${m.why_wrong || m.whyWrong}</p>
                        <p><strong>Correct:</strong> ${m.correction}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    setupEvents() {
        // View toggle buttons
        this.container.querySelector(`#${this.config.id}-view-step`)
            .addEventListener('click', () => this.setViewMode('step'));

        this.container.querySelector(`#${this.config.id}-view-complete`)
            .addEventListener('click', () => this.setViewMode('complete'));

        // Set up step view events if in step mode
        if (this.viewMode === 'step') {
            this.setupStepEvents();
        }
    }

    setupStepEvents() {
        // Subgoal header clicks
        this.container.querySelectorAll('.subgoal-header').forEach(header => {
            header.addEventListener('click', () => {
                const index = parseInt(header.dataset.index);
                this.goToSubgoal(index);
            });
        });

        // Navigation buttons
        const prevBtn = this.container.querySelector(`#${this.config.id}-prev`);
        const nextBtn = this.container.querySelector(`#${this.config.id}-next`);
        const showAllBtn = this.container.querySelector(`#${this.config.id}-show-all`);

        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSubgoal());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSubgoal());
        if (showAllBtn) showAllBtn.addEventListener('click', () => this.showAllSubgoals());
    }

    setViewMode(mode) {
        this.viewMode = mode;
        this.render();
        this.setupEvents();
    }

    goToSubgoal(index) {
        this.currentSubgoal = index;

        // Update active state
        this.container.querySelectorAll('.subgoal').forEach((sg, i) => {
            const isActive = i === index;
            sg.classList.toggle('active', isActive);
            sg.querySelector('.subgoal-toggle').textContent = isActive ? '▼' : '▶';
        });

        // Update navigation
        const prevBtn = this.container.querySelector(`#${this.config.id}-prev`);
        const nextBtn = this.container.querySelector(`#${this.config.id}-next`);
        const indicator = this.container.querySelector('.step-indicator');

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === this.config.subgoals.length - 1;
        if (indicator) indicator.textContent = `Step ${index + 1} of ${this.config.subgoals.length}`;

        // Mark progress if we've seen all steps
        if (index === this.config.subgoals.length - 1) {
            Progress.completeActivity(this.config.id, 100);
        }
    }

    prevSubgoal() {
        if (this.currentSubgoal > 0) {
            this.goToSubgoal(this.currentSubgoal - 1);
        }
    }

    nextSubgoal() {
        if (this.currentSubgoal < this.config.subgoals.length - 1) {
            this.goToSubgoal(this.currentSubgoal + 1);
        }
    }

    showAllSubgoals() {
        this.container.querySelectorAll('.subgoal').forEach(sg => {
            sg.classList.add('active');
            sg.querySelector('.subgoal-toggle').textContent = '▼';
        });

        // Hide the show all button
        const showAllBtn = this.container.querySelector(`#${this.config.id}-show-all`);
        if (showAllBtn) showAllBtn.style.display = 'none';

        Progress.completeActivity(this.config.id, 100);
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

// Export for use
window.WorkedExample = WorkedExample;
