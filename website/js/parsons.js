/**
 * Parsons Problem Interactive Component
 * Drag and drop code blocks into correct order
 */

class ParsonsProblem {
    constructor(container, config) {
        this.container = container;
        this.config = {
            id: config.id || 'parsons-' + Date.now(),
            title: config.title || 'Parsons Problem',
            instructions: config.instructions || 'Arrange the code blocks in the correct order.',
            expectedOutput: config.expectedOutput || '',
            blocks: config.blocks || [],
            solution: config.solution || [],
            hints: config.hints || [],
            type: config.type || 'standard', // standard, 2d
            topicId: config.topicId || null,
            onComplete: config.onComplete || null
        };
        this.currentHint = 0;
        this.attempts = 0;
        this.solved = false;

        this.init();
    }

    init() {
        this.render();
        this.setupDragAndDrop();
        Progress.startActivity(this.config.id, this.config.topicId);
    }

    render() {
        const html = `
            <div class="parsons-header">
                <h3>${this.config.title}</h3>
                <div class="parsons-instructions">
                    <p>${this.config.instructions}</p>
                </div>
                ${this.config.expectedOutput ? `
                    <div class="parsons-expected-output">
                        <h4>Expected Output:</h4>
                        <pre>${this.escapeHtml(this.config.expectedOutput)}</pre>
                    </div>
                ` : ''}
            </div>

            <div class="parsons-workspace">
                <div class="parsons-source">
                    <h4><span>📦</span> Available Blocks</h4>
                    <div class="parsons-blocks" id="${this.config.id}-source">
                        ${this.renderBlocks()}
                    </div>
                </div>

                <div class="parsons-solution">
                    <h4><span>✅</span> Your Solution</h4>
                    <div class="parsons-blocks" id="${this.config.id}-solution"></div>
                </div>
            </div>

            <div class="parsons-feedback" id="${this.config.id}-feedback"></div>

            <div class="parsons-controls">
                <button class="btn btn-primary" id="${this.config.id}-check">Check Solution</button>
                <button class="btn btn-secondary" id="${this.config.id}-reset">Reset</button>
                ${this.config.hints.length > 0 ? `
                    <button class="btn hint-button" id="${this.config.id}-hint">
                        💡 Get Hint
                        <span class="hints-remaining">(${this.config.hints.length} available)</span>
                    </button>
                ` : ''}
            </div>

            <div class="hint-content" id="${this.config.id}-hint-content"></div>
        `;

        this.container.innerHTML = html;
        this.container.classList.add('parsons-container');

        // Bind events
        this.container.querySelector(`#${this.config.id}-check`).addEventListener('click', () => this.checkSolution());
        this.container.querySelector(`#${this.config.id}-reset`).addEventListener('click', () => this.reset());

        const hintBtn = this.container.querySelector(`#${this.config.id}-hint`);
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
    }

    renderBlocks() {
        // Shuffle blocks for display
        const shuffled = [...this.config.blocks].sort(() => Math.random() - 0.5);

        return shuffled.map(block => `
            <div class="parsons-block ${block.isDistractor ? 'distractor' : ''}"
                 draggable="true"
                 data-id="${block.id}"
                 data-indent="${block.indentLevel || 0}">
                <code>${this.escapeHtml(block.code)}</code>
            </div>
        `).join('');
    }

    setupDragAndDrop() {
        const sourceContainer = this.container.querySelector(`#${this.config.id}-source`);
        const solutionContainer = this.container.querySelector(`#${this.config.id}-solution`);

        [sourceContainer, solutionContainer].forEach(container => {
            container.addEventListener('dragover', (e) => this.handleDragOver(e));
            container.addEventListener('drop', (e) => this.handleDrop(e, container));
            container.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });

        this.container.querySelectorAll('.parsons-block').forEach(block => {
            block.addEventListener('dragstart', (e) => this.handleDragStart(e));
            block.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
    }

    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.container.querySelectorAll('.parsons-block').forEach(block => {
            block.classList.remove('over');
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const container = e.target.closest('.parsons-blocks');
        if (container) {
            const afterElement = this.getDragAfterElement(container, e.clientY);
            const draggable = this.container.querySelector('.dragging');

            if (afterElement) {
                container.insertBefore(draggable, afterElement);
            } else {
                container.appendChild(draggable);
            }
        }
    }

    handleDragLeave(e) {
        e.target.classList.remove('over');
    }

    handleDrop(e, container) {
        e.preventDefault();
        // The element is already moved in dragover, just clean up
        this.container.querySelectorAll('.parsons-block').forEach(block => {
            block.classList.remove('over');
        });

        // Re-attach drag events to moved elements
        this.container.querySelectorAll('.parsons-block').forEach(block => {
            block.removeEventListener('dragstart', (e) => this.handleDragStart(e));
            block.removeEventListener('dragend', (e) => this.handleDragEnd(e));
            block.addEventListener('dragstart', (e) => this.handleDragStart(e));
            block.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.parsons-block:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    checkSolution() {
        this.attempts++;
        const solutionContainer = this.container.querySelector(`#${this.config.id}-solution`);
        const blocks = solutionContainer.querySelectorAll('.parsons-block');
        const feedback = this.container.querySelector(`#${this.config.id}-feedback`);

        // Get user's answer
        const userAnswer = Array.from(blocks).map(block => parseInt(block.dataset.id));

        // Check against solution
        const isCorrect = this.arraysEqual(userAnswer, this.config.solution);

        if (isCorrect) {
            this.solved = true;
            feedback.className = 'parsons-feedback show correct';
            feedback.innerHTML = `
                <strong>🎉 Correct!</strong>
                <p>Well done! You arranged the code blocks correctly.</p>
                <p>Attempts: ${this.attempts}</p>
            `;
            Progress.completeActivity(this.config.id, 100);

            if (this.config.onComplete) {
                this.config.onComplete(true, this.attempts);
            }
        } else {
            // Check for common errors
            let hint = this.getErrorHint(userAnswer);

            feedback.className = 'parsons-feedback show incorrect';
            feedback.innerHTML = `
                <strong>❌ Not quite right</strong>
                <p>${hint}</p>
                <p>Keep trying! Attempts: ${this.attempts}</p>
            `;

            Progress.recordAttempt(this.config.id, 0);
        }
    }

    getErrorHint(userAnswer) {
        // Check if all blocks are present
        if (userAnswer.length !== this.config.solution.length) {
            if (userAnswer.length < this.config.solution.length) {
                return "You haven't used all the blocks yet. Make sure to drag all needed blocks to the solution area.";
            } else {
                return "You've used too many blocks. Check if you've included any wrong blocks.";
            }
        }

        // Check for distractor blocks
        const distractorIds = this.config.blocks.filter(b => b.isDistractor).map(b => b.id);
        const usedDistractors = userAnswer.filter(id => distractorIds.includes(id));
        if (usedDistractors.length > 0) {
            return "One or more of your blocks doesn't belong in the solution. Look carefully at what each line does.";
        }

        // Check first block
        if (userAnswer[0] !== this.config.solution[0]) {
            return "Check your first block. Think about what needs to happen first in this program.";
        }

        // Generic hint
        return "The order isn't quite right. Think about what needs to happen step by step.";
    }

    showHint() {
        if (this.currentHint >= this.config.hints.length) {
            return;
        }

        const hintContent = this.container.querySelector(`#${this.config.id}-hint-content`);
        const hintBtn = this.container.querySelector(`#${this.config.id}-hint`);
        const remaining = this.config.hints.length - this.currentHint - 1;

        hintContent.innerHTML = `<strong>Hint ${this.currentHint + 1}:</strong> ${this.config.hints[this.currentHint]}`;
        hintContent.classList.add('show');

        this.currentHint++;

        const remainingSpan = hintBtn.querySelector('.hints-remaining');
        if (remainingSpan) {
            remainingSpan.textContent = remaining > 0 ? `(${remaining} remaining)` : '(no more hints)';
        }

        if (this.currentHint >= this.config.hints.length) {
            hintBtn.disabled = true;
        }
    }

    reset() {
        const sourceContainer = this.container.querySelector(`#${this.config.id}-source`);
        const solutionContainer = this.container.querySelector(`#${this.config.id}-solution`);
        const feedback = this.container.querySelector(`#${this.config.id}-feedback`);
        const hintContent = this.container.querySelector(`#${this.config.id}-hint-content`);

        // Move all blocks back to source
        const allBlocks = this.container.querySelectorAll('.parsons-block');
        allBlocks.forEach(block => sourceContainer.appendChild(block));

        // Shuffle
        const blocksArray = Array.from(sourceContainer.children);
        blocksArray.sort(() => Math.random() - 0.5);
        blocksArray.forEach(block => sourceContainer.appendChild(block));

        // Clear feedback
        feedback.className = 'parsons-feedback';
        feedback.innerHTML = '';

        // Reset hints
        this.currentHint = 0;
        if (hintContent) {
            hintContent.classList.remove('show');
            hintContent.innerHTML = '';
        }

        const hintBtn = this.container.querySelector(`#${this.config.id}-hint`);
        if (hintBtn) {
            hintBtn.disabled = false;
            const remainingSpan = hintBtn.querySelector('.hints-remaining');
            if (remainingSpan) {
                remainingSpan.textContent = `(${this.config.hints.length} available)`;
            }
        }
    }

    arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export for use
window.ParsonsProblem = ParsonsProblem;
