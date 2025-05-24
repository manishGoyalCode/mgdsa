// Analytics functionality
class DSAAnalytics {
    constructor() {
        this.charts = {};
        this.setupEventListeners();
        this.initializeCharts();
    }

    setupEventListeners() {
        const analyticsBtn = document.getElementById('analytics-btn');
        const closeAnalyticsBtn = document.getElementById('close-analytics-modal');
        const analyticsModal = document.getElementById('analytics-modal');

        analyticsBtn.addEventListener('click', () => {
            analyticsModal.classList.add('active');
            this.updateAnalytics();
        });

        closeAnalyticsBtn.addEventListener('click', () => {
            analyticsModal.classList.remove('active');
        });
    }

    initializeCharts() {
        // Initialize Difficulty Distribution Chart
        this.charts.difficulty = new Chart(
            document.getElementById('difficulty-chart').getContext('2d'),
            {
                type: 'doughnut',
                data: {
                    labels: ['Easy', 'Medium', 'Hard'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(5, 150, 105, 0.8)',
                            'rgba(217, 119, 6, 0.8)',
                            'rgba(220, 38, 38, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            }
        );

        // Initialize Topic Progress Chart
        this.charts.topic = new Chart(
            document.getElementById('topic-chart').getContext('2d'),
            {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Completed',
                        data: [],
                        backgroundColor: 'rgba(79, 70, 229, 0.8)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            }
        );

        // Initialize Pace Chart
        this.charts.pace = new Chart(
            document.getElementById('pace-chart').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Questions Solved',
                        data: [],
                        borderColor: 'rgba(79, 70, 229, 1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            }
        );

        // Initialize Difficulty Trends Chart
        this.charts.difficultyTrends = new Chart(
            document.getElementById('difficulty-trends-chart').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        {
                            label: 'Easy',
                            borderColor: 'rgba(5, 150, 105, 1)',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            data: [],
                            fill: true
                        },
                        {
                            label: 'Medium',
                            borderColor: 'rgba(217, 119, 6, 1)',
                            backgroundColor: 'rgba(217, 119, 6, 0.1)',
                            data: [],
                            fill: true
                        },
                        {
                            label: 'Hard',
                            borderColor: 'rgba(220, 38, 38, 1)',
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            data: [],
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            }
        );
    }

    updateAnalytics() {
        const stats = this.calculateStats();
        const difficultyStats = this.calculateDifficultyStats();
        
        this.updateSummaryStats(stats);
        this.updateDifficultyChart(stats);
        this.updateDifficultyStats(difficultyStats);
        this.updateTopicChart(stats);
        this.updateTimeline(stats);
        this.updateStreak(stats);
        this.updatePaceChart(stats);
        
        // Update difficulty trends
        this.updateDifficultyTrends();
    }

    calculateStats() {
        const questions = DSATracker.questions;
        const stats = {
            total: questions.length,
            completed: questions.filter(q => q.status === 'Completed').length,
            inProgress: questions.filter(q => q.status === 'In Progress').length,
            difficulty: {
                Easy: questions.filter(q => q.difficulty === 'Easy' && q.status === 'Completed').length,
                Medium: questions.filter(q => q.difficulty === 'Medium' && q.status === 'Completed').length,
                Hard: questions.filter(q => q.difficulty === 'Hard' && q.status === 'Completed').length
            },
            topics: {},
            recentActivity: [],
            streak: this.calculateStreak(),
            pace: this.calculatePace()
        };

        // Calculate topic-wise progress
        DSATracker.getUniqueTopics().forEach(topic => {
            const topicQuestions = questions.filter(q => q.topic === topic);
            stats.topics[topic] = {
                total: topicQuestions.length,
                completed: topicQuestions.filter(q => q.status === 'Completed').length
            };
        });

        // Get recent activity
        stats.recentActivity = questions
            .filter(q => q.lastModified)
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
            .slice(0, 5);

        return stats;
    }

    calculateDifficultyStats() {
        const questions = DSATracker.questions;
        const stats = {
            Easy: {
                total: questions.filter(q => q.difficulty === 'Easy').length,
                completed: questions.filter(q => q.difficulty === 'Easy' && q.status === 'Completed').length,
                inProgress: questions.filter(q => q.difficulty === 'Easy' && q.status === 'In Progress').length
            },
            Medium: {
                total: questions.filter(q => q.difficulty === 'Medium').length,
                completed: questions.filter(q => q.difficulty === 'Medium' && q.status === 'Completed').length,
                inProgress: questions.filter(q => q.difficulty === 'Medium' && q.status === 'In Progress').length
            },
            Hard: {
                total: questions.filter(q => q.difficulty === 'Hard').length,
                completed: questions.filter(q => q.difficulty === 'Hard' && q.status === 'Completed').length,
                inProgress: questions.filter(q => q.difficulty === 'Hard' && q.status === 'In Progress').length
            }
        };

        // Calculate completion percentages
        ['Easy', 'Medium', 'Hard'].forEach(difficulty => {
            stats[difficulty].percentage = stats[difficulty].total ? 
                Math.round((stats[difficulty].completed / stats[difficulty].total) * 100) : 0;
        });

        return stats;
    }

    updateSummaryStats(stats) {
        document.getElementById('completion-rate').textContent = 
            `${Math.round((stats.completed / stats.total) * 100)}%`;
        document.getElementById('questions-solved').textContent = 
            `${stats.completed}/${stats.total}`;
        document.getElementById('in-progress-count').textContent = 
            stats.inProgress.toString();
    }

    updateDifficultyChart(stats) {
        this.charts.difficulty.data.datasets[0].data = [
            stats.difficulty.Easy,
            stats.difficulty.Medium,
            stats.difficulty.Hard
        ];
        this.charts.difficulty.update();
    }

    updateTopicChart(stats) {
        const topics = Object.keys(stats.topics);
        const completed = topics.map(topic => stats.topics[topic].completed);

        this.charts.topic.data.labels = topics;
        this.charts.topic.data.datasets[0].data = completed;
        this.charts.topic.update();
    }

    updateTimeline(stats) {
        const timeline = document.getElementById('activity-timeline');
        timeline.innerHTML = '';

        stats.recentActivity.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            const content = document.createElement('div');
            content.className = 'timeline-content';
            
            const title = document.createElement('div');
            title.className = 'timeline-title';
            title.textContent = activity.title;
            
            const date = document.createElement('div');
            date.className = 'timeline-date';
            date.textContent = new Date(activity.lastModified).toLocaleDateString();
            
            content.appendChild(title);
            content.appendChild(date);
            item.appendChild(content);
            timeline.appendChild(item);
        });
    }

    calculateStreak() {
        // This is a simplified streak calculation
        // You might want to implement a more sophisticated version
        return Math.floor(Math.random() * 10); // Placeholder
    }

    updateStreak(stats) {
        document.getElementById('streak-count').textContent = stats.streak;
        
        // Update calendar
        const calendar = document.getElementById('streak-calendar');
        calendar.innerHTML = '';
        
        // Show last 28 days (4 weeks)
        for (let i = 0; i < 28; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            if (Math.random() > 0.5) day.classList.add('active');
            calendar.appendChild(day);
        }
    }

    calculatePace() {
        // Calculate questions solved per week for the last 8 weeks
        const weeks = Array.from({ length: 8 }, (_, i) => `Week ${i + 1}`);
        const data = Array.from({ length: 8 }, () => 
            Math.floor(Math.random() * 5)); // Placeholder data
        
        return { weeks, data };
    }

    updatePaceChart(stats) {
        this.charts.pace.data.labels = stats.pace.weeks;
        this.charts.pace.data.datasets[0].data = stats.pace.data;
        this.charts.pace.update();
    }

    updateDifficultyStats(stats) {
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const difficultyIds = ['easy', 'medium', 'hard'];

        difficulties.forEach((difficulty, index) => {
            const id = difficultyIds[index];
            const diffStats = stats[difficulty];

            // Update count
            document.getElementById(`${id}-count`).textContent = 
                `${diffStats.completed}/${diffStats.total}`;

            // Update progress bar
            const progressBar = document.getElementById(`${id}-progress`);
            progressBar.style.width = `${diffStats.percentage}%`;

            // Update completion percentage
            document.getElementById(`${id}-completion`).textContent = 
                `${diffStats.percentage}%`;

            // Update average time (placeholder for now)
            document.getElementById(`${id}-time`).textContent = 
                `Avg: ${Math.round(Math.random() * 30 + 10)} min`;
        });

        // Update insights
        this.updateDifficultyInsights(stats);
    }

    updateDifficultyInsights(stats) {
        const difficulties = ['Easy', 'Medium', 'Hard'];
        
        // Find strongest and weakest areas
        const sortedByCompletion = difficulties
            .map(diff => ({
                difficulty: diff,
                percentage: stats[diff].percentage
            }))
            .sort((a, b) => b.percentage - a.percentage);

        const strongest = sortedByCompletion[0];
        const weakest = sortedByCompletion[sortedByCompletion.length - 1];

        // Update insight cards
        document.getElementById('strongest-difficulty').querySelector('p').textContent = 
            `${strongest.difficulty} questions (${strongest.percentage}% completion rate)`;
        
        document.getElementById('needs-improvement').querySelector('p').textContent = 
            `${weakest.difficulty} questions (${weakest.percentage}% completion rate)`;
    }

    updateDifficultyTrends() {
        // Simulate weekly data for now
        const weeks = 4;
        const data = {
            Easy: Array.from({ length: weeks }, () => Math.floor(Math.random() * 5)),
            Medium: Array.from({ length: weeks }, () => Math.floor(Math.random() * 4)),
            Hard: Array.from({ length: weeks }, () => Math.floor(Math.random() * 3))
        };

        this.charts.difficultyTrends.data.datasets[0].data = data.Easy;
        this.charts.difficultyTrends.data.datasets[1].data = data.Medium;
        this.charts.difficultyTrends.data.datasets[2].data = data.Hard;
        this.charts.difficultyTrends.update();
    }
}

// Initialize analytics when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const analytics = new DSAAnalytics();
}); 