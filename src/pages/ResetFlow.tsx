import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocale } from "@/lib/i18n";
import AppHeader from "@/components/AppHeader";
import TarotCard from "@/components/TarotCard";
import ResonanceButton from "@/components/ResonanceButton";
import TypingLoader from "@/components/TypingLoader";
import type { TranslationKey } from "@/lib/i18n";

type FlowStep = "opening" | "override-input" | "override-emotion" | "reflection" | "loading";

const ResetFlow = () => {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "guided";

  const [step, setStep] = useState<FlowStep>(mode === "override" ? "override-input" : "opening");
  const [userInput, setUserInput] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedResonance, setSelectedResonance] = useState<number | null>(null);
  const [showAiResponse, setShowAiResponse] = useState(false);

  const emotions: { key: TranslationKey; code: string }[] = [
    { key: "emotionStress", code: "stress" },
    { key: "emotionDoubt", code: "doubt" },
    { key: "emotionStuck", code: "stuck" },
  ];

  const mockAiResponse = locale === "zh-TW"
    ? "你提到了工作上的責任感——那種感覺就像肩上不斷堆疊的重量，每一層都是別人的期待和自己的不甘心。你不只是在做事，你是在證明自己值得這份信任。這份堅持很珍貴，但也很沉重。讓自己喘一口氣，不代表你不夠好。"
    : "You mentioned the weight of responsibility at work—it feels like layers stacking on your shoulders, each one made of others' expectations and your own determination. You're not just doing your job; you're proving you deserve this trust. That persistence is precious, but it's also heavy. Letting yourself breathe doesn't mean you're not enough.";

  const resonanceSentences = locale === "zh-TW"
    ? [
        "我不只是在做事，我是在證明自己。",
        "讓自己喘一口氣，不代表我不夠好。",
        "每一層重量，都是別人的期待。",
      ]
    : [
        "I'm not just doing my job—I'm proving myself.",
        "Letting myself breathe doesn't mean I'm not enough.",
        "Each layer of weight is someone else's expectation.",
      ];

  const handleAcceptOpening = () => {
    setStep("loading");
    setTimeout(() => {
      setStep("reflection");
      setTimeout(() => setShowAiResponse(true), 400);
    }, 1500);
  };

  const handleOverrideSubmit = () => {
    if (!userInput.trim()) return;
    setStep("override-emotion");
  };

  const handleEmotionSelect = (code: string) => {
    setSelectedEmotion(code);
    setStep("loading");
    setTimeout(() => {
      setStep("reflection");
      setTimeout(() => setShowAiResponse(true), 400);
    }, 1500);
  };

  const handleFinish = () => {
    navigate("/session-end");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 flex items-center justify-center px-5 pb-12">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {/* Opening */}
            {step === "opening" && (
              <motion.div
                key="opening"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6 max-w-md mx-auto"
              >
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {t("resetTitle")}
                </h2>
                <div className="card-glass p-6">
                  <p className="text-foreground/80 leading-relaxed text-sm">
                    {t("homeSuggestion")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleAcceptOpening}
                    className="flex-1 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-soft btn-press"
                  >
                    {t("acceptBtn")}
                  </button>
                  <button
                    onClick={() => setStep("override-input")}
                    className="flex-1 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-medium text-sm btn-press hover:bg-secondary transition-colors"
                  >
                    {t("changeTopicBtn")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Override input */}
            {step === "override-input" && (
              <motion.div
                key="override"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto space-y-4"
              >
                <h2 className="font-display text-xl font-semibold text-foreground text-center">
                  {t("resetTitle")}
                </h2>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.slice(0, 120))}
                  placeholder={t("userInputPlaceholder")}
                  className="w-full p-4 rounded-xl bg-card border border-border text-foreground text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none h-28 transition-shadow"
                  maxLength={120}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{userInput.length}/120</span>
                  <button
                    onClick={handleOverrideSubmit}
                    disabled={!userInput.trim()}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-soft btn-press disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t("userInputSubmit")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Override emotion */}
            {step === "override-emotion" && (
              <motion.div
                key="emotion"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-md mx-auto space-y-4 text-center"
              >
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {t("chooseEmotion")}
                </h2>
                <div className="flex flex-col gap-2">
                  {emotions.map((em) => (
                    <button
                      key={em.code}
                      onClick={() => handleEmotionSelect(em.code)}
                      className={`px-5 py-3 rounded-xl border text-sm font-medium transition-all btn-press ${
                        selectedEmotion === em.code
                          ? "bg-accent/20 border-accent text-foreground"
                          : "bg-card border-border text-foreground/80 hover:border-accent/50"
                      }`}
                    >
                      {t(em.key)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Loading */}
            {step === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <TypingLoader message={t("loading")} />
              </motion.div>
            )}

            {/* Reflection */}
            {step === "reflection" && (
              <motion.div
                key="reflection"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Tarot card */}
                  <div className="mx-auto lg:mx-0">
                    <TarotCard
                      cardIndex={Math.floor(Math.random() * 3)}
                      label={t("reflectionTitle")}
                    />
                  </div>

                  {/* AI Response */}
                  <div className="flex-1 space-y-6">
                    <AnimatePresence>
                      {showAiResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="card-glass p-5"
                        >
                          <p className="text-foreground/85 leading-relaxed text-sm whitespace-pre-line">
                            {mockAiResponse}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {showAiResponse && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                      >
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          {t("resonatePrompt")}
                        </p>
                        {resonanceSentences.map((sentence, i) => (
                          <ResonanceButton
                            key={i}
                            text={sentence}
                            selected={selectedResonance === i}
                            onClick={() => setSelectedResonance(i)}
                          />
                        ))}
                      </motion.div>
                    )}

                    {selectedResonance !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <button
                          onClick={handleFinish}
                          className="w-full px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-soft btn-press"
                        >
                          {t("finishReflection")}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ResetFlow;
