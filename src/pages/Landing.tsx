import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/lib/i18n";
import AppHeader from "@/components/AppHeader";
import heroImage from "@/assets/hero-illustration.png";
import { Mail } from "lucide-react";

const Landing = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");

  const handleStart = () => {
    setShowLogin(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to home
    navigate("/home");
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full text-center"
        >
          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <img
              src={heroImage}
              alt="A peaceful person surrounded by gentle flowing shapes"
              className="w-full max-w-sm mx-auto rounded-3xl"
            />
          </motion.div>

          {/* Tagline */}
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
            {t("tagline")}
          </h1>

          <AnimatePresence mode="wait">
            {!showLogin ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <button
                  onClick={handleStart}
                  className="w-full max-w-xs mx-auto block px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-medium text-base shadow-soft hover:shadow-card transition-all duration-200 btn-press"
                >
                  {t("startCta")}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 max-w-xs mx-auto"
              >
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("loginPlaceholder")}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-soft hover:shadow-card transition-all btn-press"
                  >
                    {t("loginSend")}
                  </button>
                  <p className="text-xs text-muted-foreground">{t("loginHint")}</p>
                </form>

                {/* OAuth placeholders */}
                <div className="mt-6 space-y-2">
                  {["Google", "Facebook", "LinkedIn"].map((provider) => (
                    <button
                      key={provider}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                    >
                      {provider}
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {t("oauthSoon")}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSkip}
                  className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip for now →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
