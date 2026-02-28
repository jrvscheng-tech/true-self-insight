import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocaleContext, type Locale, getTranslation, type TranslationKey } from "@/lib/i18n";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ResetFlow from "./pages/ResetFlow";
import SessionEnd from "./pages/SessionEnd";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [locale, setLocale] = useState<Locale>("zh-TW");

  const t = useCallback(
    (key: TranslationKey) => getTranslation(locale, key),
    [locale]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleContext.Provider value={{ locale, setLocale, t }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/reset" element={<ResetFlow />} />
              <Route path="/session-end" element={<SessionEnd />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LocaleContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
