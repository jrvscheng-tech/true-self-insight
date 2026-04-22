import type { Locale } from "./i18n";

export type ThemeCode = "theme_work" | "theme_relationship" | "theme_self" | "theme_future";
export type ToneCode = "toneSteady" | "toneTurbulent" | "toneSearching";

export interface JourneyEntry {
  date: string; // YYYY-MM-DD
  theme: ThemeCode;
  intensity: 1 | 2 | 3 | 4; // for heatmap shading
  summary: { "zh-TW": string; "en-US": string };
  resonance: { "zh-TW": string; "en-US": string };
}

const THEMES: ThemeCode[] = ["theme_work", "theme_relationship", "theme_self", "theme_future"];

const SUMMARIES: Record<ThemeCode, { "zh-TW": string; "en-US": string }[]> = {
  theme_work: [
    { "zh-TW": "工作上的責任讓我感到沉重", "en-US": "Work responsibilities felt heavy" },
    { "zh-TW": "我在學習設立工作的界限", "en-US": "Learning to set boundaries at work" },
    { "zh-TW": "對結果的焦慮蓋過了過程", "en-US": "Anxiety about outcomes overshadowed the process" },
  ],
  theme_relationship: [
    { "zh-TW": "與家人的對話讓我反覆思考", "en-US": "A family conversation kept echoing" },
    { "zh-TW": "想被理解，但不知道怎麼開口", "en-US": "Wanted to be understood, didn't know how to start" },
    { "zh-TW": "我在練習說出真正的需求", "en-US": "Practicing voicing what I really need" },
  ],
  theme_self: [
    { "zh-TW": "對自己的懷疑又浮上來", "en-US": "Self-doubt surfaced again" },
    { "zh-TW": "今天對自己溫柔了一點", "en-US": "Was a little gentler with myself today" },
    { "zh-TW": "我看見自己的努力", "en-US": "I noticed my own effort" },
  ],
  theme_future: [
    { "zh-TW": "對未來的不確定感", "en-US": "Uncertainty about what's ahead" },
    { "zh-TW": "我想知道下一步該往哪走", "en-US": "Wondering where to go next" },
    { "zh-TW": "在不確定中找到一點方向", "en-US": "Found a small direction within the unknown" },
  ],
};

const RESONANCES: { "zh-TW": string; "en-US": string }[] = [
  { "zh-TW": "讓自己喘一口氣，不代表我不夠好。", "en-US": "Letting myself breathe doesn't mean I'm not enough." },
  { "zh-TW": "我可以同時感到害怕，又繼續前進。", "en-US": "I can feel afraid and still keep going." },
  { "zh-TW": "我值得被理解，包括被自己理解。", "en-US": "I deserve to be understood — including by myself." },
  { "zh-TW": "慢一點，不是落後。", "en-US": "Slower isn't behind." },
  { "zh-TW": "今天的我已經做得夠多了。", "en-US": "Today's me has done enough." },
];

// Deterministic pseudo-random based on date string, so refresh shows same data
const seedRand = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
};

const fmtDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Generate ~45 mock entries spanning the last ~75 days (so users see >30 entries) */
export const getMockEntries = (): JourneyEntry[] => {
  const entries: JourneyEntry[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 75; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = fmtDate(d);
    const r = seedRand(key);

    // ~65% of days have an entry
    if (r() > 0.35) {
      const theme = THEMES[Math.floor(r() * THEMES.length)];
      const intensity = (Math.floor(r() * 4) + 1) as 1 | 2 | 3 | 4;
      const summaryPool = SUMMARIES[theme];
      const summary = summaryPool[Math.floor(r() * summaryPool.length)];
      const resonance = RESONANCES[Math.floor(r() * RESONANCES.length)];
      entries.push({ date: key, theme, intensity, summary, resonance });
    }
  }
  return entries;
};

export const getEntryByDate = (entries: JourneyEntry[], date: string) =>
  entries.find((e) => e.date === date);

export const getMonthEntries = (entries: JourneyEntry[], year: number, month: number) =>
  entries.filter((e) => {
    const [y, m] = e.date.split("-").map(Number);
    return y === year && m === month + 1;
  });

export const computeMonthlyReflection = (
  monthEntries: JourneyEntry[],
  locale: Locale,
): { topTheme: ThemeCode | null; tone: ToneCode; narrative: string } | null => {
  if (monthEntries.length < 3) return null;

  // top theme
  const counts: Record<string, number> = {};
  monthEntries.forEach((e) => (counts[e.theme] = (counts[e.theme] || 0) + 1));
  const topTheme = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as ThemeCode;

  // tone from intensity variance
  const avg = monthEntries.reduce((s, e) => s + e.intensity, 0) / monthEntries.length;
  const variance =
    monthEntries.reduce((s, e) => s + Math.pow(e.intensity - avg, 2), 0) / monthEntries.length;
  let tone: ToneCode = "toneSteady";
  if (variance > 1.2) tone = "toneTurbulent";
  else if (avg > 2.6) tone = "toneSearching";

  const narratives: Record<ThemeCode, { "zh-TW": string; "en-US": string }> = {
    theme_work: {
      "zh-TW": "這個月你大多在面對工作。你不是太脆弱，你只是被要求承擔太多。",
      "en-US": "This month was mostly about work. You're not too fragile — you're just carrying a lot.",
    },
    theme_relationship: {
      "zh-TW": "這個月你常思考人際關係。被理解的渴望比你想像的還要重要。",
      "en-US": "This month brought relationships into focus. The wish to be understood matters more than you let on.",
    },
    theme_self: {
      "zh-TW": "這個月你回到了自己身上。你正在慢慢學會用比較溫柔的方式看見自己。",
      "en-US": "This month you returned to yourself. You're slowly learning to look at yourself more gently.",
    },
    theme_future: {
      "zh-TW": "這個月你在思考方向。不確定不代表迷路，有時只是在找路。",
      "en-US": "This month you've been weighing direction. Uncertainty isn't lost — sometimes it's just searching.",
    },
  };

  return {
    topTheme,
    tone,
    narrative: narratives[topTheme][locale],
  };
};
