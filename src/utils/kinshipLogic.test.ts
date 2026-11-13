import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuizResult, filterByCategory, searchQAItems, KINSHIP_QUESTIONS, QAItem } from './kinshipLogic';

test('calculateQuizResult computes perfect score and 100% flag for 10 questions', () => {
    const perfectAnswers: Record<number, number> = {};
    KINSHIP_QUESTIONS.forEach((q, idx) => {
        perfectAnswers[idx] = q.correct;
    });

    const result = calculateQuizResult(KINSHIP_QUESTIONS, perfectAnswers);
    assert.equal(result.score, 10);
    assert.equal(result.total, 10);
    assert.equal(result.percentage, 100);
    assert.equal(result.isPerfect, true);
    assert.equal(result.incorrectQuestions.length, 0);
});

test('calculateQuizResult tracks incorrect questions for Learning Feedback', () => {
    const answersWithMistakes: Record<number, number> = {};
    KINSHIP_QUESTIONS.forEach((q, idx) => {
        answersWithMistakes[idx] = q.correct;
    });
    // introduce mistakes at index 1 and 3
    answersWithMistakes[1] = (KINSHIP_QUESTIONS[1].correct + 1) % 3;
    answersWithMistakes[3] = (KINSHIP_QUESTIONS[3].correct + 1) % 3;

    const result = calculateQuizResult(KINSHIP_QUESTIONS, answersWithMistakes);
    assert.equal(result.score, 8);
    assert.equal(result.total, 10);
    assert.equal(result.percentage, 80);
    assert.equal(result.isPerfect, false);
    assert.equal(result.incorrectQuestions.length, 2);
});

test('filterByCategory correctly filters items or returns all', () => {
    const items = [
        { id: '1', title: 'Verse', category: 'Quran' },
        { id: '2', title: 'Hadith 1', category: 'Hadith' },
        { id: '3', title: 'Hadith 2', category: 'Hadith' }
    ];

    assert.equal(filterByCategory(items, 'All').length, 3);
    assert.equal(filterByCategory(items, 'Quran').length, 1);
    assert.equal(filterByCategory(items, 'Hadith').length, 2);
});

test('searchQAItems matches queries across English question, Arabic text, and evidence', () => {
    const mockQA: QAItem[] = [
        {
            id: 'qa1',
            question: 'What is the ruling on Silat ar-Rahim?',
            questionAr: 'ما حكم صلة الرحم في الإسلام؟',
            answer: 'It is an obligatory duty (Wajib).',
            category: 'Jurisprudence',
            evidence: 'Sahih Bukhari'
        }
    ];

    const resultsEn = searchQAItems(mockQA, 'ruling');
    assert.equal(resultsEn.length, 1);

    const resultsAr = searchQAItems(mockQA, 'صلة');
    assert.equal(resultsAr.length, 1);

    const resultsNone = searchQAItems(mockQA, 'nonexistent');
    assert.equal(resultsNone.length, 0);
});
