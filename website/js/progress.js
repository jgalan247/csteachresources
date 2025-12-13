/**
 * Progress Tracking System
 * Stores student progress in localStorage
 */

const Progress = {
    STORAGE_KEY: 'python_learning_progress',

    /**
     * Get all progress data
     */
    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : {
            activities: {},
            topics: {},
            lastVisited: null
        };
    },

    /**
     * Save all progress data
     */
    saveAll(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Mark an activity as started
     */
    startActivity(activityId, topicId) {
        const data = this.getAll();
        if (!data.activities[activityId]) {
            data.activities[activityId] = {
                status: 'in-progress',
                startedAt: new Date().toISOString(),
                topicId: topicId,
                attempts: 0,
                bestScore: null
            };
        }
        data.lastVisited = activityId;
        this.saveAll(data);
        this.updateTopicProgress(topicId);
    },

    /**
     * Mark an activity as completed
     */
    completeActivity(activityId, score = null) {
        const data = this.getAll();
        if (!data.activities[activityId]) {
            data.activities[activityId] = {
                status: 'completed',
                startedAt: new Date().toISOString(),
                attempts: 1,
                bestScore: score
            };
        } else {
            data.activities[activityId].status = 'completed';
            data.activities[activityId].completedAt = new Date().toISOString();
            data.activities[activityId].attempts++;
            if (score !== null) {
                const current = data.activities[activityId].bestScore;
                data.activities[activityId].bestScore = current ? Math.max(current, score) : score;
            }
        }
        this.saveAll(data);

        // Update topic progress
        if (data.activities[activityId].topicId) {
            this.updateTopicProgress(data.activities[activityId].topicId);
        }
    },

    /**
     * Record an attempt at an activity
     */
    recordAttempt(activityId, score) {
        const data = this.getAll();
        if (data.activities[activityId]) {
            data.activities[activityId].attempts++;
            if (score !== null) {
                const current = data.activities[activityId].bestScore;
                data.activities[activityId].bestScore = current ? Math.max(current, score) : score;
            }
            this.saveAll(data);
        }
    },

    /**
     * Get status of a specific activity
     */
    getActivityStatus(activityId) {
        const data = this.getAll();
        return data.activities[activityId] || { status: 'not-started' };
    },

    /**
     * Update topic progress based on completed activities
     */
    updateTopicProgress(topicId) {
        const data = this.getAll();
        const topicActivities = Object.entries(data.activities)
            .filter(([_, activity]) => activity.topicId === topicId);

        if (topicActivities.length === 0) {
            data.topics[topicId] = { progress: 0, completed: 0, total: 0 };
        } else {
            const completed = topicActivities.filter(([_, a]) => a.status === 'completed').length;
            const total = topicActivities.length;
            data.topics[topicId] = {
                progress: Math.round((completed / total) * 100),
                completed,
                total
            };
        }
        this.saveAll(data);
    },

    /**
     * Get topic progress
     */
    getTopicProgress(topicId) {
        const data = this.getAll();
        return data.topics[topicId] || { progress: 0, completed: 0, total: 0 };
    },

    /**
     * Set total activities for a topic
     */
    setTopicTotal(topicId, total) {
        const data = this.getAll();
        if (!data.topics[topicId]) {
            data.topics[topicId] = { progress: 0, completed: 0, total };
        } else {
            data.topics[topicId].total = total;
            const completed = data.topics[topicId].completed || 0;
            data.topics[topicId].progress = Math.round((completed / total) * 100);
        }
        this.saveAll(data);
    },

    /**
     * Reset all progress
     */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Export progress as JSON
     */
    export() {
        return JSON.stringify(this.getAll(), null, 2);
    },

    /**
     * Import progress from JSON
     */
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.saveAll(data);
            return true;
        } catch (e) {
            console.error('Failed to import progress:', e);
            return false;
        }
    }
};

/**
 * Update progress displays on page
 */
function updateProgressDisplays() {
    // Update topic progress bars on home page
    document.querySelectorAll('.topic-progress').forEach(el => {
        const topicId = el.dataset.topic;
        if (topicId) {
            const progress = Progress.getTopicProgress(topicId);
            const fill = el.querySelector('.progress-fill');
            const text = el.querySelector('.progress-text');
            if (fill) fill.style.width = `${progress.progress}%`;
            if (text) text.textContent = `${progress.progress}% complete`;
        }
    });

    // Update activity cards
    document.querySelectorAll('.activity-card').forEach(el => {
        const activityId = el.dataset.activityId;
        if (activityId) {
            const status = Progress.getActivityStatus(activityId);
            const badge = el.querySelector('.status-badge');
            if (badge) {
                badge.className = `status-badge ${status.status}`;
                badge.textContent = formatStatus(status.status);
            }
        }
    });
}

function formatStatus(status) {
    switch (status) {
        case 'completed': return 'Completed';
        case 'in-progress': return 'In Progress';
        default: return 'Not Started';
    }
}

// Initialize progress displays on page load
document.addEventListener('DOMContentLoaded', updateProgressDisplays);

// Export for use in other modules
window.Progress = Progress;
