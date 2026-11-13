import { GoogleGenAI } from '@google/genai';

interface ChatRequest {
  method?: string;
  body?: { message?: unknown } | string;
}

interface ChatResponse {
  status: (code: number) => ChatResponse;
  json: (data: Record<string, unknown>) => void;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
}

function generateSmartResponse(input: string): string {
  const rawMsg = input.trim();
  const lower = rawMsg.toLowerCase();
  const isArabic = /[\u0600-\u06FF]/.test(rawMsg);

  const creatorPatterns = [
    'who made you', 'who created you', 'who built you', 'who made this app',
    'who created this app', 'who built this app', 'who is your creator',
    'who made this website', 'who created this project', 'who is your developer',
    'who is the author of this app', 'who designed this app',
    'من صنعك', 'من طورك', 'من المطور', 'من الكاتب', 'من صمم هذا التطبيق', 'من طور هذا الموقع',
  ];

  if (creatorPatterns.some((pat) => lower.includes(pat))) {
    return 'This Islamic Studies application and AI Assistant were created by MUHAMMED SHAIMAL for the Kinship & Family in Islam project (صلة الرحم).';
  }

  if (/^(hi|hello|hey|salam|assalamu|مرحبا|أهلا|السلام عليكم|صباح الخير|مساء الخير)/.test(lower)) {
    if (isArabic) {
      return 'وعليكم السلام ورحمة الله وبركاته! مرحباً بك. أنا المساعد الذكي الذي طوره محمد شيمل. كيف يمكنني مساعدتك اليوم في الدراسات الإسلامية أو المعارف العامة؟';
    }
    return 'Assalamu Alaykum & Warm Greetings! I am the AI Assistant created by MUHAMMED SHAIMAL. How can I assist you with general knowledge, school subjects, or Islamic studies today?';
  }

  if (
    lower.includes('kinship') || lower.includes('silat') || lower.includes('rahim') ||
    lower.includes('parent') || lower.includes('mother') || lower.includes('father') ||
    lower.includes('relative') || lower.includes('صلة') || lower.includes('رحم') ||
    lower.includes('والدين') || lower.includes('أقارب')
  ) {
    if (lower.includes('hadith') || lower.includes('حديث') || lower.includes('bukhari')) {
      return "Prophet Muhammad (ﷺ) taught in Sahih al-Bukhari & Muslim: 'Whoever loves that his provision be expanded and his lifespan extended, let him maintain the ties of his kinship' (مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ). Maintaining family relationships brings barakah (divine blessing) to health, time, and livelihood.";
    }
    if (lower.includes('verse') || lower.includes('quran') || lower.includes('nisa') || lower.includes('آية')) {
      return "Allah Almighty says in Surah An-Nisa (4:36): 'Worship Allah and associate nothing with Him, and to parents do good, and to relatives, orphans, and the needy...' (وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا وَبِذِي الْقُرْبَىٰ). Honoring relatives is commanded immediately alongside monotheism.";
    }
    return 'Kinship (Silat ar-Rahim) in Islam means maintaining affectionate ties, visiting, helping, and respecting parents, grandparents, siblings, and extended relatives. It purifies the heart and strengthens society.';
  }

  if (lower.includes('uae') || lower.includes('year of the family') || lower.includes('emirates') || lower.includes('عام الأسرة') || lower.includes('الإمارات')) {
    return 'The UAE Year of the Family (عام الأسرة) initiative highlights the family unit as the foundational pillar of society. It champions intergenerational solidarity, moral education, care for elders, and child protection in alignment with authentic Islamic principles.';
  }

  if (lower.includes('photosynthesis')) {
    return 'Photosynthesis is the biological process by which green plants, algae, and some bacteria capture sunlight, carbon dioxide (CO₂), and water (H₂O) to produce glucose (energy/food) and release oxygen (O₂) into the atmosphere. The chemical equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.';
  }
  if (lower.includes('gravity')) {
    return 'Gravity is one of the four fundamental forces of nature. It is an attractive force that pulls objects with mass toward each other. Sir Isaac Newton formulated the Law of Universal Gravitation, and Albert Einstein later explained gravity in General Relativity as the curvature of spacetime caused by mass and energy.';
  }
  if (lower.includes('planet') || lower.includes('solar system') || lower.includes('sun') || lower.includes('earth') || lower.includes('moon')) {
    return 'Our Solar System consists of the Sun at its center and eight orbiting planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the third planet from the Sun and the only known planet to support life.';
  }
  if (lower.includes('abu dhabi') || lower.includes('capital of uae') || lower.includes('capital of united arab emirates')) {
    return 'Abu Dhabi (أبوظبي) is the capital city of the United Arab Emirates. It is the largest of the seven emirates by land area and serves as the center of government and economic activity.';
  }
  if (lower.includes('dubai')) {
    return 'Dubai (دبي) is the most populous city in the UAE, famous globally for its modern architecture, international trade hubs, cultural diversity, and landmarks like the Burj Khalifa.';
  }
  if (lower.includes('prophet muhammad') || lower.includes('رسول الله') || lower.includes('النبي')) {
    return 'Prophet Muhammad (ﷺ) was born in Mecca in the Year of the Elephant (c. 570 CE). He is the final Messenger of Allah who conveyed the Holy Quran, advocating monotheism, justice, mercy, good moral character, and upholding ties of kinship.';
  }
  if (lower.includes('quran') || lower.includes('قرآن')) {
    return 'The Holy Quran is the literal Word of Allah revealed to Prophet Muhammad (ﷺ) through the Angel Jibril (Gabriel) over 23 years. It consists of 114 Surahs guiding mankind in faith, worship, ethics, family rights, and law.';
  }

  const keywords = rawMsg.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '').split(/\s+/).filter((w) => w.length > 3);
  const topicSummary = keywords.length > 0 ? keywords.slice(0, 3).join(' ') : rawMsg;

  if (isArabic) {
    return `فيما يتعلق بـ "${rawMsg}": هذه مسألة هامة ومفيدة. أنا جاهز لإجابتك وتزويدك بالمعلومات والدراسات المتعلقة بذلك! يمكنك أيضاً سؤال المساعد عن صلة الرحم وعام الأسرة والدراسات الإسلامية والعلوم العامة.`;
  }

  return `Regarding "${rawMsg}": That is an intriguing question! ${topicSummary ? `The topic of '${topicSummary}' encompasses key principles in general knowledge and study.` : ''} I am configured by MUHAMMED SHAIMAL to assist with general knowledge, science, history, school subjects, and Islamic Studies. Feel free to ask more specific questions about this topic!`;
}

export default async function handler(req: ChatRequest, res: ChatResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let parsedBody: { message?: unknown } = {};
  if (typeof req.body === 'string') {
    try {
      parsedBody = JSON.parse(req.body) as { message?: unknown };
    } catch {
      parsedBody = {};
    }
  } else if (req.body && typeof req.body === 'object') {
    parsedBody = req.body;
  }

  const message = parsedBody.message;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const userPrompt = message.trim();

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const timeoutPromise = new Promise<{ text?: string }>((resolve) =>
          setTimeout(() => resolve({ text: '' }), 6000)
        );
        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction:
              "You are an intelligent, polite, and versatile AI Assistant created by MUHAMMED SHAIMAL. CRITICAL CREATOR ATTRIBUTION: If the user asks specifically who created, built, or made you or this app, explicitly reply: 'This Islamic Studies application and AI Assistant were created by MUHAMMED SHAIMAL for the Kinship & Family project (صلة الرحم).' SPECIALTY & GENERAL KNOWLEDGE: Answer any question asked by the user accurately, intelligently, and helpfully across all subjects (science, history, geography, mathematics, general knowledge, school topics, coding, and Islamic studies including Kinship in Islam / صلة الرحم). Respond in Arabic or English according to the user's language.",
          },
        });

        const response = await Promise.race([aiPromise, timeoutPromise]);
        if (response && response.text && response.text.trim()) {
          return res.status(200).json({ text: response.text.trim() });
        }
      } catch (llmErr) {
        console.warn('Gemini API fallback triggered:', llmErr);
      }
    }

    return res.status(200).json({ text: generateSmartResponse(userPrompt) });
  } catch {
    return res.status(200).json({ text: generateSmartResponse(userPrompt) });
  }
}
