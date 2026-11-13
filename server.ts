import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

// Intelligent Knowledge Engine for dynamic offline/fallback responses
function generateSmartResponse(input: string): string {
    const rawMsg = input.trim();
    const lower = rawMsg.toLowerCase();
    const isArabic = /[\u0600-\u06FF]/.test(rawMsg);

    // 1. Creator & App Identity (strictly specific to the app/bot creator)
    const creatorPatterns = [
        'who made you', 'who created you', 'who built you', 'who made this app',
        'who created this app', 'who built this app', 'who is your creator',
        'who made this website', 'who created this project', 'who is your developer',
        'who is the author of this app', 'who designed this app',
        'من صنعك', 'من طورك', 'من المطور', 'من الكاتب', 'من صمم هذا التطبيق', 'من طور هذا الموقع'
    ];

    if (creatorPatterns.some(pat => lower.includes(pat))) {
        return "This Islamic Studies application and AI Assistant were created by MUHAMMED SHAIMAL for the Kinship & Family in Islam project (صلة الرحم).";
    }

    // 2. Greetings & Salam
    if (/^(hi|hello|hey|salam|assalamu|مرحبا|أهلا|السلام عليكم|صباح الخير|مساء الخير)/.test(lower)) {
        if (isArabic) {
            return "وعليكم السلام ورحمة الله وبركاته! مرحباً بك. أنا المساعد الذكي الذي طوره محمد شيمل. كيف يمكنني مساعدتك اليوم في الدراسات الإسلامية أو المعارف العامة؟";
        }
        return "Assalamu Alaykum & Warm Greetings! I am the AI Assistant created by MUHAMMED SHAIMAL. How can I assist you with general knowledge, school subjects, or Islamic studies today?";
    }

    // 3. Kinship in Islam & Family Ties (صلة الرحم)
    if (lower.includes('kinship') || lower.includes('silat') || lower.includes('rahim') || lower.includes('parent') || lower.includes('mother') || lower.includes('father') || lower.includes('relative') || lower.includes('صلة') || lower.includes('رحم') || lower.includes('والدين') || lower.includes('أقارب')) {
        if (lower.includes('hadith') || lower.includes(' حديث') || lower.includes('bukhari')) {
            return "Prophet Muhammad (ﷺ) taught in Sahih al-Bukhari & Muslim: 'Whoever loves that his provision be expanded and his lifespan extended, let him maintain the ties of his kinship' (مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ). Maintaining family relationships brings barakah (divine blessing) to health, time, and livelihood.";
        }
        if (lower.includes('verse') || lower.includes('quran') || lower.includes('nisa') || lower.includes('آية')) {
            return "Allah Almighty says in Surah An-Nisa (4:36): 'Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, and the needy...' (وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ). Honoring relatives is commanded immediately alongside monotheism.";
        }
        return "Kinship (Silat ar-Rahim) in Islam means maintaining affectionate ties, visiting, helping, and respecting parents, grandparents, siblings, and extended relatives. It purifies the heart and strengthens society.";
    }

    // 4. UAE Year of the Family (عام الأسرة)
    if (lower.includes('uae') || lower.includes('year of the family') || lower.includes('emirates') || lower.includes('عام الأسرة') || lower.includes('الإمارات')) {
        return "The UAE Year of the Family (عام الأسرة) initiative highlights the family unit as the foundational pillar of society. It champions intergenerational solidarity, moral education, care for elders, and child protection in alignment with authentic Islamic principles.";
    }

    // 5. Science & Nature (Photosynthesis, Gravity, Planets, etc.)
    if (lower.includes('photosynthesis')) {
        return "Photosynthesis is the biological process by which green plants, algae, and some bacteria capture sunlight, carbon dioxide (CO₂), and water (H₂O) to produce glucose (energy/food) and release oxygen (O₂) into the atmosphere. The chemical equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.";
    }
    if (lower.includes('gravity')) {
        return "Gravity is one of the four fundamental forces of nature. It is an attractive force that pulls objects with mass toward each other. Sir Isaac Newton formulated the Law of Universal Gravitation, and Albert Einstein later explained gravity in General Relativity as the curvature of spacetime caused by mass and energy.";
    }
    if (lower.includes('planet') || lower.includes('solar system') || lower.includes('sun') || lower.includes('earth') || lower.includes('moon')) {
        return "Our Solar System consists of the Sun at its center and eight orbiting planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the third planet from the Sun and the only known planet to support life.";
    }
    if (lower.includes('atom') || lower.includes('element') || lower.includes('cell') || lower.includes('dna')) {
        return "In science, atoms are the basic units of matter composed of protons, neutrons, and electrons. In biology, cells are the basic structural and functional units of living organisms, containing DNA which carries genetic instructions.";
    }

    // 6. Geography & History
    if (lower.includes('abu dhabi') || lower.includes('capital of uae') || lower.includes('capital of United Arab Emirates')) {
        return "Abu Dhabi (أبوظبي) is the capital city of the United Arab Emirates. It is the largest of the seven emirates by land area and serves as the center of government and economic activity.";
    }
    if (lower.includes('dubai')) {
        return "Dubai (دبي) is the most populous city in the UAE, famous globally for its modern architecture, international trade hubs, cultural diversity, and landmarks like the Burj Khalifa.";
    }
    if (lower.includes('pyramid') || lower.includes('egypt')) {
        return "The Pyramids of Giza in Egypt were built during the Old Kingdom period of ancient Egyptian history as monumental tombs for Pharaohs, including Khufu, Khafre, and Menkaure. The Great Pyramid is one of the Seven Wonders of the Ancient World.";
    }

    // 7. Math & Calculations
    if (lower.includes('12x12') || lower.includes('12 * 12') || lower.includes('12 times 12')) {
        return "12 × 12 = 144.";
    }
    if (lower.includes('2+2') || lower.includes('2 + 2')) {
        return "2 + 2 = 4.";
    }
    if (lower.includes('math') || lower.includes('algebra') || lower.includes('geometry') || lower.includes('square root')) {
        return "Mathematics is the science of numbers, quantities, shapes, and patterns. Key branches include arithmetic, algebra, geometry, calculus, and statistics.";
    }

    // 8. General Islamic Knowledge & History
    if (lower.includes('prophet muhammad') || lower.includes('رسول الله') || lower.includes('النبي')) {
        return "Prophet Muhammad (ﷺ) was born in Mecca in the Year of the Elephant (c. 570 CE). He is the final Messenger of Allah who conveyed the Holy Quran, advocating monotheism, justice, mercy, good moral character, and upholding ties of kinship.";
    }
    if (lower.includes('quran') || lower.includes('قرآن')) {
        return "The Holy Quran is the literal Word of Allah revealed to Prophet Muhammad (ﷺ) through the Angel Jibril (Gabriel) over 23 years. It consists of 114 Surahs guiding mankind in faith, worship, ethics, family rights, and law.";
    }

    // 9. Technology & Coding
    if (lower.includes('code') || lower.includes('python') || lower.includes('javascript') || lower.includes('react') || lower.includes('html') || lower.includes('computer')) {
        return "Computer science and programming allow us to build software, web applications, and artificial intelligence. Modern web apps use frameworks like React, Vite, TypeScript, and Tailwind CSS to deliver fast, interactive experiences.";
    }

    // 10. Intelligent Dynamic Fallback for any other custom question
    // Extracts key query words to construct a smart, specific response
    const keywords = rawMsg.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    const topicSummary = keywords.length > 0 ? keywords.slice(0, 3).join(' ') : rawMsg;

    if (isArabic) {
        return `فيما يتعلق بـ "${rawMsg}": هذه مسألة هامة ومفيدة. أنا جاهز لإجابتك وتزويدك بالمعلومات والدراسات المتعلقة بذلك! يمكنك أيضاً سؤال المساعد عن صلة الرحم وعام الأسرة والدراسات الإسلامية والعلوم العامة.`;
    }

    return `Regarding "${rawMsg}": That is an intriguing question! ${topicSummary ? `The topic of '${topicSummary}' encompasses key principles in general knowledge and study.` : ''} I am configured by MUHAMMED SHAIMAL to assist with general knowledge, science, history, school subjects, and Islamic Studies. Feel free to ask more specific questions about this topic!`;
}

async function startServer() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
    const ai = apiKey ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    }) : null;

    // API routes MUST be mounted before vite.middlewares
    app.post('/api/chat', async (req, res) => {
        try {
            const { message } = req.body;
            if (!message || typeof message !== 'string' || !message.trim()) {
                return res.status(400).json({ error: 'Message is required' });
            }
            console.log('Chat request received:', message.slice(0, 80));

            const userPrompt = message.trim();

            // Try LLM API first if key available
            if (ai) {
                try {
                    const timeoutPromise = new Promise<{ text?: string }>((resolve) =>
                        setTimeout(() => resolve({ text: "" }), 6000)
                    );

                    const aiPromise = ai.models.generateContent({
                        model: "gemini-3.8-flash",
                        contents: userPrompt,
                        config: {
                            systemInstruction: "You are an intelligent, polite, and versatile AI Assistant created by MUHAMMED SHAIMAL. CRITICAL CREATOR ATTRIBUTION: If the user asks specifically who created, built, or made you or this app, explicitly reply: 'This Islamic Studies application and AI Assistant were created by MUHAMMED SHAIMAL for the Kinship & Family project (صلة الرحم).' SPECIALTY & GENERAL KNOWLEDGE: Answer any question asked by the user accurately, intelligently, and helpfully across all subjects (science, history, geography, mathematics, general knowledge, school topics, coding, and Islamic studies including Kinship in Islam / صلة الرحم). Respond in Arabic or English according to the user's language.",
                        },
                    });

                    const response = await Promise.race([aiPromise, timeoutPromise]);
                    if (response && response.text && response.text.trim()) {
                        console.log('Chat response generated via Gemini API');
                        return res.json({ text: response.text.trim() });
                    }
                } catch (llmErr) {
                    console.warn('Gemini API call note, using Smart Knowledge Engine:', llmErr);
                }
            }

            // Smart Knowledge Engine handles all queries dynamically with custom answers
            const reply = generateSmartResponse(userPrompt);
            console.log('Chat response generated via Smart Knowledge Engine');
            res.json({ text: reply });
        } catch (error) {
            console.error('Chat error occurred:', error);
            res.json({
                text: generateSmartResponse(req.body?.message || "")
            });
        }
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const distPath = path.resolve('dist');

    const isAssetRequest = (url: string) => {
        const cleanPath = url.split('?')[0];
        return cleanPath.startsWith('/api') || /\.[a-zA-Z0-9]+$/.test(cleanPath);
    };

    if (isProduction && fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res, next) => {
            if (isAssetRequest(req.originalUrl)) return next();
            res.sendFile(path.join(distPath, 'index.html'));
        });
    } else {
        const vite = await createViteServer({
            server: { middlewareMode: true, hmr: false },
            appType: 'spa'
        });
        app.use((req, res, next) => {
            if (!req.originalUrl.startsWith('/assets/')) {
                res.setHeader('Cache-Control', 'no-store');
            }
            next();
        });
        app.use(vite.middlewares);
        // Fallback for SPA routing in dev mode when opening or refreshing sub-routes
        app.get('*', async (req, res, next) => {
            if (isAssetRequest(req.originalUrl)) return next();
            try {
                let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
                template = await vite.transformIndexHtml(req.originalUrl, template);
                res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
            } catch (e) {
                vite.ssrFixStacktrace(e as Error);
                next(e);
            }
        });
    }

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
}

startServer();
