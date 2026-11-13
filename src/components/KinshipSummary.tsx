/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Sparkles, Heart, ShieldCheck, ArrowRight, CheckCircle2, Award, Lightbulb, Play, RotateCcw } from 'lucide-react';

export const KinshipChapterSummary = () => {
    const [activeTab, setActiveTab] = useState(0);

    const steps = [
        {
            title: "1. The Concept of Silat ar-Rahim",
            titleAr: "مفهوم صلة الرحم في الإسلام",
            icon: Heart,
            badge: "Core Definition · التعريف الأساسي",
            summary: "Silat ar-Rahim means maintaining blood and family ties with love, visitation, financial/emotional support, and kind words. It is derived from 'Ar-Rahim' (the Womb), which shares its root with Allah's name 'Ar-Rahman' (The Most Merciful).",
            summaryAr: "صلة الرحم هي الإحسان إلى الأقارب بالقول والعمل والزيارة والدعم، ومشتقة من اسم الله الرحمن لقوله تعالى: (أنا الرحمن وهلعت الرحم وشققت لها اسما من اسمي).",
            lessons: [
                "Bonding with relatives through genuine care and visits.",
                "Preventing alienation and fostering mutual respect.",
                "Upholding family honor and mutual support in hardship."
            ]
        },
        {
            title: "2. The Divine Mandate (Surah An-Nisa 4:36)",
            titleAr: "الآية الكريمة: سورة النساء (٤:٣٦)",
            icon: BookOpen,
            badge: "Quranic Foundation · أساس من القرآن",
            summary: "The Holy Quran elevates kinship rights directly after the supreme command of worshipping Allah alone without partners. This establishes that honoring parents and relatives is an integral pillar of Islamic faith and piety.",
            summaryAr: "قرن الله تعالى عبادته وتوحيده بالإحسان إلى الوالدين وذوي القربى في سورة النساء، تأكيداً على أن حقوق الأسرة والرحم من أعظم الواجبات الدينية.",
            lessons: [
                "Worshiping Allah alone paired with goodness to kin.",
                "Prioritizing parents and close relatives in charity and care.",
                "Recognizing family bonds as a sacred divine trust."
            ]
        },
        {
            title: "3. The Prophetic Promise of Barakah",
            titleAr: "الحديث الشريف: بركة الرزق والعمر",
            icon: Sparkles,
            badge: "Sahih Hadith · الوعد النبوي",
            summary: "The Prophet Muhammad (ﷺ) promised that whoever maintains kinship ties will experience expanded provision (Rizq) and extended lifespan/Barakah in their legacy and impact (Athar).",
            summaryAr: "بشر النبي ﷺ واصل الرحم بزيادة الرزق والبركة في العمر والأثر الطيب: (مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ).",
            lessons: [
                "Barakah in wealth, earnings, and lawful sustenance.",
                "Prolonged spiritual impact and enduring honorable legacy.",
                "Divine connection: 'Whoever connects you, I connect him.'"
            ]
        },
        {
            title: "4. Modern Application & UAE Family Vision",
            titleAr: "التطبيق المعاصر: عام الأسرة في الإمارات",
            icon: ShieldCheck,
            badge: "National Cohesion · رؤية عام الأسرة",
            summary: "The UAE Year of the Family initiative translates this Islamic kinship chapter into national policies—championing intergenerational solidarity, honoring senior citizens, and fostering resilient, caring households.",
            summaryAr: "تجسد مبادرة عام الأسرة في دولة الإمارات قيم صلة الرحم عبر برامج رعاية كبار المواطنين، وتوطيد الترابط الأسري، وغرس قيم التراحم بين الأجيال.",
            lessons: [
                "Honoring senior citizens as roots of wisdom.",
                "Strengthening family counseling and community support.",
                "Creating resilient households rooted in Islamic heritage."
            ]
        }
    ];

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <motion.header 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 text-center md:text-left"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Kinship Chapter Animated Summary · ملخص فصل صلة الرحم</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-950 tracking-tight">
                    Animated Kinship Chapter Summary
                </h1>
                <p className="text-xs md:text-sm text-emerald-900 max-w-2xl font-medium leading-relaxed">
                    Explore the core principles and spiritual teachings of <strong className="font-bold text-emerald-950">Silat ar-Rahim</strong> through engaging interactive steps and smooth animations.
                </p>
            </motion.header>

            {/* Interactive Step Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {steps.map((step, idx) => {
                    const isActive = activeTab === idx;
                    const IconComponent = step.icon;
                    return (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(idx)}
                            className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                                isActive 
                                    ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-[#043e2e] text-white border-emerald-700 shadow-md' 
                                    : 'glass-card text-emerald-950 hover:bg-white border-white/90 shadow-2xs'
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                    isActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>
                                <span className={`text-[11px] font-extrabold ${isActive ? 'text-amber-300' : 'text-emerald-700'}`}>
                                    0{idx + 1}
                                </span>
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-xs sm:text-sm line-clamp-1">{step.title}</h3>
                                <p className={`text-[10px] font-arabic line-clamp-1 ${isActive ? 'text-emerald-200' : 'text-emerald-700'}`}>
                                    {step.titleAr}
                                </p>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Active Step Detailed Animated Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="glass-card p-6 sm:p-8 rounded-3xl border border-white/90 shadow-xl space-y-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                                {steps[activeTab].badge}
                            </span>
                            <h2 className="text-2xl font-extrabold text-emerald-950 mt-2">
                                {steps[activeTab].title}
                            </h2>
                            <p className="font-arabic text-base text-emerald-800 font-bold">
                                {steps[activeTab].titleAr}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab(prev => (prev > 0 ? prev - 1 : steps.length - 1))}
                                className="px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-emerald-900 text-xs font-semibold border border-emerald-200 transition-colors cursor-pointer"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={() => setActiveTab(prev => (prev < steps.length - 1 ? prev + 1 : 0))}
                                className="px-4 py-2 rounded-xl bg-[#065f46] hover:bg-emerald-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Next Step →
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/80 border border-white space-y-2 shadow-2xs">
                                <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                    <span>English Summary</span>
                                </h4>
                                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                                    {steps[activeTab].summary}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50/85 border border-emerald-100 text-right space-y-2 shadow-2xs">
                                <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider font-arabic text-left">
                                    الملخص بالعربية
                                </h4>
                                <p className="font-arabic text-sm sm:text-base text-emerald-950 leading-loose font-bold">
                                    « {steps[activeTab].summaryAr} »
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                <span>Core Principles & Teachings</span>
                            </h4>
                            <div className="space-y-2.5">
                                {steps[activeTab].lessons.map((lesson, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.08 }}
                                        className="p-3.5 rounded-2xl bg-white/90 border border-white flex items-start gap-3 shadow-2xs"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-relaxed">
                                            {lesson}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
