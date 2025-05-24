// Initial questions data
const initialQuestions = [
    {
        id: 1,
        title: "Two Sum",
        topic: "Arrays",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/two-sum/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 2,
        title: "Binary Tree Level Order Traversal",
        topic: "Trees",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 3,
        title: "Shortest Path in Graph",
        topic: "Graphs",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 4,
        title: "Longest Common Subsequence",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/longest-common-subsequence/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 5,
        title: "Valid Parentheses",
        topic: "Strings",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/valid-parentheses/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 6,
        title: "Merge K Sorted Lists",
        topic: "Linked Lists",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/merge-k-sorted-lists/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 7,
        title: "Maximum Subarray",
        topic: "Arrays",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/maximum-subarray/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 8,
        title: "Binary Tree Maximum Path Sum",
        topic: "Trees",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 9,
        title: "Course Schedule",
        topic: "Graphs",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/course-schedule/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 10,
        title: "Coin Change",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/coin-change/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 11,
        title: "Reverse Linked List",
        topic: "Linked Lists",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/reverse-linked-list/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 12,
        title: "Word Break",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/word-break/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 13,
        title: "Longest Palindromic Substring",
        topic: "Strings",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/longest-palindromic-substring/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 14,
        title: "Merge Intervals",
        topic: "Arrays",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/merge-intervals/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    },
    {
        id: 15,
        title: "Serialize and Deserialize Binary Tree",
        topic: "Trees",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        notes: "",
        solution: "",
        timeComplexity: "",
        spaceComplexity: "",
        lastModified: null
    }
];

// Create a namespace for our DSA tracker
window.DSATracker = {
    questions: [],
    STORAGE_KEY: 'dsa_questions',
    
    // Initialize questions from storage or default data
    init() {
        const storedQuestions = localStorage.getItem(this.STORAGE_KEY);
        this.questions = storedQuestions ? JSON.parse(storedQuestions) : initialQuestions;
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
    resetQuestions() {
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
DSATracker.init(); 