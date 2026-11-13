export interface QuizQuestion {
    id: number;
    q: string;
    options: string[];
    correct: number;
    explanation: string;
}

export interface TeachingItem {
    id: string;
    title: string;
    category: 'Quran' | 'Hadith';
    content: string;
    source: string;
    contentAr: string;
    sourceAr: string;
}

export interface QAItem {
    id: string;
    question: string;
    questionAr: string;
    answer: string;
    category: string;
    evidence: string;
}

/**
 * Calculates quiz score and percentage
 */
export function calculateQuizResult(
    questions: QuizQuestion[],
    answers: Record<number, number>
): { score: number; total: number; percentage: number; isPerfect: boolean; incorrectQuestions: QuizQuestion[] } {
    let score = 0;
    const incorrectQuestions: QuizQuestion[] = [];

    questions.forEach((q, idx) => {
        if (answers[idx] === q.correct) {
            score += 1;
        } else {
            incorrectQuestions.push(q);
        }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const isPerfect = total > 0 && score === total;

    return {
        score,
        total,
        percentage,
        isPerfect,
        incorrectQuestions
    };
}

/**
 * Filters items by category
 */
export function filterByCategory<T extends { category: string }>(items: T[], category: string): T[] {
    if (!category || category === 'All') return items;
    return items.filter(item => item.category.toLowerCase() === category.toLowerCase());
}

/**
 * Search Q&A items by query text in English or Arabic
 */
export function searchQAItems(items: QAItem[], query: string): QAItem[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter(
        item =>
            item.question.toLowerCase().includes(trimmed) ||
            item.answer.toLowerCase().includes(trimmed) ||
            item.questionAr.includes(trimmed) ||
            item.evidence.toLowerCase().includes(trimmed)
    );
}

/**
 * Standard questions for the Islamic Kinship curriculum (10 questions):
 * Focuses strictly on:
 * 1. The Prophetic Hadith on sustenance & lifespan
 * 2. The Quranic Verse (Surah An-Nisa 4:36)
 * 3. The UAE Year of the Family national initiative
 */
export const KINSHIP_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        q: "What is the primary reward promised in the Hadith for maintaining kinship (صلة الرحم)?",
        options: ["Abundant provision & extended lifespan (بسط الرزق وطول العمر)", "Immediate worldly fame", "Exemption from prayer"],
        correct: 0,
        explanation: "The Prophet (ﷺ) stated in Sahih al-Bukhari & Muslim: 'Whoever loves that his provision be expanded and his lifespan extended, let him maintain the ties of his kinship' (مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ)."
    },
    {
        id: 2,
        q: "In the Quranic Verse from the kinship chapter (Surah An-Nisa 4:36), what directly follows the command to worship Allah?",
        options: ["Trade and commerce", "Goodness to parents and relatives (وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ)", "Travelling abroad"],
        correct: 1,
        explanation: "Surah An-Nisa (4:36) commands: 'Worship Allah and associate nothing with Him, and do good to parents and to relatives' (وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ)."
    },
    {
        id: 3,
        q: "What is the core objective of the 'UAE Year of the Family' (عام الأسرة) in the kinship curriculum?",
        options: ["Promoting family cohesion and kinship values (تعزيز التماسك الأسري وصلة الرحم)", "Industrial mining projects", "Replacing family visits with virtual avatars"],
        correct: 0,
        explanation: "The UAE Year of the Family translates the Islamic principle of Silat ar-Rahim into community policies supporting intergenerational cohesion and filial devotion (بر الوالدين)."
    },
    {
        id: 4,
        q: "According to the Hadith on kinship, what does 'وَيُنْسَأَ لَهُ فِي أَثَرِهِ' mean?",
        options: ["Forgetting all family history", "Prolonging one's lifespan, impact, and good memory", "Moving to a foreign city"],
        correct: 1,
        explanation: "Scholars explain that 'يُنسأ له في أثره' means Allah blesses the maintainer of kinship with extended life, Barakah in time, and an enduring honorable remembrance."
    },
    {
        id: 5,
        q: "How does the UAE Year of the Family embody the Quranic verse (4:36) regarding relatives (وبذي القربى)?",
        options: ["By honoring senior relatives and fostering intergenerational harmony", "By building commercial shipping ports", "By isolating households from their extended family"],
        correct: 0,
        explanation: "The UAE initiative actively honors senior citizens, strengthens extended family bonds, and instills the Quranic virtue of kindness to kin across generations."
    },
    {
        id: 6,
        q: "Which authentic collections recorded the Hadith: 'Whoever loves that his provision be expanded...'?",
        options: ["Sahih al-Bukhari & Sahih Muslim", "Sunan Ibn Majah only", "Musnad Ahmad only"],
        correct: 0,
        explanation: "This foundational Hadith is mutually agreed upon (Muttafaq عليه) by Imams al-Bukhari and Muslim, underscoring its immense importance in Islamic ethics."
    },
    {
        id: 7,
        q: "What does the Quranic term 'ذِي الْقُرْبَىٰ' (Dhi al-Qurba) mean in Surah An-Nisa (4:36)?",
        options: ["Close relatives and blood relations", "Distant neighbors in foreign countries", "Business partners"],
        correct: 0,
        explanation: "'Dhi al-Qurba' refers to close relatives, with whom Islam commands maintaining relations, mutual visits, and financial or emotional support."
    },
    {
        id: 8,
        q: "What is the overarching wisdom behind the UAE Year of the Family in relation to Islamic teachings?",
        options: ["Ensuring strong family units as the cornerstone of a peaceful and ethical society", "Encouraging citizens to live alone", "Minimizing family gatherings"],
        correct: 0,
        explanation: "As stated in UAE leadership wisdom, 'When the family is strong, the whole nation is strong,' reflecting the Islamic sanctity of family ties."
    },
    {
        id: 9,
        q: "How does maintaining kinship (صلة الرحم) affect a Muslim's relationship with Allah?",
        options: ["It connects them to Allah's Mercy (As the Prophet taught: 'Whoever connects you, I connect')", "It has no spiritual effect", "It replaces daily prayers"],
        correct: 0,
        explanation: "In authentic traditions, Ar-Rahim is tied to the Divine Throne, and Allah promises: 'Whoever keeps you connected, I connect him; and whoever cuts you off, I cut him off.'"
    },
    {
        id: 10,
        q: "What is the recommended attitude when dealing with relatives who are difficult or distant?",
        options: ["Reconcile and maintain ties even if they sever them (الواصل الذي إذا قطعت رحمه وصلها)", "Cut all communication permanently", "Ignore them completely"],
        correct: 0,
        explanation: "The true maintainer of kinship is the one who restores relations when relatives sever them, embodying supreme Islamic patience and nobility of character."
    }
];
