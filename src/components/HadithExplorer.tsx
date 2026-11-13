/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Sparkles, Quote, Volume2, Bookmark, Share2, Check, X, ArrowRight, Lightbulb, ShieldCheck } from 'lucide-react';

interface HighlightTerm {
    term: string;
    termAr: string;
    translation: string;
    context: string;
    significance: string;
}

interface HadithItem {
    id: string;
    title: string;
    titleAr: string;
    source: string;
    sourceAr: string;
    arabicText: string;
    englishText: string;
    narrator: string;
    narratorAr?: string;
    terms: HighlightTerm[];
}

export const HadithExplorer = () => {
    const [selectedHadithId, setSelectedHadithId] = useState('hadith1');
    const [activeTerm, setActiveTerm] = useState<HighlightTerm | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const hadiths: HadithItem[] = [
        {
            id: 'hadith1',
            title: "Expansion of Provision and Lifespan",
            titleAr: "حديث بسط الرزق وطول العمر في صلة الرحم",
            source: "Sahih al-Bukhari & Sahih Muslim",
            sourceAr: "صحيح البخاري وصحيح مسلم",
            narrator: "Anas ibn Malik (RA) narrated that the Messenger of Allah (ﷺ) said:",
            narratorAr: "عن أنس بن مالك رضي الله عنه قال: سمعت رسول الله ﷺ يقول:",
            arabicText: "مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ",
            englishText: "Whoever loves that his provision be expanded and his lifespan extended, let him maintain the ties of his kinship.",
            terms: [
                {
                    term: "Rizq",
                    termAr: "رِزْقِهِ",
                    translation: "Provision / Sustenance",
                    context: "Refers to both material wealth, lawful earnings, and inner contentment (Barakah).",
                    significance: "Upholding family bonds is a divine catalyst that unlocks abundance, ease, and divine blessing in livelihood."
                },
                {
                    term: "Athar",
                    termAr: "أَثَرِهِ",
                    translation: "Lifespan / Enduring Legacy",
                    context: "Scholars explain this as the extension of one's physical life or the enduring honorable remembrance after passing.",
                    significance: "Goodness towards relatives preserves a person's good name and ensures ongoing prayers and blessings from descendants."
                },
                {
                    term: "Silat ar-Rahim",
                    termAr: "فَلْيَصِلْ رَحِمَهُ",
                    translation: "Maintaining Kinship Ties",
                    context: "Active connection through visits, kind speech, gift-giving, and assisting relatives in times of need.",
                    significance: "The Prophet (ﷺ) made kinship maintenance a direct key to worldly blessings and spiritual elevation."
                }
            ]
        },
        {
            id: 'hadith2',
            title: "Connection to the Divine Throne",
            titleAr: "حديث تعلق الرحم بالعرش الإلهي",
            source: "Sahih al-Bukhari",
            sourceAr: "صحيح البخاري",
            narrator: "Aisha (RA) reported that the Prophet (ﷺ) said:",
            narratorAr: "عن عائشة رضي الله عنها عن النبي ﷺ قال:",
            arabicText: "الرَّحِمُ مُعَلَّقَةٌ بِالْعَرْشِ تَقُولُ: مَنْ وَصَلَني وَصَلَهُ اللهُ، وَمَنْ قَطَعَني قَطَعَهُ اللهُ",
            englishText: "The womb (kinship) is suspended from the Throne, saying: 'Whoever connects me, Allah connects him; and whoever cuts me off, Allah cuts him off.'",
            terms: [
                {
                    term: "Ar-Rahim",
                    termAr: "الرَّحِمُ",
                    translation: "The Womb / Kinship",
                    context: "Derived from 'Ar-Rahman' (The Most Merciful), symbolizing the sacred bonds of blood and kinship.",
                    significance: "Highlights the immense sanctity of family ties in Islam; severing them is a grave spiritual hazard."
                },
                {
                    term: "Al-Arsh",
                    termAr: "بِالْعَرْشِ",
                    translation: "The Divine Throne",
                    context: "The highest ceiling of creation, signifying the supreme divine authority and honor given to kinship.",
                    significance: "Demonstrates that honoring family ties has a direct heavenly status before Allah Almighty."
                },
                {
                    term: "Connection",
                    termAr: "وَصَلَهُ اللهُ",
                    translation: "Divine Connection & Mercy",
                    context: "Allah's special grace, assistance, and unending mercy bestowed upon those who maintain family ties.",
                    significance: "To be connected by Allah means experiencing divine protection and success in both worlds."
                }
            ]
        },
        {
            id: 'hadith3',
            title: "The True Maintainer of Kinship",
            titleAr: "حديث الواصل الحقيقي للرحم",
            source: "Sahih al-Bukhari",
            sourceAr: "صحيح البخاري",
            narrator: "Abdullah ibn Amr (RA) reported that the Prophet (ﷺ) said:",
            narratorAr: "عن عبد الله بن عمرو رضي الله عنهما عن النبي ﷺ قال:",
            arabicText: "لَيْسَ الْوَاصِلُ بِالْمُكَافِئِ، وَلَكِنِ الْوَاصِلُ الَّذِي إِذَا قُطِعَتْ رَحِمُهُ وَصَلَهَا",
            englishText: "The maintainer of kinship is not the one who merely reciprocates kindness, but the maintainer is the one who, when his relatives cut him off, restores the ties.",
            terms: [
                {
                    term: "Al-Mukafi",
                    termAr: "بِالْمُكَافِئِ",
                    translation: "The Reciprocator",
                    context: "Someone who only visits or helps relatives if they visit or help them first.",
                    significance: "True Islamic nobility involves showing unconditional grace, even when others fall short of their duties."
                },
                {
                    term: "Restoration",
                    termAr: "وَصَلَهَا",
                    translation: "Restoring Severed Ties",
                    context: "Reaching out with forgiveness and patience when family members distance themselves.",
                    significance: "Demonstrates supreme Islamic character, emotional maturity, and reliance on Allah's reward."
                }
            ]
        }
    ];

    const currentHadith = hadiths.find(h => h.id === selectedHadithId) || hadiths[0];

    const handleListen = () => {
        if (!('speechSynthesis' in window)) return;
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentHadith.arabicText);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.85;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <motion.header 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 text-center md:text-left"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                    <Quote className="w-4 h-4 text-amber-600" />
                    <span>Interactive Hadith Explorer · مستكشف الأحاديث النبوية</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-950 tracking-tight">
                    Interactive Hadith Explorer
                </h1>
                <p className="text-xs md:text-sm text-emerald-900 max-w-2xl font-medium leading-relaxed">
                    Explore authentic Sahih Hadiths on kinship (<strong className="font-bold text-emerald-950">صلة الرحم</strong>). Tap any highlighted key term to inspect its contextual background and spiritual significance.
                </p>
            </motion.header>

            {/* Hadith Selection Tabs */}
            <div className="flex flex-wrap gap-2">
                {hadiths.map((h) => {
                    const isSelected = h.id === selectedHadithId;
                    return (
                        <motion.button
                            key={h.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setSelectedHadithId(h.id);
                                setActiveTerm(null);
                            }}
                            className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                isSelected 
                                    ? 'bg-[#065f46] text-white shadow-md border border-emerald-700' 
                                    : 'glass-card text-emerald-950 hover:bg-white border-white/90 shadow-2xs'
                            }`}
                        >
                            <Quote className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`} />
                            <div className="text-left">
                                <span className="block leading-tight">{h.title}</span>
                                <span className={`block text-[10px] font-arabic font-normal mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`}>
                                    {h.source}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Selected Hadith Display Card with Animated Entrance */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentHadith.id}
                    initial={{ opacity: 0, scale: 0.97, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="glass-card p-6 sm:p-8 rounded-3xl border border-white/90 shadow-2xl space-y-6 relative overflow-hidden"
                >
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-emerald-100">
                        <div className="space-y-0.5">
                            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                                {currentHadith.source}
                            </span>
                            <h2 className="text-xl font-extrabold text-emerald-950 mt-2">
                                {currentHadith.title}
                            </h2>
                            <p className="text-xs font-arabic text-emerald-800 font-bold">
                                {currentHadith.titleAr}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleListen}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                                    isSpeaking 
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' 
                                        : 'bg-white/90 hover:bg-white text-emerald-900 border border-emerald-200'
                                }`}
                                title="Listen to Hadith"
                            >
                                <Volume2 className="w-4 h-4 text-amber-600" />
                                <span>{isSpeaking ? "Speaking..." : "Listen Arabic"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Narrator */}
                    <div className="space-y-1 text-xs text-emerald-950 font-medium">
                        <p>{currentHadith.narrator}</p>
                        <p className="font-arabic text-right text-emerald-800 font-semibold">{currentHadith.narratorAr}</p>
                    </div>

                    {/* Arabic Hadith Text with Interactive Highlighting */}
                    <div className="p-6 rounded-2xl bg-white/90 border border-white space-y-3 text-right shadow-sm backdrop-blur-md">
                        <p className="font-arabic text-2xl sm:text-3xl font-bold leading-loose text-emerald-950">
                            « {currentHadith.arabicText} »
                        </p>
                        <p className="text-xs font-arabic text-amber-900 font-bold">
                            — {currentHadith.sourceAr}
                        </p>
                    </div>

                    {/* English Translation */}
                    <div className="space-y-1 p-2">
                        <p className="text-sm sm:text-base text-emerald-950 font-semibold leading-relaxed">
                            "{currentHadith.englishText}"
                        </p>
                    </div>

                    {/* Highlighted Key Terms Section */}
                    <div className="pt-4 border-t border-emerald-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                                Highlighted Key Terms — Tap to Inspect Context & Significance:
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {currentHadith.terms.map((term, idx) => {
                                const isSelected = activeTerm?.term === term.term;
                                return (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveTerm(term)}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                                            isSelected 
                                                ? 'bg-amber-500 text-emerald-950 border-amber-600 shadow-md ring-2 ring-amber-400/40' 
                                                : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 border-emerald-200 shadow-2xs'
                                        }`}
                                    >
                                        <span className="font-arabic text-base font-extrabold text-emerald-900">{term.termAr}</span>
                                        <span className="opacity-75">({term.translation})</span>
                                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Term Detailed Modal / Card Popup */}
                    <AnimatePresence>
                        {activeTerm && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-[#043e2e] text-white space-y-4 shadow-xl border border-emerald-700 relative"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-lg font-arabic shadow-md">
                                            {activeTerm.termAr}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-base text-amber-200">
                                                {activeTerm.term} ({activeTerm.translation})
                                            </h4>
                                            <p className="text-xs text-emerald-200 font-medium">Context & Significance Analysis</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveTerm(null)}
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                                        aria-label="Close term explanation"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                    <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-1.5 backdrop-blur-sm">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Context & Definition</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                                            {activeTerm.context}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-1.5 backdrop-blur-sm">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                                            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Spiritual Significance</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                                            {activeTerm.significance}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
