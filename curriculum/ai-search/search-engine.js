// Enhanced AI-Powered Curriculum Search Engine with Science
class CurriculumSearch {
    constructor() {
        this.curriculumData = {};
        this.searchIndex = new Map();
        this.init();
    }

    async init() {
        await this.loadCurriculum();
        this.buildSearchIndex();
        console.log('🔍 Comprehensive AI Search Engine Ready - All Subjects Loaded');
    }

    async loadCurriculum() {
        this.curriculumData = {
            // ... existing mathematics, machine-learning, robotics data ...

            science: {
                general: {
                    title: 'General Science',
                    topics: [
                        {
                            id: 'sci-scientific-method',
                            title: 'Scientific Method',
                            content: 'Systematic approach to scientific inquiry: Observation, Question, Hypothesis, Experiment, Conclusion...',
                            keywords: ['scientific method', 'observation', 'hypothesis', 'experiment', 'conclusion', 'science process'],
                            difficulty: 'beginner',
                            examples: [
                                'Observing plant growth under different light conditions',
                                'Testing which paper towel brand absorbs most water'
                            ]
                        },
                        {
                            id: 'sci-ecosystems',
                            title: 'Ecosystems & Food Chains',
                            content: 'Understanding how living organisms interact in environments and energy transfer through food chains...',
                            keywords: ['ecosystems', 'food chains', 'producers', 'consumers', 'decomposers', 'energy transfer'],
                            difficulty: 'beginner',
                            examples: [
                                'Grass → Grasshopper → Frog → Snake → Hawk food chain',
                                'Ocean ecosystem with plankton, small fish, large fish, sharks'
                            ]
                        }
                    ]
                },
                biology: {
                    grade4: {
                        title: 'Biology - Study of Life',
                        topics: [
                            {
                                id: 'bio-cells',
                                title: 'Cell Structure & Function',
                                content: 'Basic unit of life - understanding plant and animal cell components and their functions...',
                                keywords: ['cells', 'biology', 'nucleus', 'mitochondria', 'chloroplasts', 'cell membrane'],
                                difficulty: 'intermediate',
                                examples: [
                                    'Animal cells have nucleus and mitochondria for energy',
                                    'Plant cells have chloroplasts for photosynthesis and cell walls for support'
                                ]
                            },
                            {
                                id: 'bio-photosynthesis',
                                title: 'Photosynthesis',
                                content: 'Process where plants convert light energy into chemical energy to produce food...',
                                keywords: ['photosynthesis', 'plants', 'chlorophyll', 'oxygen', 'carbon dioxide', 'sunlight'],
                                difficulty: 'intermediate',
                                examples: [
                                    '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (photosynthesis equation)',
                                    'Leaves contain chlorophyll to capture sunlight energy'
                                ]
                            }
                        ]
                    }
                },
                chemistry: {
                    grade4: {
                        title: 'Chemistry - Matter & Changes',
                        topics: [
                            {
                                id: 'chem-matter',
                                title: 'States of Matter',
                                content: 'Understanding solids, liquids, gases and their properties and phase changes...',
                                keywords: ['matter', 'solid', 'liquid', 'gas', 'states of matter', 'phase changes'],
                                difficulty: 'beginner',
                                examples: [
                                    'Ice (solid) → Water (liquid) → Steam (gas) with heating',
                                    'Different materials have different properties like density and solubility'
                                ]
                            },
                            {
                                id: 'chem-reactions',
                                title: 'Chemical Reactions',
                                content: 'Process where substances transform into new substances with different properties...',
                                keywords: ['chemical reactions', 'acids', 'bases', 'pH', 'conservation of matter'],
                                difficulty: 'intermediate',
                                examples: [
                                    'Baking soda and vinegar reaction produces carbon dioxide gas',
                                    'Iron rusting when exposed to oxygen and water'
                                ]
                            }
                        ]
                    }
                },
                physics: {
                    grade4: {
                        title: 'Physics - Energy & Motion',
                        topics: [
                            {
                                id: 'physics-forces',
                                title: 'Forces & Motion',
                                content: 'Understanding Newton laws of motion and different types of forces...',
                                keywords: ['forces', 'motion', 'Newton laws', 'gravity', 'friction', 'simple machines'],
                                difficulty: 'intermediate',
                                examples: [
                                    'First Law: Objects at rest stay at rest unless acted upon',
                                    'Using levers and pulleys to make work easier'
                                ]
                            },
                            {
                                id: 'physics-energy',
                                title: 'Forms of Energy',
                                content: 'Different types of energy and energy transformations in daily life...',
                                keywords: ['energy', 'kinetic', 'potential', 'thermal', 'conservation of energy'],
                                difficulty: 'intermediate',
                                examples: [
                                    'Roller coaster: Potential energy at top, kinetic energy going down',
                                    'Food contains chemical energy that our bodies convert to movement energy'
                                ]
                            }
                        ]
                    }
                }
            }
            // ... rest of existing curriculum data ...
        };
    }

    // ... existing search methods remain the same ...
    buildSearchIndex() {
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

        return related.slice(0, 5);
    }

    getAllSubjects() {
        return Object.keys(this.curriculumData);
    }

    getTopicsBySubject(subject) {
        const topics = [];
        for (const grade in this.curriculumData[subject]) {
            topics.push(...this.curriculumData[subject][grade].topics);
        }
        return topics;
    }
}
