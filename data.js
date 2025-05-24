// Import questions from JSON file
let initialQuestions = [];

// Fetch questions from JSON file
async function fetchInitialQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Failed to load questions');
        }
        const data = await response.json();
        initialQuestions = data.initialQuestions;
    } catch (error) {
        console.error('Error loading questions from JSON:', error);
        // Fallback to empty array if JSON load fails
        initialQuestions = [];
    }
}

// Create a namespace for our DSA tracker
window.DSATracker = {
    questions: [],
    STORAGE_KEY: 'dsa_questions',
    
    // Initialize questions from storage or default data
    async init() {
        // First try to load from localStorage
        const storedQuestions = localStorage.getItem(this.STORAGE_KEY);
        if (storedQuestions) {
            this.questions = JSON.parse(storedQuestions);
            return;
        }

        // If no stored questions, load from JSON file
        await fetchInitialQuestions();
        this.questions = [...initialQuestions];
        this.saveToLocalStorage();
    },
    
    // Get unique topics from questions
    getUniqueTopics() {
        return [...new Set(this.questions.map(q => q.topic))];
    },
    
    // Get questions statistics
    getStatistics() {
        const total = this.questions.length;
        const completed = this.questions.filter(q => q.status === "Completed").length;
        const inProgress = this.questions.filter(q => q.status === "In Progress").length;
        
        const topicStats = this.getUniqueTopics().map(topic => {
            const topicQuestions = this.questions.filter(q => q.topic === topic);
            return {
                topic,
                total: topicQuestions.length,
                completed: topicQuestions.filter(q => q.status === "Completed").length
            };
        });

        return {
            overall: {
                total,
                completed,
                inProgress,
                percentage: Math.round((completed / total) * 100)
            },
            byTopic: topicStats
        };
    },
    
    // Add a new question
    addQuestion(question) {
        const newId = Math.max(...this.questions.map(q => q.id)) + 1;
        const newQuestion = {
            id: newId,
            ...question,
            status: "Not Started",
            link: question.link || "",
            notes: "",
            solution: "",
            timeComplexity: "",
            spaceComplexity: "",
            lastModified: null
        };
        this.questions.push(newQuestion);
        this.saveToLocalStorage();
        return newQuestion;
    },
    
    // Update question status
    updateQuestionStatus(id, newStatus) {
        const question = this.questions.find(q => q.id === id);
        if (question) {
            question.status = newStatus;
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    // Update question notes and solution
    updateQuestionNotes(id, updates) {
        const question = this.questions.find(q => q.id === id);
        if (question) {
            // Update only the provided fields
            if (updates.notes !== undefined) question.notes = updates.notes;
            if (updates.solution !== undefined) question.solution = updates.solution;
            if (updates.timeComplexity !== undefined) question.timeComplexity = updates.timeComplexity;
            if (updates.spaceComplexity !== undefined) question.spaceComplexity = updates.spaceComplexity;
            
            question.lastModified = new Date().toISOString();
            
            try {
                this.saveToLocalStorage();
                return true;
            } catch (error) {
                console.error('Failed to save notes:', error);
                return false;
            }
        }
        return false;
    },
    
    // Reset to initial questions
    async resetQuestions() {
        // Ensure we have the latest initial questions
        await fetchInitialQuestions();
        this.questions = [...initialQuestions];
        this.saveToLocalStorage();
        return this.questions;
    },
    
    // Filter and sort questions
    getFilteredAndSortedQuestions(topicFilter, difficultyFilter, sortBy) {
        let filtered = [...this.questions];
        
        if (topicFilter !== "all") {
            filtered = filtered.filter(q => q.topic === topicFilter);
        }
        
        if (difficultyFilter !== "all") {
            filtered = filtered.filter(q => q.difficulty === difficultyFilter);
        }
        
        const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        const statusOrder = { "Completed": 1, "In Progress": 2, "Not Started": 3 };
        
        switch (sortBy) {
            case "topic":
                filtered.sort((a, b) => a.topic.localeCompare(b.topic));
                break;
            case "difficulty":
                filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
                break;
            case "status":
                filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
                break;
        }
        
        return filtered;
    },
    
    // Save to localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.questions));
            return true;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            throw error;
        }
    }
};

// Initialize the tracker
(async () => {
    await DSATracker.init();
})(); 