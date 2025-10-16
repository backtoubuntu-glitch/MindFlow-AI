// AI-Powered Curriculum Search Engine
class CurriculumSearch {
    constructor() {
        this.curriculumData = {};
        this.searchIndex = new Map();
        this.init();
    }

    async init() {
        await this.loadCurriculum();
        this.buildSearchIndex();
        console.log('🔍 AI Search Engine Ready');
    }

    async loadCurriculum() {
        // Curriculum database - in real app, this would be from API
        this.curriculumData = {
            mathematics: {
                grade4: {
                    title: 'Grade 4 Mathematics',
                    topics: [
                        {
                            id: 'math-place-value',
                            title: 'Place Value to Millions',
                            content: 'Understanding place value up to 7-digit numbers...',
                            keywords: ['place value', 'millions', 'expanded form', 'rounding'],
                            difficulty: 'beginner',
                            examples: [
                                'Write 4,567,891 in expanded form: 4,000,000 + 500,000 + 60,000 + 7,000 + 800 + 90 + 1',
                                'Round 7,654 to nearest hundred: 7,700'
                            ]
                        },
                        {
                            id: 'math-multiplication',
                            title: 'Multiplication Mastery',
                            content: 'Times tables 1-12 with automatic recall...',
                            keywords: ['multiplication', 'times tables', 'product', 'factors'],
                            difficulty: 'intermediate',
                            examples: [
                                '7 × 8 = 56',
                                '12 × 11 = 132'
                            ]
                        },
                        {
                            id: 'math-fractions',
                            title: 'Fraction Fundamentals',
                            content: 'Understanding numerators and denominators...',
                            keywords: ['fractions', 'numerator', 'denominator', 'equivalent'],
                            difficulty: 'intermediate',
                            examples: [
                                '1/2 = 2/4 = 3/6',
                                'Compare 3/4 and 2/3: 3/4 > 2/3'
                            ]
                        }
                    ]
                }
            },
            science: {
                grade4: {
                    title: 'Grade 4 Science',
                    topics: [
                        {
                            id: 'science-ecosystems',
                            title: 'Ecosystems and Food Chains',
                            content: 'Understanding how living things depend on each other...',
                            keywords: ['ecosystem', 'food chain', 'producer', 'consumer', 'decomposer'],
                            difficulty: 'beginner',
                            examples: [
                                'Grass → Grasshopper → Frog → Snake → Hawk',
                                'Plants are producers, animals are consumers'
                            ]
                        }
                    ]
                }
            }
        };
    }

    buildSearchIndex() {
        // Build comprehensive search index
        for (const subject in this.curriculumData) {
            for (const grade in this.curriculumData[subject]) {
                this.curriculumData[subject][grade].topics.forEach(topic => {
                    topic.keywords.forEach(keyword => {
                        if (!this.searchIndex.has(keyword)) {
                            this.searchIndex.set(keyword, []);
                        }
                        this.searchIndex.get(keyword).push(topic);
                    });
                });
            }
        }
    }

    search(query) {
        const results = [];
        const queryTerms = query.toLowerCase().split(' ');
        
        queryTerms.forEach(term => {
            this.searchIndex.forEach((topics, keyword) => {
                if (keyword.includes(term) || term.includes(keyword)) {
                    results.push(...topics);
                }
            });
        });

        // Remove duplicates and rank by relevance
        const uniqueResults = this.removeDuplicates(results);
        return this.rankResults(uniqueResults, query);
    }

    removeDuplicates(results) {
        const seen = new Set();
        return results.filter(topic => {
            const identifier = topic.id;
            if (seen.has(identifier)) {
                return false;
            }
            seen.add(identifier);
            return true;
        });
    }

    rankResults(results, query) {
        return results.sort((a, b) => {
            const aScore = this.calculateRelevance(a, query);
            const bScore = this.calculateRelevance(b, query);
            return bScore - aScore;
        });
    }

    calculateRelevance(topic, query) {
        let score = 0;
        const queryTerms = query.toLowerCase().split(' ');
        
        queryTerms.forEach(term => {
            if (topic.title.toLowerCase().includes(term)) score += 10;
            if (topic.content.toLowerCase().includes(term)) score += 5;
            if (topic.keywords.some(kw => kw.includes(term))) score += 8;
        });

        return score;
    }

    getTopicById(topicId) {
        for (const subject in this.curriculumData) {
            for (const grade in this.curriculumData[subject]) {
                const topic = this.curriculumData[subject][grade].topics.find(t => t.id === topicId);
                if (topic) return topic;
            }
        }
        return null;
    }

    getRelatedTopics(topicId) {
        const currentTopic = this.getTopicById(topicId);
        if (!currentTopic) return [];

        const related = [];
        currentTopic.keywords.forEach(keyword => {
            const matches = this.searchIndex.get(keyword) || [];
            matches.forEach(topic => {
                if (topic.id !== topicId && !related.includes(topic)) {
                    related.push(topic);
                }
            });
        });

        return related.slice(0, 5); // Return top 5 related topics
    }
}

// Global search instance
window.curriculumSearch = new CurriculumSearch();
