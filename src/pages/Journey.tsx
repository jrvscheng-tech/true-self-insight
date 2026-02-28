import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/lib/i18n";
import AppHeader from "@/components/AppHeader";
import { Flame, ArrowLeft } from "lucide-react";

const Journey = () => {
  const { t, locale } = useLocale();
  const navigate = useNavigate();

  const themes = [
    { code: "theme_work" as const, count: 5 },
    { code: "theme_relationship" as const, count: 3 },
    { code: "theme_self" as const, count: 4 },
    { code: "theme_future" as const, count: 2 },
  ];

  const streak = 7;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 px-5 pb-12 max-w-md mx-auto w-full pt-4">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("homeGreeting").split(",")[0]}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("journeyTitle")}
          </h1>

          {/* Streak */}
          <div className="card-glass p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/20">
              <Flame className="w-6 h-6 text-coral-deep" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">{t("streakLabel")}</p>
            </div>
          </div>

          {/* Theme cloud */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {t("recentThemes")}
            </p>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => (
                <span
                  key={theme.code}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
                  style={{ fontSize: `${Math.min(0.75 + theme.count * 0.06, 1.1)}rem` }}
                >
                  {t(theme.code)} ({theme.count})
                </span>
              ))}
            </div>
          </div>

          {/* Timeline preview */}
          <div className="space-y-3">
            {[3, 2, 1].map((daysAgo) => (
              <div key={daysAgo} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {daysAgo === 1 
                      ? (locale === "zh-TW" ? "昨天" : "Yesterday") 
                      : `${daysAgo} ${locale === "zh-TW" ? "天前" : "days ago"}`}
                  </p>
                  <p className="text-sm text-foreground/80">
                    {locale === "zh-TW" 
                      ? ["自我懷疑與工作壓力", "人際關係中的界限", "對未來的不確定感"][daysAgo - 1]
                      : ["Self-doubt and work pressure", "Boundaries in relationships", "Uncertainty about the future"][daysAgo - 1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Journey;
