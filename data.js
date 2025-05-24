// Initial questions data
const initialQuestions = [
    {
        id: 1,
        title: "Two Sum",
        topic: "Arrays",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/two-sum/"
    },
    {
        id: 2,
        title: "Binary Tree Level Order Traversal",
        topic: "Trees",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
    },
    {
        id: 3,
        title: "Shortest Path in Graph",
        topic: "Graphs",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/shortest-path-in-binary-matrix/"
    },
    {
        id: 4,
        title: "Longest Common Subsequence",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/longest-common-subsequence/"
    },
    {
        id: 5,
        title: "Valid Parentheses",
        topic: "Strings",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/valid-parentheses/"
    },
    {
        id: 6,
        title: "Merge K Sorted Lists",
        topic: "Linked Lists",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/merge-k-sorted-lists/"
    },
    {
        id: 7,
        title: "Maximum Subarray",
        topic: "Arrays",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/maximum-subarray/"
    },
    {
        id: 8,
        title: "Binary Tree Maximum Path Sum",
        topic: "Trees",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
    },
    {
        id: 9,
        title: "Course Schedule",
        topic: "Graphs",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/course-schedule/"
    },
    {
        id: 10,
        title: "Coin Change",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/coin-change/"
    },
    {
        id: 11,
        title: "Reverse Linked List",
        topic: "Linked Lists",
        difficulty: "Easy",
        status: "Not Started",
        link: "https://leetcode.com/problems/reverse-linked-list/"
    },
    {
        id: 12,
        title: "Word Break",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/word-break/"
    },
    {
        id: 13,
        title: "Longest Palindromic Substring",
        topic: "Strings",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/longest-palindromic-substring/"
    },
    {
        id: 14,
        title: "Merge Intervals",
        topic: "Arrays",
        difficulty: "Medium",
        status: "Not Started",
        link: "https://leetcode.com/problems/merge-intervals/"
    },
    {
        id: 15,
        title: "Serialize and Deserialize Binary Tree",
        topic: "Trees",
        difficulty: "Hard",
        status: "Not Started",
        link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
    }
];

// Local storage key
const STORAGE_KEY = 'dsa_questions';

// Initialize questions from local storage or use initial data
let questions = (() => {
    const storedQuestions = localStorage.getItem(STORAGE_KEY);
    return storedQuestions ? JSON.parse(storedQuestions) : initialQuestions;
})();

// Save questions to local storage
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

// Get unique topics from questions
function getUniqueTopics() {
    return [...new Set(questions.map(q => q.topic))];
}

// Get questions statistics
function getStatistics() {
    const total = questions.length;
    const completed = questions.filter(q => q.status === "Completed").length;
    const inProgress = questions.filter(q => q.status === "In Progress").length;
    
    const topicStats = getUniqueTopics().map(topic => {
        const topicQuestions = questions.filter(q => q.topic === topic);
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
}

// Add a new question
function addQuestion(question) {
    const newId = Math.max(...questions.map(q => q.id)) + 1;
    const newQuestion = {
        id: newId,
        ...question,
        status: "Not Started",
        link: question.link || "" // Handle the case where link might not be provided
    };
    questions.push(newQuestion);
    saveToLocalStorage();
    return newQuestion;
}

// Update question status
function updateQuestionStatus(id, newStatus) {
    const question = questions.find(q => q.id === id);
    if (question) {
        question.status = newStatus;
        saveToLocalStorage();
        return true;
    }
    return false;
}

// Reset to initial questions
function resetQuestions() {
    questions = [...initialQuestions];
    saveToLocalStorage();
    return questions;
}

// Filter and sort questions
function getFilteredAndSortedQuestions(topicFilter, difficultyFilter, sortBy) {
    let filtered = [...questions];
    
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
} 