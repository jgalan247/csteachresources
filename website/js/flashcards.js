/**
 * Flashcard Revision System with Spaced Repetition
 * Uses a simplified SM-2 algorithm for optimal learning
 */

const FlashcardSystem = {
    STORAGE_KEY: 'flashcard_data',
    QUIZ_HISTORY_KEY: 'quiz_history',

    // Default ease factor for new cards (2.5 is standard)
    DEFAULT_EASE: 2.5,
    MIN_EASE: 1.3,

    // Rating values
    RATINGS: {
        AGAIN: 0,  // Complete failure - reset
        HARD: 1,   // Recalled with difficulty
        GOOD: 2,   // Recalled correctly
        EASY: 3    // Recalled easily
    },

    /**
     * Get all flashcard data from storage
     */
    getData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : {
            cards: {},
            stats: {
                totalReviews: 0,
                cardsLearned: 0,
                currentStreak: 0,
                lastReviewDate: null
            }
        };
    },

    /**
     * Save flashcard data to storage
     */
    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Generate a unique card ID from question content
     */
    generateCardId(question, topic) {
        const str = `${topic}-${question}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `card-${Math.abs(hash).toString(36)}`;
    },

    /**
     * Import wrong answers from quiz history as new flashcards
     */
    importFromQuizHistory() {
        const quizHistory = JSON.parse(localStorage.getItem(this.QUIZ_HISTORY_KEY) || '[]');
        const data = this.getData();
        let newCards = 0;

        quizHistory.forEach(quiz => {
            if (quiz.wrongAnswers && quiz.wrongAnswers.length > 0) {
                quiz.wrongAnswers.forEach(wrong => {
                    const cardId = this.generateCardId(wrong.question, wrong.concept || quiz.topic);

                    // Only add if card doesn't exist
                    if (!data.cards[cardId]) {
                        data.cards[cardId] = {
                            id: cardId,
                            question: wrong.question,
                            correctAnswer: wrong.correctAnswer,
                            userAnswer: wrong.userAnswer,
                            explanation: wrong.explanation,
                            topic: quiz.topic,
                            concept: wrong.concept || quiz.topic,
                            // Spaced repetition fields
                            easeFactor: this.DEFAULT_EASE,
                            interval: 0,
                            repetitions: 0,
                            dueDate: new Date().toISOString(),
                            lastReview: null,
                            createdAt: new Date().toISOString(),
                            // Track history
                            reviewHistory: []
                        };
                        newCards++;
                    }
                });
            }
        });

        this.saveData(data);
        return newCards;
    },

    /**
     * Get cards due for review today
     */
    getDueCards() {
        const data = this.getData();
        const now = new Date();

        return Object.values(data.cards).filter(card => {
            const dueDate = new Date(card.dueDate);
            return dueDate <= now;
        }).sort((a, b) => {
            // Prioritize cards with lower ease (harder cards)
            return a.easeFactor - b.easeFactor;
        });
    },

    /**
     * Get new cards (never reviewed)
     */
    getNewCards(limit = 10) {
        const data = this.getData();

        return Object.values(data.cards)
            .filter(card => card.repetitions === 0)
            .slice(0, limit);
    },

    /**
     * Get all cards for a specific topic
     */
    getCardsByTopic(topic) {
        const data = this.getData();
        return Object.values(data.cards).filter(card => card.topic === topic);
    },

    /**
     * Calculate next interval using SM-2 algorithm
     */
    calculateNextInterval(card, rating) {
        let { easeFactor, interval, repetitions } = card;

        if (rating === this.RATINGS.AGAIN) {
            // Failed - reset to learning phase
            repetitions = 0;
            interval = 0;
        } else {
            // Successful recall
            if (repetitions === 0) {
                interval = 1; // 1 day
            } else if (repetitions === 1) {
                interval = 3; // 3 days
            } else {
                interval = Math.round(interval * easeFactor);
            }
            repetitions++;

            // Adjust ease factor based on rating
            const easeAdjust = {
                [this.RATINGS.HARD]: -0.15,
                [this.RATINGS.GOOD]: 0,
                [this.RATINGS.EASY]: 0.15
            };
            easeFactor = Math.max(this.MIN_EASE, easeFactor + (easeAdjust[rating] || 0));
        }

        // Calculate next due date
        const dueDate = new Date();
        if (interval === 0) {
            // Show again in 10 minutes (for learning phase)
            dueDate.setMinutes(dueDate.getMinutes() + 10);
        } else {
            dueDate.setDate(dueDate.getDate() + interval);
        }

        return {
            easeFactor,
            interval,
            repetitions,
            dueDate: dueDate.toISOString()
        };
    },

    /**
     * Review a card with a rating
     */
    reviewCard(cardId, rating) {
        const data = this.getData();
        const card = data.cards[cardId];

        if (!card) return null;

        // Calculate new scheduling
        const newSchedule = this.calculateNextInterval(card, rating);

        // Update card
        card.easeFactor = newSchedule.easeFactor;
        card.interval = newSchedule.interval;
        card.repetitions = newSchedule.repetitions;
        card.dueDate = newSchedule.dueDate;
        card.lastReview = new Date().toISOString();

        // Add to review history
        card.reviewHistory.push({
            date: new Date().toISOString(),
            rating: rating,
            interval: newSchedule.interval
        });

        // Update stats
        data.stats.totalReviews++;

        // Check if card is "learned" (interval >= 21 days)
        if (newSchedule.interval >= 21 && card.reviewHistory.length > 0) {
            const wasLearned = card.reviewHistory.some(r => r.interval >= 21);
            if (!wasLearned) {
                data.stats.cardsLearned++;
            }
        }

        // Update streak
        const today = new Date().toDateString();
        const lastReview = data.stats.lastReviewDate;
        if (lastReview) {
            const lastDate = new Date(lastReview).toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate === today) {
                // Same day, streak unchanged
            } else if (lastDate === yesterday.toDateString()) {
                // Consecutive day
                data.stats.currentStreak++;
            } else {
                // Streak broken
                data.stats.currentStreak = 1;
            }
        } else {
            data.stats.currentStreak = 1;
        }
        data.stats.lastReviewDate = new Date().toISOString();

        this.saveData(data);
        return card;
    },

    /**
     * Get statistics summary
     */
    getStats() {
        const data = this.getData();
        const cards = Object.values(data.cards);
        const now = new Date();

        const dueToday = cards.filter(c => new Date(c.dueDate) <= now).length;
        const newCards = cards.filter(c => c.repetitions === 0).length;
        const learning = cards.filter(c => c.repetitions > 0 && c.interval < 21).length;
        const mature = cards.filter(c => c.interval >= 21).length;

        // Calculate average ease
        const avgEase = cards.length > 0
            ? cards.reduce((sum, c) => sum + c.easeFactor, 0) / cards.length
            : 0;

        // Get topics breakdown
        const topicCounts = {};
        cards.forEach(card => {
            topicCounts[card.topic] = (topicCounts[card.topic] || 0) + 1;
        });

        return {
            totalCards: cards.length,
            dueToday,
            newCards,
            learning,
            mature,
            averageEase: avgEase.toFixed(2),
            totalReviews: data.stats.totalReviews,
            cardsLearned: data.stats.cardsLearned,
            currentStreak: data.stats.currentStreak,
            topicBreakdown: topicCounts
        };
    },

    /**
     * Add a custom flashcard manually
     */
    addCard(question, answer, explanation, topic, concept) {
        const data = this.getData();
        const cardId = this.generateCardId(question, concept || topic);

        if (data.cards[cardId]) {
            return null; // Card already exists
        }

        data.cards[cardId] = {
            id: cardId,
            question,
            correctAnswer: answer,
            explanation,
            topic,
            concept: concept || topic,
            easeFactor: this.DEFAULT_EASE,
            interval: 0,
            repetitions: 0,
            dueDate: new Date().toISOString(),
            lastReview: null,
            createdAt: new Date().toISOString(),
            reviewHistory: [],
            isCustom: true
        };

        this.saveData(data);
        return data.cards[cardId];
    },

    /**
     * Delete a card
     */
    deleteCard(cardId) {
        const data = this.getData();
        if (data.cards[cardId]) {
            delete data.cards[cardId];
            this.saveData(data);
            return true;
        }
        return false;
    },

    /**
     * Reset all progress (keep cards but reset scheduling)
     */
    resetProgress() {
        const data = this.getData();

        Object.values(data.cards).forEach(card => {
            card.easeFactor = this.DEFAULT_EASE;
            card.interval = 0;
            card.repetitions = 0;
            card.dueDate = new Date().toISOString();
            card.lastReview = null;
            card.reviewHistory = [];
        });

        data.stats = {
            totalReviews: 0,
            cardsLearned: 0,
            currentStreak: 0,
            lastReviewDate: null
        };

        this.saveData(data);
    },

    /**
     * Clear all data
     */
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Export flashcard data as JSON
     */
    export() {
        return JSON.stringify(this.getData(), null, 2);
    },

    /**
     * Import flashcard data from JSON
     */
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.cards && data.stats) {
                this.saveData(data);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    /**
     * Get topic display names
     */
    getTopicName(topicId) {
        const names = {
            'variables': 'Variables',
            'operators': 'Arithmetic Operators',
            'data-types': 'Data Types',
            'selection': 'Selection',
            'for-loops': 'For Loops',
            'while-loops': 'While Loops',
            'arrays-1d': '1D Arrays',
            'arrays-2d': '2D Arrays',
            'strings': 'String Manipulation',
            'functions': 'Functions',
            'errors': 'Common Errors',
            'file-handling': 'File Handling',
            'validation': 'Input Validation',
            'sql': 'SQL & Databases',
            'cpu': 'CPU & Fetch-Execute',
            'memory': 'Memory & Storage',
            'storage': 'Secondary Storage',
            'units': 'Data Units',
            'numbers': 'Number Systems',
            'representation': 'Data Representation',
            'compression': 'Compression',
            'networks': 'Computer Networks',
            'protocols': 'Protocols & Layers',
            'security': 'Network Security',
            'prevention': 'Preventing Vulnerabilities',
            'operating-systems': 'Operating Systems',
            'utility-software': 'Utility Software'
        };
        return names[topicId] || topicId;
    }
};

// Export for global access
window.FlashcardSystem = FlashcardSystem;
