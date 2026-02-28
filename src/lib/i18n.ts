import { createContext, useContext } from "react";

export type Locale = "zh-TW" | "en-US";

const translations = {
  "zh-TW": {
    brand: "Daily Reset",
    tagline: "只要 3 分鐘，讓自己被理解一次",
    startCta: "開始今天的整理",
    loginCta: "以 Email 登入",
    loginPlaceholder: "your@email.com",
    loginSend: "發送登入連結",
    loginHint: "我們會寄一封魔法連結到你的信箱",
    oauthSoon: "即將推出",
    homeGreeting: "嗨，歡迎回來",
    homeSuggestion: "最近你常提到工作責任變重，想從這裡開始嗎？",
    acceptSuggestion: "接受建議",
    overrideSuggestion: "我想說別的",
    recentThemes: "最近主題",
    resetTitle: "今天的整理",
    changeTopicBtn: "換個方向",
    acceptBtn: "好，就這個",
    emotionStress: "壓力",
    emotionDoubt: "懷疑",
    emotionStuck: "卡住",
    userInputPlaceholder: "想說什麼呢？（120 字以內）",
    userInputSubmit: "送出",
    chooseEmotion: "請選擇最接近你的感受",
    reflectionTitle: "你的牌",
    resonatePrompt: "這句最像我",
    finishReflection: "完成",
    sessionEndTitle: "今天的整理紀錄",
    sessionConfidence: "共鳴程度",
    pickResonance: "選一句最有感的",
    done: "Done",
    saveClose: "儲存並關閉",
    streakLabel: "連續天數",
    journeyTitle: "你的旅程",
    settingsTitle: "設定",
    languageLabel: "語言",
    deleteMemory: "刪除記憶",
    anonymousMode: "匿名模式",
    aiPersonaDesc: "我是你的陪伴者，不是老師。我不會給建議，只是陪你把感受說清楚。",
    loading: "整理中⋯⋯ 一點點耐心",
    theme_work: "工作",
    theme_relationship: "關係",
    theme_self: "自我",
    theme_future: "未來",
  },
  "en-US": {
    brand: "Daily Reset",
    tagline: "3 minutes to feel understood",
    startCta: "Start today's reset",
    loginCta: "Sign in with Email",
    loginPlaceholder: "your@email.com",
    loginSend: "Send magic link",
    loginHint: "We'll send a magic link to your inbox",
    oauthSoon: "Coming soon",
    homeGreeting: "Hi, welcome back",
    homeSuggestion: "You've recently mentioned heavier responsibilities at work—would you like to start there?",
    acceptSuggestion: "Accept suggestion",
    overrideSuggestion: "I want to say something else",
    recentThemes: "Recent themes",
    resetTitle: "Today's reset",
    changeTopicBtn: "Change direction",
    acceptBtn: "Yes, let's go",
    emotionStress: "Stress",
    emotionDoubt: "Doubt",
    emotionStuck: "Stuck",
    userInputPlaceholder: "What's on your mind? (120 chars)",
    userInputSubmit: "Submit",
    chooseEmotion: "Choose what feels closest",
    reflectionTitle: "Your card",
    resonatePrompt: "This resonates most",
    finishReflection: "Finish",
    sessionEndTitle: "Today's reflection notes",
    sessionConfidence: "Resonance level",
    pickResonance: "Pick the one that resonates most",
    done: "Done",
    saveClose: "Save & Close",
    streakLabel: "Day streak",
    journeyTitle: "Your journey",
    settingsTitle: "Settings",
    languageLabel: "Language",
    deleteMemory: "Delete memory",
    anonymousMode: "Anonymous mode",
    aiPersonaDesc: "I'm your companion, not a teacher. I won't give advice—I just help you name what you feel.",
    loading: "Processing… a moment of patience",
    theme_work: "Work",
    theme_relationship: "Relationships",
    theme_self: "Self",
    theme_future: "Future",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["zh-TW"];

export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}>({
  locale: "zh-TW",
  setLocale: () => {},
  t: (key) => translations["zh-TW"][key],
});

export const useLocale = () => useContext(LocaleContext);

export const getTranslation = (locale: Locale, key: TranslationKey): string => {
  return translations[locale][key] || key;
};

export { translations };
