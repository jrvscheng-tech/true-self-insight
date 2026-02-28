import { useLocale } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

const AppHeader = () => {
  const { t } = useLocale();

  return (
    <header className="flex items-center justify-between px-5 py-4 sm:px-8">
      <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">
        {t("brand")}
      </h2>
      <LanguageToggle />
    </header>
  );
};

export default AppHeader;
