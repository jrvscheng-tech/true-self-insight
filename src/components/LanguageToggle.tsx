import { useLocale } from "@/lib/i18n";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "zh-TW" ? "en-US" : "zh-TW")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors btn-press"
      aria-label="Switch language"
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === "zh-TW" ? "EN" : "中文"}
    </button>
  );
};

export default LanguageToggle;
