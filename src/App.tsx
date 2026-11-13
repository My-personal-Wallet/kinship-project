/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookOpen, Calendar, Home, Share2, Bot, Settings, X, Trophy, Sparkles, Award, Star, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Check, ChevronDown, Search, MessageSquare, Send, Volume2, User, QrCode, Trash2, HeartHandshake, HandHeart, Network, ShieldCheck, Quote, Bookmark, GraduationCap, RotateCcw, Lightbulb, Play, Smartphone, Download, ExternalLink, Plus, Menu, ArrowUpRight, Laptop, Globe, Camera, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { KINSHIP_QUESTIONS, calculateQuizResult, searchQAItems, QAItem } from './utils/kinshipLogic';
import { KinshipChapterSummary } from './components/KinshipSummary';
import { HadithExplorer } from './components/HadithExplorer';
import { usePWAInstall } from './hooks/usePWAInstall';
import { QRCodeSVG } from 'qrcode.react';

const SHORT_APP_URL = 'https://is.gd/kin_u';
const SHORT_APP_DISPLAY = 'is.gd/kin_u';

// ... (PageTransition and Nav components remain largely the same, update with login status)

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const QuizComponent = () => {
    const [qIdx, setQIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const handleAnswer = (optionIdx: number) => {
        setSelectedOption(optionIdx);
        setAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
        
        setTimeout(() => {
            if (qIdx < KINSHIP_QUESTIONS.length - 1) {
                setQIdx(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setShowSummary(true);
            }
        }, 700);
    };

    const handleRestart = () => {
        setQIdx(0);
        setSelectedOption(null);
        setShowSummary(false);
        setAnswers({});
    };

    const result = calculateQuizResult(KINSHIP_QUESTIONS, answers);

    if (showSummary) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto"
            >
                {/* 100% Confetti Celebration Animation */}
                {result.isPerfect && (
                    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                        {[...Array(40)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ 
                                    y: -20, 
                                    x: `${(i * 2.5) % 100}vw`,
                                    rotate: 0,
                                    scale: Math.random() * 0.8 + 0.4
                                }}
                                animate={{ 
                                    y: '105vh', 
                                    rotate: 720,
                                    x: `${((i * 2.5) % 100) + (i % 2 === 0 ? 8 : -8)}vw`
                                }}
                                transition={{ 
                                    duration: 3 + (i % 3), 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    delay: (i * 0.08)
                                }}
                                className={`w-3.5 h-3.5 rounded-sm absolute ${
                                    i % 4 === 0 ? 'bg-amber-400' : 
                                    i % 4 === 1 ? 'bg-emerald-500' : 
                                    i % 4 === 2 ? 'bg-teal-400' : 'bg-yellow-300'
                                } shadow-sm`}
                            />
                        ))}
                    </div>
                )}

                {/* Score Header Card */}
                <div className={`p-8 rounded-3xl text-center space-y-4 shadow-xl border ${
                    result.isPerfect 
                        ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-amber-300 shadow-amber-500/20' 
                        : 'glass-card text-emerald-950 border-white/90'
                }`}>
                    <div className="flex justify-center">
                        <motion.div 
                            animate={result.isPerfect ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${result.isPerfect ? 'bg-white text-amber-600' : 'bg-emerald-100 text-emerald-800'}`}
                        >
                            <Trophy className="w-9 h-9" />
                        </motion.div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            {result.isPerfect ? "Masha'Allah! Perfect 100%!" : "Quiz Completed!"}
                        </h2>
                        <p className={`text-sm mt-1 ${result.isPerfect ? 'text-amber-100' : 'text-emerald-700'}`}>
                            {result.isPerfect ? "You mastered all Islamic kinship principles!" : "Review the feedback below to strengthen your knowledge."}
                        </p>
                    </div>

                    <div className="text-4xl font-black">
                        {result.score} / {result.total}
                        <span className={`text-lg font-bold ml-2 ${result.isPerfect ? 'text-amber-200' : 'text-emerald-600'}`}>
                            ({result.percentage}%)
                        </span>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleRestart} 
                        className={`px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-colors ${
                            result.isPerfect 
                                ? 'bg-white text-amber-900 hover:bg-amber-50' 
                                : 'bg-[#065f46] text-white hover:bg-emerald-800'
                        }`}
                    >
                        Retake Kinship Quiz
                    </motion.button>
                </div>

                {/* Explicit Learning Feedback Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <h3 className="text-xl font-bold text-emerald-950">Learning Feedback</h3>
                    </div>

                    {result.incorrectQuestions.length === 0 ? (
                        <div className="glass-card border border-emerald-200 p-5 rounded-2xl text-emerald-900 flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm">Flawless Understanding!</h4>
                                <p className="text-xs text-emerald-700 mt-1">
                                    You answered every question correctly on authentic Quranic commands, Sahih Hadiths, and the status of family kinship.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs text-emerald-800">
                                Review the questions you missed and the authentic Islamic explanations:
                            </p>
                            {result.incorrectQuestions.map((q, idx) => (
                                <motion.div 
                                    key={q.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card p-5 rounded-2xl border border-white/90 shadow-xs space-y-3"
                                >
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                        <p className="font-bold text-sm text-emerald-950">{q.q}</p>
                                    </div>
                                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
                                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                                            <Check className="w-4 h-4 text-emerald-600" />
                                            <span>Correct Answer: {q.options[q.correct]}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5 text-emerald-900 leading-relaxed font-medium pt-0.5">
                                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                            <span>{q.explanation}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    const progress = ((qIdx + (selectedOption !== null ? 1 : 0)) / KINSHIP_QUESTIONS.length) * 100;
    const currentQ = KINSHIP_QUESTIONS[qIdx];

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-emerald-800">
                    <span>Question {qIdx + 1} of {KINSHIP_QUESTIONS.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-emerald-600 to-[#d97706] h-full transition-all duration-300 rounded-full" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <motion.div 
                key={qIdx} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-white/90 space-y-6"
            >
                <h2 className="text-xl md:text-2xl font-extrabold text-emerald-950 leading-snug">
                    {currentQ.q}
                </h2>
                <div className="space-y-3">
                    {currentQ.options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = idx === currentQ.correct;
                        return (
                            <motion.button 
                                key={idx}
                                whileHover={{ scale: selectedOption === null ? 1.01 : 1 }}
                                whileTap={{ scale: selectedOption === null ? 0.99 : 1 }}
                                onClick={() => handleAnswer(idx)}
                                disabled={selectedOption !== null}
                                className={`w-full p-4 rounded-2xl text-left border text-sm font-semibold transition-all flex items-center justify-between ${
                                    selectedOption === null 
                                        ? 'border-emerald-100/80 bg-white/70 hover:bg-white hover:border-emerald-300 text-emerald-950 shadow-2xs' 
                                        : isCorrect 
                                            ? 'border-emerald-500 bg-emerald-100 text-emerald-950 shadow-xs font-bold' 
                                            : isSelected 
                                                ? 'border-rose-400 bg-rose-50 text-rose-950 font-bold' 
                                                : 'border-slate-100 bg-white/40 text-slate-400'
                                }`}
                            >
                                <span>{option}</span>
                                {selectedOption !== null && isCorrect && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Correct
                                    </span>
                                )}
                                {selectedOption !== null && isSelected && !isCorrect && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-rose-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-rose-200">
                                        <X className="w-3.5 h-3.5 text-rose-600" /> Incorrect
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

const AnimatedWriting = ({ 
  text, 
  className = "", 
  delay = 0,
  stagger = 0.035 
}: { 
  text: string; 
  className?: string; 
  delay?: number;
  stagger?: number;
}) => {
  const letters = Array.from(text);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 14,
        stiffness: 120,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className}`}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
            onAnimationComplete={onComplete}
            className="fixed inset-0 w-screen h-screen min-h-screen min-w-full z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#022c22] text-white p-6 overflow-hidden select-none"
        >
            {/* Pure Arabic Salam */}
            <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-3 tracking-wide text-amber-100 text-center font-arabic drop-shadow-md"
            >
                السَّلَامُ عَلَيْكُمْ
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl sm:text-2xl text-emerald-200 font-medium tracking-wide text-center font-sans"
            >
                Assalamu Alaykum — Peace be upon you
            </motion.p>
        </motion.div>
    );
};

const StartingPage = ({ onEnterApp }: { onEnterApp: () => void }) => {
    const navigate = useNavigate();

    const appFeatures = [
        {
            id: 'ai-guide',
            title: 'AI Kinship & Knowledge Guide',
            desc: 'Ask questions in Arabic or English on Silat ar-Rahim and general studies.',
            path: '/chat',
            icon: Bot,
        },
        {
            id: 'hadith-verse',
            title: 'The Hadith & The Verse',
            desc: 'Authentic Sahih Hadiths & Surah An-Nisa (4:36) with audio recitation.',
            path: '/teachings',
            icon: BookOpen,
        },
        {
            id: 'hadith-explorer',
            title: 'Interactive Hadith Explorer',
            desc: 'Tap highlighted Arabic and English terms for scholarly context.',
            path: '/hadith-explorer',
            icon: Quote,
        },
        {
            id: 'chapter-summary',
            title: 'Kinship Chapter Summary',
            desc: 'Step-by-step animated lesson summary of family ties and Barakah.',
            path: '/chapter-summary',
            icon: Sparkles,
        },
        {
            id: 'uae-family',
            title: 'UAE Year of the Family',
            desc: 'Four pillars of family cohesion and intergenerational care.',
            path: '/initiative',
            icon: HeartHandshake,
        },
        {
            id: 'quiz',
            title: '10-Question Kinship Quiz',
            desc: 'Interactive quiz with instant learning feedback and explanations.',
            path: '/quiz',
            icon: GraduationCap,
        },
    ];

    const handleLaunchFeature = (path: string) => {
        onEnterApp();
        navigate(path);
    };

    const handleContinue = () => {
        onEnterApp();
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-[#f0fdf4] via-[#fefce8] to-[#f0fdf4] text-emerald-950 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed top-[-120px] left-1/4 w-[440px] h-[440px] bg-emerald-200/35 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-120px] right-[-80px] w-[380px] h-[380px] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-white/90 shadow-xl space-y-6"
            >
                {/* App Welcome Header */}
                <div className="flex items-center gap-4 border-b border-emerald-100/80 pb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-emerald-200 shadow-sm overflow-hidden shrink-0">
                        <img
                            src="/assets/kinship_icon.jpg"
                            alt="Kinship and Family Icon"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-semibold text-emerald-700">
                            <span>Kinship &amp; Family in Islam</span>
                            <span aria-hidden="true" className="mx-1.5">·</span>
                            <span className="font-arabic">صلة الرحم</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 tracking-tight leading-snug">
                            What&apos;s Inside the App
                        </h1>
                        <p className="text-xs text-emerald-800 font-medium">
                            Created by SHAIMAL — Tap any feature or continue
                        </p>
                    </div>
                </div>

                {/* Compact List of All App Features */}
                <div className="space-y-2.5">
                    {appFeatures.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <button
                                key={feature.id}
                                type="button"
                                onClick={() => handleLaunchFeature(feature.path)}
                                className="w-full text-left p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-emerald-100/80 hover:border-emerald-300 transition-all flex items-center gap-3.5 group cursor-pointer shadow-2xs"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-amber-100 text-emerald-800 group-hover:text-amber-900 flex items-center justify-center shrink-0 transition-colors">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-sm font-bold text-emerald-950 leading-tight">
                                        {feature.title}
                                    </h2>
                                    <p className="text-xs text-emerald-800/90 leading-snug mt-0.5">
                                        {feature.desc}
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                        );
                    })}
                </div>

                {/* Primary Continue Action */}
                <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
            </motion.div>
        </div>
    );
};

const QRModal = ({ onClose, initialCopied = false }: { onClose: () => void; initialCopied?: boolean }) => {
    const [copied, setCopied] = useState(initialCopied);

    const handleCopy = () => {
        navigator.clipboard?.writeText(SHORT_APP_URL).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Kinship & Family in Islam',
                    text: 'Discover the beauty of Kinship (Silat ar-Rahim) and family values.',
                    url: SHORT_APP_URL,
                });
                return;
            } catch {
                // fallback to copy
            }
        }
        handleCopy();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="glass-card p-6 sm:p-8 rounded-3xl w-full max-w-sm border border-white/90 shadow-2xl relative text-emerald-950 space-y-5 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-emerald-100 pb-3 text-left">
                    <div>
                        <h2 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2">
                            <QrCode className="w-5 h-5 text-emerald-700" />
                            <span>Scan QR Code</span>
                        </h2>
                        <p className="text-[11px] font-bold text-emerald-700 font-arabic">امسح الرمز لفتح التطبيق</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close QR modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="inline-block p-4 bg-white rounded-2xl border-2 border-emerald-200 shadow-md">
                    <QRCodeSVG
                        value={SHORT_APP_URL}
                        size={192}
                        level="H"
                        includeMargin
                        fgColor="#022c22"
                        bgColor="#ffffff"
                        className="mx-auto rounded-lg"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-900">Point your mobile camera to open instantly</p>
                    <a
                        href={SHORT_APP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-emerald-900 hover:text-emerald-950 font-mono font-extrabold bg-emerald-50/90 border border-emerald-200 px-3 py-2 rounded-xl tracking-wide select-all transition-colors"
                    >
                        {SHORT_APP_DISPLAY}
                    </a>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                    <button
                        onClick={handleCopy}
                        className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <ExternalLink className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Link Copied!' : 'Copy Short URL'}</span>
                    </button>
                    <button
                        onClick={handleNativeShare}
                        className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const SettingsModal = ({ 
    onClose, 
    onReplaySplash 
}: { 
    onClose: () => void; 
    onReplaySplash?: () => void;
}) => {
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('sound_enabled') !== 'false');
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);

    const projectUrl = SHORT_APP_URL;

    const handleCopy = () => {
        navigator.clipboard.writeText(projectUrl);
        setCopied(true);
        setActionMessage("📋 Link copied to clipboard");
        setTimeout(() => setCopied(false), 3000);
        setTimeout(() => setActionMessage(null), 3000);
    };

    const handleReset = (key: string, message: string) => {
        localStorage.removeItem(key);
        setActionMessage(`✅ ${message}`);
        setTimeout(() => setActionMessage(null), 3000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-card p-6 sm:p-8 rounded-3xl w-full max-w-lg border border-white/90 shadow-2xl relative text-emerald-950 space-y-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-emerald-100 pb-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-emerald-950">App Settings</h2>
                        <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-arabic">الإعدادات · صلة الرحم</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Feedback Banner */}
                <AnimatePresence>
                    {actionMessage && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-emerald-100/90 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold text-center">
                            {actionMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {showQR ? (
                    <div className="space-y-4 text-center">
                        <div className="inline-block p-3.5 bg-white rounded-2xl border-2 border-emerald-200 shadow-md">
                            <QRCodeSVG
                                value={projectUrl}
                                size={176}
                                level="H"
                                includeMargin
                                fgColor="#022c22"
                                bgColor="#ffffff"
                                className="mx-auto rounded-lg"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-emerald-950">Scan for live link</p>
                            <p className="text-xs text-emerald-900 font-mono font-extrabold bg-emerald-50/80 border border-emerald-100 px-3 py-1.5 rounded-lg tracking-wide select-all">{SHORT_APP_DISPLAY}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleCopy} className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer">
                                {copied ? 'Copied!' : 'Copy Short URL'}
                            </button>
                            <button onClick={() => setShowQR(false)} className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs transition-colors cursor-pointer">
                                Back to Settings
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Section: Project */}
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">Project</h3>
                            <button onClick={() => setShowQR(true)} className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/90 border border-white hover:border-emerald-200 transition-all shadow-2xs cursor-pointer">
                                <span className="flex items-center gap-3 text-xs font-semibold"><QrCode className="w-4 h-4 text-emerald-700" /> Share Project & QR Code</span>
                                <ArrowRight className="w-4 h-4 text-emerald-400" />
                            </button>
                            {onReplaySplash && (
                                <button onClick={onReplaySplash} className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/90 border border-white hover:border-emerald-200 transition-all shadow-2xs cursor-pointer">
                                    <span className="flex items-center gap-3 text-xs font-semibold"><Play className="w-4 h-4 text-emerald-700" /> Replay Intro</span>
                                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                                </button>
                            )}
                        </div>

                        {/* Section: Data Management */}
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">Data & Progress</h3>
                            <button onClick={() => handleReset('dailyVerse', 'Daily reflection reset')} className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/90 border border-white hover:border-emerald-200 transition-all shadow-2xs cursor-pointer">
                                <span className="flex items-center gap-3 text-xs font-semibold"><RefreshCw className="w-4 h-4 text-emerald-700" /> Reset Daily Reflection</span>
                            </button>
                            <button onClick={() => handleReset('quizScore', 'Quiz progress reset')} className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/90 border border-white hover:border-emerald-200 transition-all shadow-2xs cursor-pointer">
                                <span className="flex items-center gap-3 text-xs font-semibold"><RotateCcw className="w-4 h-4 text-emerald-700" /> Reset Quiz Progress</span>
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default function App() {
  const [guestId] = useState(() => localStorage.getItem('guestId') || Math.random().toString(36).substring(7));
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('autostart=1')) {
      return false;
    }
    return true;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCopiedOnOpen, setQrCopiedOnOpen] = useState(false);
  const [showStartingPage, setShowStartingPage] = useState(true);

  useEffect(() => {
    localStorage.setItem('guestId', guestId);
    localStorage.removeItem('app_theme');
    document.documentElement.classList.remove('dark');
  }, [guestId]);

  const handleOpenQR = () => {
    setQrCopiedOnOpen(false);
    setShowQRModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kinship & Family in Islam',
          text: 'Discover the beauty of Kinship (Silat ar-Rahim) and family values.',
          url: SHORT_APP_URL,
        });
        return;
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
    navigator.clipboard?.writeText(SHORT_APP_URL).catch(() => {});
    setQrCopiedOnOpen(true);
    setShowQRModal(true);
  };

  if (showSplash) {
      return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      {showStartingPage ? (
        <StartingPage onEnterApp={() => setShowStartingPage(false)} />
      ) : (
      <div className="min-h-screen pb-24 text-emerald-950 relative overflow-hidden bg-gradient-to-br from-[#f0fdf4] via-[#fefce8] to-[#f0fdf4]">
        {/* Floating Ambient Glass Mesh Gradient Orbs */}
        <div className="fixed top-[-100px] left-1/4 w-[500px] h-[500px] bg-emerald-200/35 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed top-[300px] right-[-100px] w-[450px] h-[450px] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-100px] left-[-50px] w-[400px] h-[400px] bg-emerald-300/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Glass Header */}
        <header className="glass-header p-4 sticky top-0 z-30 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-white/90 border border-white p-0.5 flex items-center justify-center shadow-md overflow-hidden shrink-0 backdrop-blur-md">
                    <img 
                        src="/assets/kinship_icon.jpg" 
                        alt="Kinship Icon" 
                        className="w-full h-full object-cover rounded-xl" 
                    />
                </div>
                <div>
                    <h1 className="font-extrabold text-base sm:text-lg text-emerald-950 leading-tight">Kinship & Family</h1>
                    <p className="text-[10px] text-emerald-800 font-semibold">The Hadith, The Verse & UAE Family · صلة الرحم</p>
                </div>
            </Link>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleOpenQR}
                    className="w-9 h-9 rounded-2xl bg-emerald-800 hover:bg-emerald-900 border border-emerald-700 flex items-center justify-center text-amber-300 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Show QR Code"
                    aria-label="Show QR Code"
                >
                    <QrCode className="w-4 h-4" />
                </button>
                <button 
                    onClick={handleShare}
                    className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white border border-white/90 flex items-center justify-center text-emerald-800 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Share App"
                    aria-label="Share App"
                >
                    <Share2 className="w-4 h-4 text-emerald-800" />
                </button>
                <button 
                    onClick={() => setShowInstallModal(true)}
                    className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white border border-white/90 flex items-center justify-center text-emerald-800 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Download App"
                    aria-label="Download App"
                >
                    <Download className="w-4 h-4 text-emerald-800" />
                </button>
                <button 
                    onClick={() => setShowSettings(true)}
                    className="w-9 h-9 rounded-2xl bg-white/80 hover:bg-white border border-white/90 flex items-center justify-center text-emerald-800 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Project Settings"
                    aria-label="Settings"
                >
                    <Settings className="w-4 h-4 text-emerald-800" />
                </button>
            </div>
        </header>

        <AnimatePresence>
            {showQRModal && (
                <QRModal onClose={() => setShowQRModal(false)} initialCopied={qrCopiedOnOpen} />
            )}
        </AnimatePresence>

        <AnimatePresence>
            {showInstallModal && (
                <InstallAppModal onClose={() => setShowInstallModal(false)} />
            )}
        </AnimatePresence>

        <AnimatePresence>
            {showSettings && (
                <SettingsModal 
                    onClose={() => setShowSettings(false)} 
                    onReplaySplash={() => {
                        setShowSettings(false);
                        setShowStartingPage(true);
                        setShowSplash(true);
                    }}
                />
            )}
        </AnimatePresence>

        <Routes>
          <Route path="/" element={<PageTransition><HomeComponent onInstallClick={() => setShowInstallModal(true)} onShareClick={handleShare} onQrClick={handleOpenQR} /></PageTransition>} />
          <Route path="/teachings" element={<PageTransition><TeachingsComponent /></PageTransition>} />
          <Route path="/chapter-summary" element={<PageTransition><KinshipChapterSummary /></PageTransition>} />
          <Route path="/hadith-explorer" element={<PageTransition><HadithExplorer /></PageTransition>} />
          <Route path="/initiative" element={<PageTransition><InitiativeComponent /></PageTransition>} />
          <Route path="/chat" element={<PageTransition><ChatComponent guestId={guestId} /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><QuizComponent /></PageTransition>} />
        </Routes>
        
        <footer className="mt-8 mb-24 max-w-lg mx-3 sm:mx-auto relative z-10 glass-card px-4 py-3 rounded-2xl text-center flex flex-col sm:flex-row items-center justify-between gap-2 border border-white/90 shadow-xs backdrop-blur-md">
            <p className="font-bold text-emerald-950 text-[11px] tracking-tight leading-snug">
              Kinship & Family in Islam <span className="text-emerald-700">· صلة الرحم</span>
            </p>
            <p className="text-amber-950 font-bold text-[10px] inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300/80 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>By SHAIMAL</span>
            </p>
        </footer>
        <Nav />
      </div>
      )}
    </BrowserRouter>
  );
}

const Nav = () => {
  const location = useLocation();
  const links = [
    { path: '/', label: 'Home', labelAr: 'الرئيسية', icon: Home },
    { path: '/teachings', label: 'Hadith & Verse', labelAr: 'الحديث والآية', icon: BookOpen },
    { path: '/initiative', label: 'UAE Family', labelAr: 'عام الأسرة', icon: HeartHandshake },
    { path: '/quiz', label: 'Quiz', labelAr: 'الاختبار', icon: GraduationCap },
    { path: '/chat', label: 'AI Guide', labelAr: 'المساعد', icon: Bot },
  ];
  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 py-2.5 px-3 z-40 flex justify-around shadow-lg">
      {links.map(({ path, label, labelAr, icon: Icon }) => {
        const isActive = location.pathname === path;
        return (
          <Link 
              key={path} 
              to={path} 
              className={`flex flex-col items-center gap-0.5 transition-all px-2.5 py-1 rounded-2xl ${
                isActive ? 'text-emerald-950 font-extrabold scale-105' : 'text-emerald-700 hover:text-emerald-950 font-medium'
              }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-emerald-950 shadow-md' : 'text-emerald-700'}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] leading-tight">{label}</span>
            <span className="text-[9px] font-arabic text-emerald-600 leading-tight">{labelAr}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const ChatComponent = ({ guestId }: { guestId: string }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const clearChat = () => {
        setMessages([]);
    };

    const sendUserMessage = async (msgContent: string) => {
        if (!msgContent.trim() || isLoading) return;
        const messageText = msgContent.trim();
        setText('');
        setIsLoading(true);
        
        setMessages(prev => [...prev.slice(-14), { id: 'user-' + Date.now(), text: messageText, role: 'user', createdAt: new Date() }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });
            const data = await response.json();
            const reply = data.text || "Kinship (Silat ar-Rahim) brings blessings to life, provision, and family unity. Feel free to ask any general knowledge questions too!";
            
            setMessages(prev => [...prev.slice(-14), { id: 'bot-' + Date.now(), text: reply, role: 'model', createdAt: new Date() }]);
        } catch (error) {
            console.error('Chat error', error);
            setMessages(prev => [...prev, { 
                id: 'err-' + Date.now(), 
                text: "Kinship ties are linked to Allah's Mercy. You can also ask me any general knowledge or educational question!", 
                role: 'model', 
                createdAt: new Date() 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        "Who created you?",
        "What are the rewards of Silat ar-Rahim?",
        "Tell me about Islamic family values",
        "Ask any general knowledge question!"
    ];

    return (
        <div className="flex flex-col h-[82vh] max-w-3xl mx-auto p-4 pb-28">
            <header className="mb-4 p-4 rounded-3xl glass-card border border-white/90 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center shadow-md">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-extrabold text-emerald-950 text-base">General Knowledge & Kinship AI Guide</h2>
                        <p className="text-xs text-emerald-800 font-semibold">Created by MUHAMMED SHAIMAL</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                        <button 
                            onClick={clearChat}
                            className="text-xs px-3 py-1.5 rounded-xl bg-white/80 text-emerald-800 hover:bg-white transition-colors flex items-center gap-1 border border-white/90 shadow-2xs font-semibold"
                            title="Clear Chat"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Clear</span>
                        </button>
                    )}
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 flex items-center gap-1 border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-700" />
                        Online
                    </span>
                </div>
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-3">
                {messages.length === 0 && (
                    <div className="text-center py-10 space-y-4 glass-card rounded-3xl border border-white/90 p-6 md:p-8 shadow-sm">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-100/80 mx-auto flex items-center justify-center text-emerald-900 shadow-inner">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="font-extrabold text-emerald-950 text-xl">Assalamu Alaykum!</h3>
                        <p className="text-xs sm:text-sm text-emerald-900 max-w-sm mx-auto font-medium leading-relaxed">
                            Ask me any question about general knowledge, school curriculum topics, science, history, or Islamic Kinship (<span className="font-arabic font-bold">صلة الرحم</span>).
                        </p>
                        <div className="pt-2 flex flex-wrap gap-2 justify-center">
                            {suggestedQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => sendUserMessage(q)}
                                    className="text-xs px-3.5 py-2 rounded-2xl bg-white/90 border border-white text-emerald-950 font-semibold hover:bg-white hover:border-emerald-300 transition-all shadow-2xs cursor-pointer"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map(m => (
                    <motion.div 
                        key={m.id} 
                        initial={{ opacity: 0, y: 8 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className={`p-4 rounded-3xl text-xs md:text-sm leading-relaxed shadow-sm max-w-[85%] font-medium ${
                            m.role === 'user' 
                                ? 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#043e2e] text-white ml-auto rounded-br-none shadow-emerald-950/20 border border-emerald-700/50' 
                                : 'glass-card border border-white/90 text-emerald-950 mr-auto rounded-bl-none shadow-sm'
                        }`}
                    >
                        {m.text}
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="p-3.5 rounded-2xl glass-card border border-white/90 text-emerald-900 text-xs mr-auto flex items-center gap-2 shadow-sm font-semibold"
                    >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                        <span>Thinking & generating answer...</span>
                    </motion.div>
                )}
            </div>

            {/* Input Bar */}
            <div className="glass-card p-2 sm:p-2.5 rounded-3xl border border-white/90 shadow-lg flex gap-2 items-center">
                <input 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && sendUserMessage(text)} 
                    className="flex-grow px-4 py-2 text-xs md:text-sm text-emerald-950 bg-transparent placeholder:text-emerald-800/70 focus:outline-none font-medium" 
                    placeholder="Ask any general knowledge or Islamic studies question..." 
                />
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendUserMessage(text)} 
                    disabled={!text.trim() || isLoading}
                    className="bg-gradient-to-r from-amber-600 to-[#d97706] text-white p-2.5 rounded-2xl disabled:opacity-50 transition-opacity shadow-sm cursor-pointer"
                    aria-label="Send Message"
                >
                    <Send className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    );
};

const DailyReflection = () => {
    const reflections = [
        { en: "Kindness to relatives is an open gateway to Allah's divine pleasure.", ar: "الإحسان إلى الأقارب باب واسع لنيل رضا الله تعالى ومحبته." },
        { en: "A family united by faith and mutual respect is a fortress in times of hardship.", ar: "الأسرة المترابطة بالإيمان والتراحم حصن منيع في مواجهة تحديات الحياة." },
        { en: "Upholding kinship ties brings Barakah to provision and prolongs righteous impact.", ar: "صلة الرحم بركة في الرزق، وطول في الأثر الصالح، ونقاء في القلوب." },
        { en: "The UAE family vision builds upon our timeless Islamic heritage of honoring parents.", ar: "رؤية الأسرة في الإمارات امتداد لنهجنا الإسلامي في بر الوالدين ورعاية الأرحام." }
    ];
    const [item] = useState(() => reflections[Math.floor(Math.random() * reflections.length)]);

    return (
        <div className="glass-card p-5 sm:p-6 rounded-3xl shadow-sm space-y-2 border border-white/90">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Kinship Reflection · تأمل أسري</span>
            </div>
            <p className="font-arabic text-base sm:text-lg text-emerald-950 text-right leading-relaxed font-bold">
                « {item.ar} »
            </p>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold">
                "{item.en}"
            </p>
        </div>
    );
};

const NotificationBanner = () => {
    const verses = [
        { 
            ar: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ", 
            en: "And worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, the needy... (Surah An-Nisa 4:36)" 
        },
        { 
            ar: "وَآتِ ذَا الْقُرْبَىٰ حَقَّهُ وَالْمِسْكِينَ وَابْنَ السَّبِيلِ وَلَا تُبَذِّرْ تَبْذِيرًا", 
            en: "And give the relative his right, and [also] the poor and the traveler, and do not spend wastefully. (Surah Al-Isra 17:26)" 
        },
        { 
            ar: "وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ ۚ إِنَّ اللَّهَ كَانَ عَلَيْكُمْ رَقِيبًا", 
            en: "So fear Allah, through whom you ask one another, and the wombs. Indeed Allah is ever, over you, an Observer. (Surah An-Nisa 4:1)" 
        }
    ];

    const [verse, setVerse] = useState<{ar: string, en: string} | null>(null);

    useEffect(() => {
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem('lastVerseDate');
        const storedVerseRaw = localStorage.getItem('dailyVerse');

        if (lastDate !== today) {
            const randomVerse = verses[Math.floor(Math.random() * verses.length)];
            localStorage.setItem('lastVerseDate', today);
            localStorage.setItem('dailyVerse', JSON.stringify(randomVerse));
            setVerse(randomVerse);
        } else if (storedVerseRaw) {
            try {
                setVerse(JSON.parse(storedVerseRaw));
            } catch (e) {
                const fallbackVerse = { ar: "", en: storedVerseRaw };
                setVerse(fallbackVerse);
                localStorage.setItem('dailyVerse', JSON.stringify(fallbackVerse));
            }
        }
    }, []);

    if (!verse) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-white/90 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden space-y-2.5"
        >
            <div className="flex items-center justify-between pb-2.5 border-b border-emerald-100/70 mb-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>Daily Kinship Verse · آية اليوم</span>
                </div>
                <button 
                    onClick={() => setVerse(null)} 
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-white/80 transition-colors border border-transparent hover:border-white cursor-pointer"
                    aria-label="Dismiss verse"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
            <p className="text-xl md:text-2xl font-arabic text-emerald-950 text-right leading-loose font-bold">
                {verse.ar}
            </p>
            <p className="text-xs md:text-sm text-emerald-900 leading-relaxed font-medium">
                {verse.en}
            </p>
        </motion.div>
    );
};

/**
 * Connected Q&A Component showcasing multi-question interactive learning
 */
const ConnectedQASection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openId, setOpenId] = useState<string | null>('qa1');

    const qaList: QAItem[] = [
        {
            id: 'qa1',
            question: "What does the Hadith promise for upholding kinship ties (صلة الرحم)?",
            questionAr: "ما الذي وعد به الحديث الشريف لمن يصل رحمه؟",
            category: "The Hadith · الحديث الشريف",
            evidence: "Sahih al-Bukhari & Sahih Muslim",
            answer: "The Prophet Muhammad (ﷺ) said: 'Whoever loves that his provision be expanded and his lifespan extended, let him maintain the ties of his kinship' (مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ). It brings Barakah (divine increase) in livelihood, time, health, and righteous legacy."
        },
        {
            id: 'qa2',
            question: "How does the Quranic Verse (Surah An-Nisa 4:36) prioritize the rights of relatives?",
            questionAr: "كيف أكدت الآية الكريمة (سورة النساء: ٣٦) على حق الأقارب؟",
            category: "The Verse · الآية الكريمة",
            evidence: "Surah An-Nisa (4:36)",
            answer: "Allah Almighty commands: 'Worship Allah and associate nothing with Him, and do good to parents and to relatives...' (وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ). This directly links monotheistic worship with fulfilling the rights of parents and kinship relations."
        },
        {
            id: 'qa3',
            question: "How does the 'UAE Year of the Family' translate the kinship chapter into national action?",
            questionAr: "كيف تجسد مبادرة 'عام الأسرة' في دولة الإمارات قيم صلة الرحم؟",
            category: "UAE Family · عام الأسرة",
            evidence: "UAE National Family Cohesion Policy",
            answer: "The UAE Year of the Family champions the Islamic mandate of kinship through national pillars: honoring parents (بر الوالدين), fostering intergenerational cohesion with senior family members, providing family counseling, and ensuring resilient, caring households."
        }
    ];

    const filtered = searchQAItems(qaList, searchQuery);

    return (
        <section className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span>Curriculum Q&A Hub · أسئلة وأجوبة</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-950">
                        Connected Kinship Q&A
                    </h2>
                    <p className="text-xs md:text-sm text-emerald-900 font-medium">
                        Frequently asked questions from the Islamic Studies curriculum on family bonds and UAE heritage.
                    </p>
                </div>

                {/* Search input */}
                <div className="relative min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700" />
                    <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search questions..."
                        className="w-full pl-9 pr-3 py-2 rounded-2xl text-xs bg-white/80 border border-white/90 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-2xs backdrop-blur-md"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filtered.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card rounded-3xl overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setOpenId(isOpen ? null : item.id)}
                                className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/90 transition-colors"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                                        {item.id === 'qa1' && <Quote className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                                        {item.id === 'qa2' && <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                                        {item.id === 'qa3' && <HeartHandshake className="w-3.5 h-3.5 text-rose-700 shrink-0" />}
                                        <span className="font-semibold text-emerald-800">{item.category}</span>
                                        <span aria-hidden="true" className="text-emerald-300">·</span>
                                        <span className="text-amber-800 font-medium">{item.evidence}</span>
                                    </div>
                                    <h3 className="font-bold text-sm md:text-base text-emerald-950">
                                        {item.question}
                                    </h3>
                                    <p className="text-xs text-emerald-700 font-arabic font-medium">
                                        {item.questionAr}
                                    </p>
                                </div>
                                <motion.div 
                                    animate={{ rotate: isOpen ? 180 : 0 }} 
                                    transition={{ duration: 0.2 }}
                                    className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shrink-0 text-emerald-800 shadow-2xs"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="border-t border-white/80 bg-white/50 px-5 pb-5 pt-3 backdrop-blur-sm"
                                    >
                                        <p className="text-xs md:text-sm text-emerald-950 leading-relaxed font-medium">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

const AppleLogoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.68-.82 1.13-1.96.99-3.11-.98.04-2.18.65-2.88 1.47-.62.71-1.16 1.88-1.01 3 .12.01 2.22-.54 2.9-1.36z" />
    </svg>
);

const AndroidLogoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 18c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h4v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.29-1.29c.2-.2.2-.51 0-.71a.498.498 0 0 0-.71 0L14.7 1.58C13.88 1.21 12.98 1 12 1s-1.88.21-2.7.58L7.89.16a.498.498 0 0 0-.71 0c-.2.2-.2.51 0 .71l1.29 1.29C6.88 3.25 6 4.96 6 6.88h12c0-1.92-.88-3.63-2.47-4.72zM9.5 5C9.22 5 9 4.78 9 4.5S9.22 4 9.5 4s.5.22.5.5S9.78 5 9.5 5zm5 0c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
    </svg>
);

const InstallAppModal = ({ onClose }: { onClose: () => void }) => {
    const { isInstallable, isInstalled, isIOS, isAndroid, isWindows, isDesktop, triggerInstall, downloadAppShortcut } = usePWAInstall();
    const [platformTab, setPlatformTab] = useState<'install' | 'ios' | 'android' | 'desktop' | 'qr'>('install');
    const [copied, setCopied] = useState(false);
    const [installing, setInstalling] = useState(false);
    const [installedSuccess, setInstalledSuccess] = useState(isInstalled);
    const [statusNote, setStatusNote] = useState<string | null>(null);
    const appUrl = SHORT_APP_URL;

    const handleCopy = () => {
        navigator.clipboard.writeText(appUrl);
        setCopied(true);
        setStatusNote("📋 Link copied to clipboard!");
        setTimeout(() => setCopied(false), 3000);
        setTimeout(() => setStatusNote(null), 3000);
    };

    const handleDownloadShortcut = () => {
        downloadAppShortcut(appUrl);
        setStatusNote("📥 Programmed Launcher downloaded! Tap to open directly.");
        setTimeout(() => setStatusNote(null), 4000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Kinship & Family in Islam', url: appUrl });
            } catch (err) { console.error('Error sharing:', err); }
        } else {
            handleCopy();
        }
    };

    const handleOneClickInstall = async () => {
        setInstalling(true);
        setStatusNote("Configuring 1-click device installation...");

        // 1. Direct browser installation prompt (Native PWA WebAPK / Desktop PWA)
        if (isInstallable) {
            try {
                const success = await triggerInstall();
                if (success) {
                    setInstalledSuccess(true);
                    setStatusNote("✅ Added directly to your device launcher!");
                    setInstalling(false);
                    return;
                }
            } catch (e) {
                console.warn("triggerInstall error:", e);
            }
        }

        // 2. iOS Safari direct native action sheet
        if (isIOS) {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Kinship & Family in Islam',
                        text: 'Add Kinship & Family in Islam to your Home Screen',
                        url: appUrl,
                    });
                    setStatusNote("Tap 'Add to Home Screen' in the menu");
                } catch {
                    setPlatformTab('ios');
                }
            } else {
                setPlatformTab('ios');
            }
            setInstalling(false);
            return;
        }

        // 3. Android / Windows / Desktop: trigger programmed launcher shortcut
        downloadAppShortcut(appUrl);
        setStatusNote("⚡ Programmed 1-Click Launcher ready! Tap the downloaded file to launch.");
        setInstalling(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-card p-6 sm:p-8 rounded-3xl w-full max-w-lg border border-white/90 shadow-2xl relative text-emerald-950 space-y-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Verified App Badge */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-emerald-200 shadow-md overflow-hidden shrink-0">
                            <img src="/assets/kinship_icon.jpg" alt="App Icon" className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>5.0 Official App</span>
                                <span className="text-emerald-300">·</span>
                                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                <span>PWA Ready</span>
                            </div>
                            <h2 className="text-xl font-extrabold text-emerald-950 tracking-tight">Kinship & Family in Islam</h2>
                            <p className="text-xs text-emerald-800 font-arabic font-bold">صلة الرحم في الإسلام · الإصدار المعتمد</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Success Banner */}
                {installedSuccess && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="p-4 bg-emerald-100/90 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-2xs"
                    >
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                            <p className="font-extrabold">App Added to Home Screen</p>
                            <p className="text-[11px] font-medium text-emerald-800">Launch directly from your device launcher anytime.</p>
                        </div>
                    </motion.div>
                )}

                {/* Vector Platform Navigation Tabs */}
                <div className="grid grid-cols-5 gap-1.5 bg-emerald-100/70 p-1 rounded-2xl text-[10px] font-bold">
                    <button
                        onClick={() => setPlatformTab('install')}
                        className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            platformTab === 'install' ? 'bg-[#065f46] text-white shadow-xs' : 'text-emerald-900 hover:text-emerald-950'
                        }`}
                    >
                        <Download className="w-4 h-4" />
                        <span>Install</span>
                    </button>
                    <button
                        onClick={() => setPlatformTab('qr')}
                        className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            platformTab === 'qr' ? 'bg-[#065f46] text-white shadow-xs' : 'text-emerald-900 hover:text-emerald-950'
                        }`}
                    >
                        <Camera className="w-4 h-4" />
                        <span>Scan</span>
                    </button>
                    <button
                        onClick={() => setPlatformTab('ios')}
                        className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            platformTab === 'ios' ? 'bg-[#065f46] text-white shadow-xs' : 'text-emerald-900 hover:text-emerald-950'
                        }`}
                    >
                        <AppleLogoIcon className="w-4 h-4" />
                        <span>iOS</span>
                    </button>
                    <button
                        onClick={() => setPlatformTab('android')}
                        className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            platformTab === 'android' ? 'bg-[#065f46] text-white shadow-xs' : 'text-emerald-900 hover:text-emerald-950'
                        }`}
                    >
                        <AndroidLogoIcon className="w-4 h-4" />
                        <span>Android</span>
                    </button>
                    <button
                        onClick={() => setPlatformTab('desktop')}
                        className={`py-2 rounded-xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            platformTab === 'desktop' ? 'bg-[#065f46] text-white shadow-xs' : 'text-emerald-900 hover:text-emerald-950'
                        }`}
                    >
                        <Monitor className="w-4 h-4" />
                        <span>Desktop</span>
                    </button>
                </div>

                {/* Tab 1: Direct 1-Click Install */}
                {platformTab === 'install' && (
                    <div className="space-y-4 text-center py-1">
                        <div className="p-5 rounded-2xl bg-white/90 border border-emerald-100 shadow-sm space-y-3">
                            <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                <span>
                                    {isAndroid ? "Android WebAPK Ready · نظام أندرويد" :
                                     isIOS ? "Apple iOS Safari Ready · نظام آبل" :
                                     isWindows ? "Windows PC Ready · نظام ويندوز" : "Direct Installation Engine"}
                                </span>
                            </div>
                            <h3 className="font-extrabold text-base sm:text-lg text-emerald-950">
                                1-Click Device Installation
                            </h3>
                            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                                Standalone full-screen mode, native home screen icon, and offline access across phone, tablet, and PC.
                            </p>

                            {/* Status Banner */}
                            {statusNote && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -4 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="p-3 bg-amber-50 border border-amber-300 text-amber-950 rounded-xl text-xs font-bold text-center"
                                >
                                    {statusNote}
                                </motion.div>
                            )}

                            {/* Guaranteed 1-Click Main Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleOneClickInstall}
                                disabled={installing}
                                className="w-full py-3.5 px-4 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-emerald-950 cursor-pointer active:scale-95"
                            >
                                <Download className="w-4 h-4 text-emerald-950" />
                                <span>
                                    {installing ? "Setting Up Device Launcher..." : 
                                     isInstalled ? "App Ready in Your Launcher ✓" : "1-Click Install to Home Screen · تثبيت فوري"}
                                </span>
                            </motion.button>

                            {/* Alternative 1-Touch Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button 
                                    onClick={handleDownloadShortcut}
                                    className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                    title="Download universal launcher file"
                                >
                                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Download Launcher</span>
                                </button>
                                <button 
                                    onClick={handleCopy}
                                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5 text-slate-600" />
                                    <span>{copied ? "Link Copied!" : "Copy Web URL"}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-[11px] text-emerald-800 font-semibold">
                            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Android & iOS</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5" /> Windows & Mac</span>
                        </div>
                    </div>
                )}

                {/* Tab 2: High Resolution QR Code */}
                {platformTab === 'qr' && (
                    <div className="space-y-4 text-center py-1">
                        <div className="inline-block p-3.5 bg-white rounded-2xl border-2 border-emerald-200 shadow-md">
                            <QRCodeSVG
                                value={appUrl}
                                size={176}
                                level="H"
                                includeMargin
                                fgColor="#022c22"
                                bgColor="#ffffff"
                                className="mx-auto rounded-lg"
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-emerald-950">Scan with Mobile Camera</p>
                            <p className="text-xs text-emerald-900 font-mono font-extrabold bg-emerald-50/80 border border-emerald-100 p-2 rounded-lg tracking-wide select-all">{SHORT_APP_DISPLAY}</p>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                            <span>{copied ? "Link Copied to Clipboard" : "Copy Web URL"}</span>
                        </button>
                    </div>
                )}

                {/* Tab 3: iOS Visual Mockup & Steps */}
                {platformTab === 'ios' && (
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-white/90 border border-emerald-100 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                                    <AppleLogoIcon className="w-4 h-4 text-emerald-900" />
                                    <span>iOS Safari Installation</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">iPhone / iPad</span>
                            </div>

                            <ol className="space-y-2 text-xs text-emerald-950 font-medium">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                                    <span>Open in <strong className="text-emerald-950">Safari</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                                    <span>Tap the <strong className="text-emerald-950">Share</strong> icon.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                                    <span>Tap <strong className="text-emerald-950">"Add to Home Screen"</strong>.</span>
                                </li>
                            </ol>
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <button onClick={handleCopy} className="py-2 rounded-xl border border-emerald-200 bg-white text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                                    <Download className="w-3.5 h-3.5" /> Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 4: Android Visual Mockup & Steps */}
                {platformTab === 'android' && (
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-white/90 border border-emerald-100 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                                    <AndroidLogoIcon className="w-4 h-4 text-emerald-900" />
                                    <span>Android Chrome Installation</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">Chrome</span>
                            </div>

                            <ol className="space-y-2 text-xs text-emerald-950 font-medium">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                                    <span>Open in <strong className="text-emerald-950">Google Chrome</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                                    <span>Tap the <strong className="text-emerald-950">Chrome Menu</strong> (dots).</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                                    <span>Tap <strong className="text-emerald-950">"Install App"</strong>.</span>
                                </li>
                            </ol>
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <button onClick={handleCopy} className="py-2 rounded-xl border border-emerald-200 bg-white text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                                    <Download className="w-3.5 h-3.5" /> Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 5: Desktop Guide */}
                {platformTab === 'desktop' && (
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-white/90 border border-emerald-100 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                                    <Monitor className="w-4 h-4 text-emerald-900" />
                                    <span>Desktop Installation</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">Chrome / Edge</span>
                            </div>

                            <ol className="space-y-2 text-xs text-emerald-950 font-medium">
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                                    <span>Open this web link in <strong className="text-emerald-950">Chrome</strong> or <strong className="text-emerald-950">Edge</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                                    <span>Look for the <strong className="text-emerald-950">"Install"</strong> icon <Download className="w-3.5 h-3.5 inline" /> in the browser address bar.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                                    <span>Click <strong className="text-emerald-950">"Install"</strong> to add as a desktop app.</span>
                                </li>
                            </ol>
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <button onClick={handleCopy} className="py-2 rounded-xl border border-emerald-200 bg-white text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                                    <Download className="w-3.5 h-3.5" /> Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button 
                    onClick={onClose}
                    className="w-full py-2.5 bg-[#065f46] hover:bg-emerald-900 text-white rounded-xl font-extrabold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                    Close Dialog
                </button>
            </motion.div>
        </motion.div>
    );
};

const HomeComponent = ({ onInstallClick, onShareClick, onQrClick }: { onInstallClick: () => void, onShareClick: () => void, onQrClick: () => void }) => {
  return (
    <div className="relative overflow-hidden bg-transparent min-h-screen">
      {/* Subtle soft ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="p-6 md:p-10 space-y-12 max-w-5xl mx-auto relative z-10">
          {/* Project Landing Showcase Banner */}
          <header className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-[#043e2e] text-white shadow-xl border border-emerald-700/60 overflow-hidden space-y-6">
              <motion.div 
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"
              />

              <div className="relative z-10 space-y-5 text-center max-w-3xl mx-auto">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-300/40 text-amber-200 text-xs font-bold tracking-wider uppercase shadow-inner"
                    >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>ISLAMIC STUDIES CURRICULUM PROJECT</span>
                        <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    </motion.div>
                  </div>

                  {/* Animated Written Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                      <AnimatedWriting 
                          text="Specially Created for Islamic Project" 
                          delay={0.1} 
                          stagger={0.035}
                          className="text-amber-100 drop-shadow-sm font-arabic"
                      />
                  </h1>

                  {/* Animated Written Group Members */}
                  <div className="pt-1">
                      <div className="inline-block bg-emerald-950/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-amber-400/40 shadow-lg">
                          <p className="text-xs sm:text-sm md:text-base font-bold text-amber-300 flex items-center justify-center gap-2 tracking-wide">
                              <User className="w-4 h-4 text-amber-400" />
                              <AnimatedWriting 
                                  text="CREATOR: SHAIMAL" 
                                  delay={0.5} 
                                  stagger={0.03}
                                  className="text-amber-200 tracking-wider"
                              />
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          </p>
                      </div>
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed font-normal max-w-2xl mx-auto pt-2">
                      Kinship & Family in Islam (<strong className="text-white font-semibold">صلة الرحم</strong>): Nurturing enduring family cohesion through authentic Quranic commandments, Prophetic Hadiths, and the UAE's national family vision.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                      <Link 
                          to="/chat" 
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-amber-500/20 hover:scale-105 active:scale-95"
                      >
                          <Bot className="w-4 h-4 text-emerald-950" />
                          <span>Ask AI Guide</span>
                      </Link>
                      <Link 
                          to="/teachings" 
                          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                          <BookOpen className="w-4 h-4 text-amber-300" />
                          <span>Explore Hadith &amp; Verse</span>
                      </Link>
                      <Link 
                          to="/hadith-explorer" 
                          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                          <Quote className="w-4 h-4 text-amber-300" />
                          <span>Hadith Explorer</span>
                      </Link>
                      <Link 
                          to="/chapter-summary" 
                          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Chapter Summary</span>
                      </Link>
                      <Link 
                          to="/initiative" 
                          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm backdrop-blur-sm hover:scale-105 active:scale-95"
                      >
                          <HeartHandshake className="w-4 h-4 text-amber-300" />
                          <span>UAE Year of Family</span>
                      </Link>
                      <Link 
                          to="/quiz" 
                          className="inline-flex items-center gap-2 bg-emerald-800/90 hover:bg-emerald-800 text-amber-200 border border-emerald-700/80 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm hover:scale-105 active:scale-95"
                      >
                          <GraduationCap className="w-4 h-4 text-amber-300" />
                          <span>Take 10-Q Quiz</span>
                      </Link>
                  </div>
              </div>
          </header>

        {/* Clean Overview Cards: Curriculum Unit, UAE Family Initiative, and Interactive Tools */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
                { 
                    kicker: "Curriculum Unit · وحدة الدرس",
                    title: "Kinship & Family Chapter", 
                    summaryAr: "حقوق الوالدين والأقارب والتلاحم الأسري",
                    desc: "Islamic Studies curriculum exploring family ties, filial piety (بر الوالدين), and social harmony in Islam.", 
                    icon: BookOpen, 
                    path: "/teachings" 
                },
                { 
                    kicker: "Animated Summary · الملخص المتحرك",
                    title: "Kinship Chapter Summary", 
                    summaryAr: "ملخص تفاعلي مشروح ومتحرك لأحكام صلة الرحم",
                    desc: "Animated summary explaining core principles, divine commandments, and Barakah of family ties.", 
                    icon: Sparkles, 
                    path: "/chapter-summary" 
                },
                { 
                    kicker: "Hadith Explorer · مستكشف الأحاديث",
                    title: "Interactive Hadith Explorer", 
                    summaryAr: "استكشاف الأحاديث النبوية مع تحليل المصطلحات",
                    desc: "Interactive Sahith Hadiths with term highlights, context analysis, and spiritual significance.", 
                    icon: Quote, 
                    path: "/hadith-explorer" 
                },
                { 
                    kicker: "UAE Initiative · عام الأسرة",
                    title: "UAE Year of the Family", 
                    summaryAr: "مبادرة عام الأسرة: ترسيخ قيمة صلة الرحم",
                    desc: "National initiative championing intergenerational solidarity, family stability, and caring households across the UAE.", 
                    icon: HeartHandshake, 
                    path: "/initiative" 
                },
                { 
                    kicker: "Interactive Hub · المركز التفاعلي",
                    title: "10-Q Quiz & AI Guide", 
                    summaryAr: "اختبار تفاعلي ومساعد ذكي للدرس",
                    desc: "Practice with 10 interactive curriculum questions and ask AI Kinship Guide instant Q&A.", 
                    icon: GraduationCap, 
                    path: "/quiz" 
                }
            ].map((feature, i) => (
                <Link to={feature.path} key={i}>
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 * i, duration: 0.35 }}
                        whileHover={{ y: -3 }}
                        className="glass-card glass-card-hover p-5 sm:p-6 rounded-3xl space-y-3 h-full flex flex-col justify-between group cursor-pointer"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="w-9 h-9 rounded-2xl bg-white/80 flex items-center justify-center text-emerald-800 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors shadow-2xs">
                                    <feature.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">{feature.kicker}</span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="font-arabic text-xs text-emerald-950 leading-relaxed text-right font-medium bg-white/70 p-2.5 rounded-xl border border-white/80 shadow-2xs">
                                {feature.summaryAr}
                            </p>
                            <p className="text-emerald-800/90 text-xs leading-relaxed font-normal">
                                {feature.desc}
                            </p>
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 group-hover:text-amber-700 flex items-center gap-1 pt-1 transition-colors">
                            <span>Open Section</span>
                            <span>→</span>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </section>

        {/* Connected Q&A Hub */}
        <ConnectedQASection />
        
        {/* Daily Reflection */}
        <DailyReflection />
    </div>
  </div>
  );
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// ... inside TeachingsComponent
const TeachingsComponent = () => {
  const [filter, setFilter] = useState('All');
  const items = [
    { 
      title: "The Prophetic Hadith on Kinship", 
      titleAr: "الحديث الشريف في فضل صلة الرحم والبركة",
      category: "Hadith", 
      content: "Whoever loves that his provision be expanded and his lifespan extended, let him maintain the ties of his kinship.", 
      source: "Sahih al-Bukhari & Sahih Muslim", 
      contentAr: "مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ", 
      sourceAr: "صحيح البخاري وصحيح مسلم",
      reflection: "In the Islamic kinship chapter, the Prophet (ﷺ) reveals that Silat ar-Rahim is an active source of Barakah—expanding lawful wealth, preserving physical and spiritual vitality, and extending an honorable legacy.",
      reflectionAr: "في درس صلة الرحم، يبين النبي ﷺ أن الإحسان للأقارب وزيارتهم سبب مباشر للبركة في الرزق، وطول الأثر الصالح، ونيل محبة الله ورضوانه."
    },
    { 
      title: "The Quranic Verse on Kinship", 
      titleAr: "الآية الكريمة في الأمر بصلة ذوي القربى",
      category: "Quran", 
      content: "Worship Allah and associate nothing with Him, and do good to parents and to relatives, orphans, and the needy.", 
      source: "Surah An-Nisa (4:36)", 
      contentAr: "وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ وَالْيَتَامَىٰ وَالْمَسَاكِينِ", 
      sourceAr: "سورة النساء: آية ٣٦",
      reflection: "The Holy Quran couples the worship of Allah with Birr al-Walidayn (goodness to parents) and kindness to relatives (Dhi al-Qurba), establishing kinship as a core divine obligation.",
      reflectionAr: "قرن الله تعالى توحيده وعبادته بالإحسان للوالدين وصلة الأقارب، تأكيداً على أن حقوق الأسرة والرحم من أعظم الواجبات الدينية."
    }
  ];

  const categories = ['All', 'Hadith', 'Quran'];
  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);
  
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
        <header className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Kinship Chapter · الوحي الشريف (صلة الرحم)</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950">The Hadith & The Verse</h2>
            <p className="text-xs md:text-sm text-emerald-800 font-normal">
                Authentic Prophetic Hadith and Quranic Verse on family kinship in both Arabic and English.
            </p>
        </header>

        {/* Filter */}
        <div className="flex gap-2 p-1.5 bg-emerald-100/60 rounded-xl w-fit">
            {categories.map(cat => {
                const isActive = filter === cat;
                const label = cat === 'All' ? 'All (الكل)' : cat === 'Hadith' ? 'The Hadith (الحديث)' : 'The Verse (الآية)';
                const IconComponent = cat === 'All' ? Sparkles : cat === 'Hadith' ? Quote : BookOpen;
                return (
                    <button 
                        key={cat} 
                        onClick={() => setFilter(cat)} 
                        className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            isActive ? 'text-white' : 'text-emerald-900 hover:text-emerald-950'
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeFilterPill"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute inset-0 bg-emerald-800 rounded-lg shadow-xs"
                            />
                        )}
                        <IconComponent className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">{label}</span>
                    </button>
                );
            })}
        </div>

        {/* Cards Grid */}
        <motion.div layout className="space-y-5">
            <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                    <motion.div 
                        key={item.title} 
                        layout 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card 
                            icon={item.category === 'Quran' 
                                ? <BookOpen className="w-5 h-5 text-emerald-800" /> 
                                : <Quote className="w-5 h-5 text-amber-700" />
                            } 
                            title={item.title} 
                            titleAr={item.titleAr}
                            category={item.category === 'Quran' ? 'The Verse · آية صلة الرحم' : 'The Hadith · حديث صلة الرحم'}
                            content={item.content} 
                            source={item.source} 
                            contentAr={item.contentAr} 
                            sourceAr={item.sourceAr} 
                            reflection={item.reflection}
                            reflectionAr={item.reflectionAr}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    </motion.div>
  );
};

const InitiativeComponent = () => (
  <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
    <header className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span>Kinship Chapter · عام الأسرة في دولة الإمارات</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950">UAE Year of the Family</h2>
      <p className="text-xs md:text-sm text-emerald-800 max-w-2xl font-normal">
        Strengthening family cohesion, intergenerational care, and Islamic kinship values across the United Arab Emirates.
      </p>
    </header>

    {/* Overview Card */}
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs border border-white">
          <HeartHandshake className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h3 className="font-extrabold text-lg text-emerald-950">UAE Year of the Family Initiative</h3>
          <p className="text-xs text-emerald-800 font-arabic font-semibold">مبادرة عام الأسرة: قيم صلة الرحم والتلاحم الأسري</p>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
          In the Islamic Studies curriculum, the UAE Year of the Family is highlighted as a strategic national embodiment of <strong className="font-extrabold text-emerald-950">Silat ar-Rahim (Kinship)</strong>. The initiative emphasizes that the family is the indispensable foundation of social security, emotional well-being, and ethical leadership.
        </p>
        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-arabic text-right font-bold">
          تجسد مبادرة عام الأسرة في دولة الإمارات العربية المتحدة الرؤية الإسلامية لصلة الرحم، حيث تعد الأسرة النواة الأساسية لبناء مجتمع متماسك تسوده المودة والرحمة وبر الوالدين ورعاية الأقارب.
        </p>
      </div>

      <blockquote className="p-4 sm:p-5 rounded-2xl bg-white/70 border border-white/90 space-y-2 shadow-2xs backdrop-blur-sm">
        <p className="text-xs sm:text-sm text-emerald-950 font-medium italic">
          "The family is the foundation upon which the future of our nation is built. When the family is strong, the whole nation is strong."
        </p>
        <p className="text-xs sm:text-sm font-arabic text-emerald-950 text-right font-bold">
          « إن الأسرة هي الأساس المتين الذي يُبنى عليه مستقبل أمتنا، وبتماسكها وصلة أرحامها يقوى الوطن »
        </p>
        <div className="text-[11px] font-bold text-emerald-800 text-right">
          — UAE Founding Wisdom · حكمة قيادة الإمارات
        </div>
      </blockquote>
    </motion.div>

    {/* Four Pillars Grid */}
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        {
          title: "1. Devotion to Parents",
          titleAr: "١. بر الوالدين",
          desc: "Treating parents with utmost honor, humility, and care as commanded in the Quranic verse (4:36).",
          descAr: "الإحسان إلى الوالدين وخفض جناح الذل لهما بالرحمة والقول الكريم.",
          icon: HandHeart
        },
        {
          title: "2. Preserving Kinship",
          titleAr: "٢. صلة الرحم",
          desc: "Active communication, visitation, and providing mutual assistance to all relatives in joys and challenges.",
          descAr: "التواصل الدائم وتفقد أحوال الأقارب ومشاركتهم في السراء والضراء.",
          icon: Network
        },
        {
          title: "3. Mutual Compassion",
          titleAr: "٣. المودة والرحمة",
          desc: "Nurturing gentleness, mutual respect, and emotional warmth across all family members.",
          descAr: "إشاعة المحبة والسكينة والرحمة داخل البيت والتغافر والتراحم.",
          icon: Heart
        },
        {
          title: "4. Intergenerational Solidarity",
          titleAr: "٤. التماسك والتضامن الأسري",
          desc: "Honoring senior citizens as roots of wisdom and passing authentic cultural values to youth.",
          descAr: "رعاية كبار المواطنين والاستفادة من حكمتهم ونقل القيم الأصيلة للأجيال القادمة.",
          icon: ShieldCheck
        }
      ].map((pillar, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -3 }}
          className="glass-card glass-card-hover p-5 rounded-3xl space-y-2.5 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-emerald-800 shadow-2xs border border-white">
              <pillar.icon className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-xs font-arabic font-bold text-emerald-900">{pillar.titleAr}</span>
          </div>
          <h4 className="font-extrabold text-sm text-emerald-950">{pillar.title}</h4>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">{pillar.desc}</p>
          <p className="text-xs text-emerald-900 leading-relaxed font-arabic text-right font-semibold">{pillar.descAr}</p>
        </motion.div>
      ))}
    </div>

    {/* Quiz Banner */}
    <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-white/90">
      <div>
        <h4 className="font-extrabold text-sm text-emerald-950">Test your understanding of the kinship chapter</h4>
        <p className="text-xs text-emerald-800 font-medium">Explore 10 focused curriculum questions on the Hadith, the Verse, and the UAE Year of the Family.</p>
      </div>
      <Link to="/quiz" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-xs font-bold transition-all shadow-md shrink-0">
        Start Kinship Quiz
      </Link>
    </div>
  </div>
);

function Card({ 
  icon, 
  title, 
  titleAr,
  category,
  content, 
  source, 
  contentAr, 
  sourceAr,
  reflection,
  reflectionAr
}: { 
  icon: React.ReactNode;
  title: string; 
  titleAr?: string;
  category?: string;
  content: string; 
  source: string; 
  contentAr?: string; 
  sourceAr?: string;
  reflection?: string;
  reflectionAr?: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const handleShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: title,
                  text: `"${content}" - ${source}`,
                  url: SHORT_APP_URL
              });
          } catch (err) {
              console.error('Error sharing:', err);
          }
      } else {
          navigator.clipboard?.writeText(`"${content}" - ${source} (${SHORT_APP_URL})`).catch(() => {});
      }
  };

  const handleListen = () => {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterances: SpeechSynthesisUtterance[] = [];

    if (contentAr) {
      const arUt = new SpeechSynthesisUtterance(contentAr);
      arUt.lang = 'ar-SA';
      arUt.rate = 0.9;
      utterances.push(arUt);
    }

    if (content) {
      const enUt = new SpeechSynthesisUtterance(content);
      enUt.lang = 'en-US';
      enUt.rate = 0.95;
      utterances.push(enUt);
    }

    if (utterances.length === 0) return;

    let idx = 0;
    setIsSpeaking(true);

    const playNext = () => {
      if (idx >= utterances.length) {
        setIsSpeaking(false);
        return;
      }
      const u = utterances[idx];
      u.onend = () => {
        idx++;
        playNext();
      };
      u.onerror = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(u);
    };

    playNext();
  };

  return (
    <div className="glass-card glass-card-hover p-6 sm:p-7 rounded-3xl space-y-4 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs border border-white">
            {icon}
          </div>
          <div>
            {category && (
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                {category}
              </div>
            )}
            <h3 className="font-extrabold text-base sm:text-lg text-emerald-950 leading-snug">{title}</h3>
            {titleAr && <p className="text-xs text-emerald-800 font-arabic font-semibold">{titleAr}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={handleListen}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-2xs ${
              isSpeaking ? 'bg-amber-100 text-amber-800 animate-pulse border border-amber-300' : 'bg-white/80 text-emerald-800 hover:bg-white border border-white/90'
            }`}
            title={isSpeaking ? "Stop speaking" : "Listen in Arabic & English"}
            aria-label="Listen to teaching"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleShare}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/80 text-emerald-800 hover:bg-white transition-all shadow-2xs border border-white/90"
            title="Share"
            aria-label="Share teaching"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-2xs border ${
              isFavorite ? 'text-amber-600 bg-amber-50 border-amber-300' : 'bg-white/80 text-emerald-800 hover:bg-white border-white/90'
            }`}
            title="Bookmark"
            aria-label="Bookmark teaching"
          >
            <Bookmark className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Scripture Panel (Arabic) */}
      {contentAr && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-white text-right space-y-1.5 shadow-xs backdrop-blur-md">
          <p className="font-arabic text-xl sm:text-2xl font-bold leading-loose text-emerald-950">
            « {contentAr} »
          </p>
          {sourceAr && (
            <p className="text-xs font-arabic text-amber-900 font-bold">
              — {sourceAr}
            </p>
          )}
        </div>
      )}

      {/* English Translation */}
      <div className="space-y-1 p-2">
        <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-semibold">
          "{content}"
        </p>
        <p className="text-xs font-bold text-emerald-800">
          — {source}
        </p>
      </div>

      {/* Reflections / Textbook meaning */}
      {(reflection || reflectionAr) && (
        <div className="pt-3 border-t border-emerald-100/80 space-y-1.5 text-xs text-emerald-950 p-2 bg-emerald-50/50 rounded-2xl border border-emerald-100/60">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kinship Lesson · دلالة الدرس الأسرية</span>
          </div>
          {reflection && <p className="leading-relaxed font-medium">{reflection}</p>}
          {reflectionAr && <p className="leading-relaxed font-arabic text-right font-semibold">{reflectionAr}</p>}
        </div>
      )}
    </div>
  );
}

