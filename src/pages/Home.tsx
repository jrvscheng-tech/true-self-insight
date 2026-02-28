import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/lib/i18n";
import AppHeader from "@/components/AppHeader";
import { ArrowRight, Sparkles } from "lucide-react";

const Home = () => {
  const { t } = useLocale();
  const navigate = useNavigate();

  const recentThemes = [
    { key: "theme_work" as const, emoji: "💼" },
    { key: "theme_relationship" as const, emoji: "💬" },
    { key: "theme_self" as const, emoji: "🌱" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-6"
        >
          {/* Greeting */}
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("homeGreeting")} 👋
            </h1>
          </div>

          {/* Main CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="card-glass p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-accent/20">
                <Sparkles className="w-5 h-5 text-coral-deep" />
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                {t("homeSuggestion")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => navigate("/reset?mode=guided")}
                className="flex-1 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-soft hover:shadow-card transition-all btn-press flex items-center justify-center gap-2"
              >
                {t("acceptSuggestion")}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/reset?mode=override")}
                className="flex-1 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-secondary transition-colors btn-press"
              >
                {t("overrideSuggestion")}
              </button>
            </div>
          </motion.div>

          {/* Recent themes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">
              {t("recentThemes")}
            </p>
            <div className="flex gap-2">
              {recentThemes.map((theme) => (
                <span
                  key={theme.key}
                  className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {theme.emoji} {t(theme.key)}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Quick nav */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate("/journey")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("journeyTitle")} →
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("settingsTitle")} →
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
