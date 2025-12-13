/**
 * Main Application JavaScript
 * Initializes components and handles page-level functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update progress displays
    updateProgressDisplays();

    // Initialize any auto-init components
    initializeComponents();

    // Setup navigation highlighting
    setupNavigation();
});

/**
 * Initialize components marked with data attributes
 */
function initializeComponents() {
    // Auto-initialize Parsons problems
    document.querySelectorAll('[data-component="parsons"]').forEach(container => {
        const configScript = container.querySelector('script[type="application/json"]');
        if (configScript) {
            try {
                const config = JSON.parse(configScript.textContent);
                new ParsonsProblem(container, config);
            } catch (e) {
                console.error('Failed to initialize Parsons problem:', e);
            }
        }
    });

    // Auto-initialize Code Tracing
    document.querySelectorAll('[data-component="tracing"]').forEach(container => {
        const configScript = container.querySelector('script[type="application/json"]');
        if (configScript) {
            try {
                const config = JSON.parse(configScript.textContent);
                new CodeTracing(container, config);
            } catch (e) {
                console.error('Failed to initialize Code Tracing:', e);
            }
        }
    });

    // Auto-initialize Prediction Quizzes
    document.querySelectorAll('[data-component="prediction"]').forEach(container => {
        const configScript = container.querySelector('script[type="application/json"]');
        if (configScript) {
            try {
                const config = JSON.parse(configScript.textContent);
                new PredictionQuiz(container, config);
            } catch (e) {
                console.error('Failed to initialize Prediction Quiz:', e);
            }
        }
    });

    // Auto-initialize Worked Examples
    document.querySelectorAll('[data-component="worked-example"]').forEach(container => {
        const configScript = container.querySelector('script[type="application/json"]');
        if (configScript) {
            try {
                const config = JSON.parse(configScript.textContent);
                new WorkedExample(container, config);
            } catch (e) {
                console.error('Failed to initialize Worked Example:', e);
            }
        }
    });
}

/**
 * Setup navigation active state
 */
function setupNavigation() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href) || (href !== 'index.html' && currentPath.includes(href.replace('index.html', '')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Utility: Format code for display
 */
function formatCode(code) {
    return code
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
        .replace(/  /g, '&nbsp;&nbsp;');
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export utilities
window.formatCode = formatCode;
window.debounce = debounce;
window.showToast = showToast;
