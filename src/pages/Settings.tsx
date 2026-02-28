import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/lib/i18n";
import AppHeader from "@/components/AppHeader";
import { ArrowLeft, Trash2, Eye, EyeOff } from "lucide-react";

const Settings = () => {
  const { t, locale, setLocale } = useLocale();
  const navigate = useNavigate();
  const [anonymousMode, setAnonymousMode] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 px-5 pb-12 max-w-md mx-auto w-full pt-4">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("settingsTitle")}
          </h1>

          {/* Language */}
          <div className="card-glass p-5 space-y-3">
            <p className="text-sm font-medium text-foreground">{t("languageLabel")}</p>
            <div className="flex gap-2">
              {(["zh-TW", "en-US"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all btn-press ${
                    locale === lang
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {lang === "zh-TW" ? "繁體中文" : "English"}
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous mode */}
          <div className="card-glass p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {anonymousMode ? (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-sm font-medium text-foreground">{t("anonymousMode")}</span>
            </div>
            <button
              onClick={() => setAnonymousMode(!anonymousMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                anonymousMode ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`w-5 h-5 bg-card rounded-full absolute top-0.5 transition-transform shadow-sm ${
                  anonymousMode ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Delete memory */}
          <button className="w-full card-glass p-5 flex items-center gap-3 text-left hover:border-destructive/30 transition-colors group">
            <Trash2 className="w-5 h-5 text-destructive/60 group-hover:text-destructive transition-colors" />
            <span className="text-sm font-medium text-foreground">{t("deleteMemory")}</span>
          </button>

          {/* AI Persona */}
          <div className="card-glass p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              AI Companion
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {t("aiPersonaDesc")}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
