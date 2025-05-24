// DOM Elements
const questionsList = document.getElementById('questions-list');
const topicFilter = document.getElementById('topic-filter');
const difficultyFilter = document.getElementById('difficulty-filter');
const sortBySelect = document.getElementById('sort-by');
const addQuestionBtn = document.getElementById('add-question-btn');
const addQuestionModal = document.getElementById('add-question-modal');
const addQuestionForm = document.getElementById('add-question-form');
const closeModalBtn = document.getElementById('close-modal');
const topicProgress = document.getElementById('topic-progress');
const overallProgressBar = document.getElementById('overall-progress-bar');
const overallProgressText = document.getElementById('overall-progress-text');
const resetBtn = document.getElementById('reset-btn');

// Initialize the application
function init() {
    // Populate topic filter with unique topics
    const topics = getUniqueTopics();
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        topicFilter.appendChild(option);
    });

    // Add event listeners
    topicFilter.addEventListener('change', updateQuestionsList);
    difficultyFilter.addEventListener('change', updateQuestionsList);
    sortBySelect.addEventListener('change', updateQuestionsList);
    addQuestionBtn.addEventListener('click', () => addQuestionModal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => addQuestionModal.classList.remove('active'));
    addQuestionForm.addEventListener('submit', handleAddQuestion);
    resetBtn.addEventListener('click', handleReset);

    // Initial render
    updateQuestionsList();
    updateProgress();
}

// Render questions list
function updateQuestionsList() {
    const filteredQuestions = getFilteredAndSortedQuestions(
        topicFilter.value,
        difficultyFilter.value,
        sortBySelect.value
    );

    questionsList.innerHTML = '';
    filteredQuestions.forEach(question => {
        const card = createQuestionCard(question);
        questionsList.appendChild(card);
    });
}

// Create a question card element
function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.setAttribute('data-status', question.status);
    
    const info = document.createElement('div');
    info.className = 'question-info';
    
    const titleContainer = document.createElement('div');
    titleContainer.className = 'question-title';
    
    const title = document.createElement('span');
    title.textContent = question.title;
    
    if (question.link) {
        const link = document.createElement('a');
        link.href = question.link;
        link.target = '_blank';
        link.className = 'question-link';
        link.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/></svg>';
        link.title = 'Open question';
        titleContainer.appendChild(title);
        titleContainer.appendChild(link);
    } else {
        titleContainer.appendChild(title);
    }
    
    const meta = document.createElement('div');
    meta.className = 'question-meta';
    
    const topic = document.createElement('span');
    topic.textContent = question.topic;
    
    const difficulty = document.createElement('span');
    difficulty.className = `difficulty ${question.difficulty}`;
    difficulty.textContent = question.difficulty;
    
    meta.appendChild(topic);
    meta.appendChild(difficulty);
    
    info.appendChild(titleContainer);
    info.appendChild(meta);
    
    const statusSelect = document.createElement('select');
    statusSelect.className = 'status-select';
    ['Not Started', 'In Progress', 'Completed'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        option.selected = status === question.status;
        statusSelect.appendChild(option);
    });
    
    statusSelect.addEventListener('change', (e) => {
        const newStatus = e.target.value;
        updateQuestionStatus(question.id, newStatus);
        card.setAttribute('data-status', newStatus);
        updateProgress();
    });
    
    card.appendChild(info);
    card.appendChild(statusSelect);
    
    return card;
}

// Update progress displays
function updateProgress() {
    const stats = getStatistics();
    
    // Update overall progress
    const percentage = stats.overall.percentage;
    overallProgressBar.style.width = `${percentage}%`;
    overallProgressText.textContent = 
        `${stats.overall.completed}/${stats.overall.total} (${percentage}%)`;
    
    // Update topic progress
    topicProgress.innerHTML = '';
    stats.byTopic.forEach(topicStat => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        
        const title = document.createElement('h4');
        title.textContent = topicStat.topic;
        
        const progress = document.createElement('p');
        const percentage = Math.round((topicStat.completed / topicStat.total) * 100);
        progress.textContent = `${topicStat.completed}/${topicStat.total} (${percentage}%)`;
        
        card.appendChild(title);
        card.appendChild(progress);
        topicProgress.appendChild(card);
    });
}

// Handle adding a new question
function handleAddQuestion(e) {
    e.preventDefault();
    
    const newQuestion = {
        title: document.getElementById('question-title').value,
        topic: document.getElementById('question-topic').value,
        difficulty: document.getElementById('question-difficulty').value,
        link: document.getElementById('question-link').value.trim()
    };
    
    addQuestion(newQuestion);
    addQuestionModal.classList.remove('active');
    e.target.reset();
    
    updateQuestionsList();
    updateProgress();
}

// Handle reset
function handleReset() {
    if (confirm('Are you sure you want to reset all questions to their initial state? This action cannot be undone.')) {
        resetQuestions();
        updateQuestionsList();
        updateProgress();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 