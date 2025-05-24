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
const notesModal = document.getElementById('notes-modal');
const notesForm = document.getElementById('notes-form');
const closeNotesBtn = document.getElementById('close-notes-modal');
const notesQuestionTitle = document.getElementById('notes-question-title');
const notesLastModified = document.getElementById('notes-last-modified');
const questionNotes = document.getElementById('question-notes');
const questionSolution = document.getElementById('question-solution');
const timeComplexity = document.getElementById('time-complexity');
const spaceComplexity = document.getElementById('space-complexity');

let currentQuestionId = null;

// Initialize the application
function init() {
    // Populate topic filter with unique topics
    const topics = DSATracker.getUniqueTopics();
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
    
    // Notes modal event listeners
    closeNotesBtn.addEventListener('click', () => {
        notesModal.classList.remove('active');
        currentQuestionId = null;
    });
    
    notesForm.addEventListener('submit', handleNotesSubmit);

    // Initial render
    updateQuestionsList();
    updateProgress();
}

// Render questions list
function updateQuestionsList() {
    const filteredQuestions = DSATracker.getFilteredAndSortedQuestions(
        topicFilter.value,
        difficultyFilter.value,
        sortBySelect.value
    );

    questionsList.innerHTML = '';
    filteredQuestions.forEach((question, index) => {
        const card = createQuestionCard(question, index);
        questionsList.appendChild(card);
    });
}

// Create a question card element
function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.setAttribute('data-status', question.status);
    card.setAttribute('data-id', question.id);
    card.style.setProperty('--i', index);

    const info = document.createElement('div');
    info.className = 'question-info';
    
    const titleContainer = document.createElement('div');
    titleContainer.className = 'question-title';
    
    const title = document.createElement('span');
    title.textContent = question.title;
    
    const notesBtn = document.createElement('button');
    notesBtn.className = 'notes-indicator';
    notesBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M14,10H19.5L14,4.5V10M5,3H15L21,9V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3M5,12V14H19V12H5M5,16V18H14V16H5Z"/>
        </svg>
        ${question.notes || question.solution ? 'View Notes' : 'Add Notes'}
    `;
    
    notesBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any parent form submission
        openNotes(question);
    });
    
    if (question.link) {
        const link = document.createElement('a');
        link.href = question.link;
        link.target = '_blank';
        link.className = 'question-link';
        link.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/></svg>';
        link.title = 'Open question';
        titleContainer.appendChild(title);
        titleContainer.appendChild(link);
        titleContainer.appendChild(notesBtn);
    } else {
        titleContainer.appendChild(title);
        titleContainer.appendChild(notesBtn);
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
    const stats = DSATracker.getStatistics();
    
    // Update overall progress
    const percentage = stats.overall.percentage;
    overallProgressBar.style.width = `${percentage}%`;
    overallProgressText.textContent = 
        `${stats.overall.completed}/${stats.overall.total} (${percentage}%)`;
    
    // Update difficulty stats
    updateHomeDifficultyStats();
    
    // Update topic stats
    updateHomeTopicStats();
}

// Update homepage difficulty statistics
function updateHomeDifficultyStats() {
    const questions = DSATracker.questions;
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    difficulties.forEach(difficulty => {
        const total = questions.filter(q => q.difficulty === difficulty).length;
        const completed = questions.filter(q => q.difficulty === difficulty && q.status === 'Completed').length;
        const percentage = total ? Math.round((completed / total) * 100) : 0;
        
        const id = difficulty.toLowerCase();
        document.getElementById(`home-${id}-count`).textContent = `${completed}/${total}`;
        document.getElementById(`home-${id}-progress`).style.width = `${percentage}%`;
        document.getElementById(`home-${id}-completion`).textContent = `${percentage}%`;
    });
}

// Update homepage topic statistics
function updateHomeTopicStats() {
    const topicStats = document.getElementById('home-topic-stats');
    const topics = DSATracker.getUniqueTopics();
    const questions = DSATracker.questions;
    
    topicStats.innerHTML = '';
    
    topics.forEach(topic => {
        const topicQuestions = questions.filter(q => q.topic === topic);
        const total = topicQuestions.length;
        const completed = topicQuestions.filter(q => q.status === 'Completed').length;
        const percentage = Math.round((completed / total) * 100);
        
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-stat';
        topicCard.setAttribute('data-topic', topic);
        
        // Add active class if this topic is currently filtered
        if (topicFilter.value === topic) {
            topicCard.classList.add('active');
        }
        
        topicCard.innerHTML = `
            <div class="topic-name">${topic}</div>
            <div class="topic-progress">
                <span class="topic-count">${completed}/${total}</span>
                <span class="topic-percentage">${percentage}%</span>
            </div>
        `;
        
        // Add click handler for filtering
        topicCard.addEventListener('click', () => {
            const isCurrentlyActive = topicCard.classList.contains('active');
            
            // Remove active state from all topic cards
            document.querySelectorAll('.topic-stat').forEach(c => c.classList.remove('active'));
            
            if (!isCurrentlyActive) {
                // Apply new filter
                topicFilter.value = topic;
                topicCard.classList.add('active');
                showToast(`Filtered by ${topic}`);
            } else {
                // Remove filter
                topicFilter.value = 'all';
                showToast('Topic filter removed');
            }
            
            // Update the questions list
            updateQuestionsList();
            
            // Smooth scroll to questions list
            document.querySelector('.questions-list').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        });
        
        topicStats.appendChild(topicCard);
    });
}

// Toast notification system
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = document.createElement('div');
    icon.className = 'icon';
    
    // Add appropriate icon based on type
    if (type === 'success') {
        icon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    } else {
        icon.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8v8m0-12a10 10 0 100 20 10 10 0 000-20z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16h.01" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(messageDiv);
    container.appendChild(toast);
    
    // Trigger reflow to ensure animation works
    toast.offsetHeight;
    
    // Show the toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 3000);
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
    
    try {
        const addedQuestion = DSATracker.addQuestion(newQuestion);
        addQuestionModal.classList.remove('active');
        e.target.reset();
        
        updateQuestionsList();
        updateProgress();
        showToast('Question added successfully');

        // Find and highlight the new question
        setTimeout(() => {
            const newCard = document.querySelector(`[data-id="${addedQuestion.id}"]`);
            if (newCard) {
                newCard.classList.add('new');
                setTimeout(() => newCard.classList.remove('new'), 2000);
                newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    } catch (error) {
        showToast('Failed to add question', 'error');
        console.error('Error adding question:', error);
    }
}

// Handle reset
function handleReset() {
    if (confirm('Are you sure you want to reset all questions to their initial state? This action cannot be undone.')) {
        try {
            DSATracker.resetQuestions();
            updateQuestionsList();
            updateProgress();
            showToast('Questions reset successfully');
        } catch (error) {
            showToast('Failed to reset questions', 'error');
            console.error('Error resetting questions:', error);
        }
    }
}

// Handle opening notes
function openNotes(question) {
    currentQuestionId = question.id;
    notesQuestionTitle.textContent = question.title;
    
    // Set form values
    questionNotes.value = question.notes || '';
    questionSolution.value = question.solution || '';
    timeComplexity.value = question.timeComplexity || '';
    spaceComplexity.value = question.spaceComplexity || '';
    
    if (question.lastModified) {
        const date = new Date(question.lastModified);
        notesLastModified.textContent = `Last modified: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } else {
        notesLastModified.textContent = 'No modifications yet';
    }
    
    notesModal.classList.add('active');
}

// Handle notes submission
function handleNotesSubmit(e) {
    e.preventDefault();
    
    if (!currentQuestionId) {
        console.error('No question selected for notes update');
        showToast('No question selected', 'error');
        return;
    }
    
    const updates = {
        notes: questionNotes.value.trim(),
        solution: questionSolution.value.trim(),
        timeComplexity: timeComplexity.value.trim(),
        spaceComplexity: spaceComplexity.value.trim()
    };
    
    console.log('Updating notes for question:', currentQuestionId);
    console.log('Updates:', updates);
    
    try {
        if (DSATracker.updateQuestionNotes(currentQuestionId, updates)) {
            console.log('Notes updated successfully');
            notesModal.classList.remove('active');
            currentQuestionId = null;
            updateQuestionsList();
            showToast('Notes saved successfully');
        } else {
            throw new Error('Failed to update notes');
        }
    } catch (error) {
        console.error('Failed to update notes:', error);
        showToast('Failed to save notes', 'error');
    }
}

// Update question status with visual feedback
function updateQuestionStatus(id, newStatus) {
    try {
        if (DSATracker.updateQuestionStatus(id, newStatus)) {
            updateProgress();
            showToast(`Status updated to "${newStatus}"`);
        } else {
            throw new Error('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('Failed to update status', 'error');
    }
}

// Add difficulty filter click handlers
document.addEventListener('DOMContentLoaded', () => {
    const difficultyStats = document.querySelectorAll('.difficulty-stat[data-difficulty]');
    
    difficultyStats.forEach(stat => {
        const difficulty = stat.getAttribute('data-difficulty');
        
        // Add active class if this difficulty is currently filtered
        if (difficultyFilter.value === difficulty) {
            stat.classList.add('active');
        }
        
        stat.addEventListener('click', () => {
            const isCurrentlyActive = stat.classList.contains('active');
            
            // Remove active state from all difficulty stats
            document.querySelectorAll('.difficulty-stat').forEach(s => s.classList.remove('active'));
            
            if (!isCurrentlyActive) {
                // Apply new filter
                difficultyFilter.value = difficulty;
                stat.classList.add('active');
                showToast(`Filtered by ${difficulty} difficulty`);
            } else {
                // Remove filter
                difficultyFilter.value = 'all';
                showToast('Difficulty filter removed');
            }
            
            // Update the questions list
            updateQuestionsList();
            
            // Smooth scroll to questions list
            document.querySelector('.questions-list').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
        });
    });
});

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 