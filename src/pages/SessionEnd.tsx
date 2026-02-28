import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/lib/i18n";
import AppHeader from "@/components/AppHeader";
import { Check, Heart } from "lucide-react";

const SessionEnd = () => {
  const { t, locale } = useLocale();
  const navigate = useNavigate();

  const summary = locale === "zh-TW"
    ? "今天你談到了工作上的責任感帶來的壓力。你正在學習分辨「努力」和「過度承擔」之間的界線。你選擇的共鳴句是：「讓自己喘一口氣，不代表我不夠好。」"
    : "Today you explored the pressure from responsibilities at work. You're learning to distinguish between 'working hard' and 'carrying too much.' Your resonance: 'Letting myself breathe doesn't mean I'm not enough.'";

  const resonancePick = locale === "zh-TW"
    ? "讓自己喘一口氣，不代表我不夠好。"
    : "Letting myself breathe doesn't mean I'm not enough.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 flex items-center justify-center px-5 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-6 h-6 text-coral-deep" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {t("sessionEndTitle")}
            </h1>
          </div>

          {/* Summary card */}
          <div className="card-glass p-5 space-y-4">
            <p className="text-foreground/80 text-sm leading-relaxed">
              {summary}
            </p>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
              <Check className="w-4 h-4 text-coral-deep shrink-0" />
              <p className="text-sm font-medium text-foreground">
                "{resonancePick}"
              </p>
            </div>
          </div>

          {/* Confidence indicator */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {t("sessionConfidence")}
            </p>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/home")}
              className="flex-1 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-soft btn-press"
            >
              {t("saveClose")}
            </button>
            <button
              onClick={() => navigate("/journey")}
              className="flex-1 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-medium text-sm btn-press hover:bg-secondary transition-colors"
            >
              {t("journeyTitle")}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SessionEnd;
