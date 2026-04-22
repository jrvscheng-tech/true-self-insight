import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/lib/i18n";
import AppHeader from "@/components/AppHeader";
import {
  Flame,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Tag,
  X,
  Sparkles,
} from "lucide-react";
import {
  getMockEntries,
  getEntryByDate,
  getMonthEntries,
  computeMonthlyReflection,
  type JourneyEntry,
  type ThemeCode,
} from "@/lib/journeyData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const THEME_DOTS: Record<ThemeCode, string> = {
  theme_work: "bg-primary",
  theme_relationship: "bg-coral-deep",
  theme_self: "bg-indigo-light",
  theme_future: "bg-accent",
};

const Journey = () => {
  const { t, locale } = useLocale();
  const navigate = useNavigate();

  const entries = useMemo(() => getMockEntries(), []);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<ThemeCode | "all">("all");

  const monthEntries = useMemo(
    () => getMonthEntries(entries, cursor.getFullYear(), cursor.getMonth()),
    [entries, cursor],
  );

  const filteredEntries = useMemo(
    () => (activeTheme === "all" ? entries : entries.filter((e) => e.theme === activeTheme)),
    [entries, activeTheme],
  );

  const monthly = useMemo(
    () => computeMonthlyReflection(monthEntries, locale),
    [monthEntries, locale],
  );

  const streak = 7;
  const totalCount = entries.length;
  const monthCount = monthEntries.length;

  const selectedEntry = selectedDate ? getEntryByDate(entries, selectedDate) : null;

  const monthNames = t("monthNames").split(",");
  const dayNames = t("daysOfWeek").split(",");

  const goPrevMonth = () =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const goNextMonth = () => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    if (next <= new Date(today.getFullYear(), today.getMonth(), 1)) setCursor(next);
  };

  const isAtCurrentMonth =
    cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();

  const formatRelative = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return t("todayLabel");
    if (diff === 1) return t("yesterdayLabel");
    if (diff < 7) return `${diff} ${t("daysAgoLabel")}`;
    return `${monthNames[d.getMonth()]} ${d.getDate()}`;
  };

  // Build calendar grid
  const calendarCells = useMemo(() => {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: ({ day: number; dateStr: string; entry?: JourneyEntry } | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, entry: getEntryByDate(entries, dateStr) });
    }
    return cells;
  }, [cursor, entries]);

  // Group filtered entries by month for timeline
  const groupedTimeline = useMemo(() => {
    const groups: Record<string, JourneyEntry[]> = {};
    filteredEntries.forEach((e) => {
      const [y, m] = e.date.split("-");
      const key = `${y}-${m}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filteredEntries]);

  // Theme stats (all-time)
  const themeStats = useMemo(() => {
    const counts: Record<ThemeCode, number> = {
      theme_work: 0,
      theme_relationship: 0,
      theme_self: 0,
      theme_future: 0,
    };
    entries.forEach((e) => counts[e.theme]++);
    const max = Math.max(...Object.values(counts), 1);
    return (Object.entries(counts) as [ThemeCode, number][])
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({ code, count, pct: (count / max) * 100 }));
  }, [entries]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 px-5 pb-12 max-w-3xl mx-auto w-full pt-2">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("journeyBack")}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {t("journeyTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t("journeySubtitle")}</p>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card-glass p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flame className="w-3.5 h-3.5 text-coral-deep" />
                {t("statStreak")}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{streak}</p>
            </div>
            <div className="card-glass p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {t("statMonth")}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{monthCount}</p>
            </div>
            <div className="card-glass p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-light" />
                {t("statTotal")}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{totalCount}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="calendar" className="gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" /> {t("tabCalendar")}
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-1.5">
                <List className="w-3.5 h-3.5" /> {t("tabTimeline")}
              </TabsTrigger>
              <TabsTrigger value="themes" className="gap-1.5">
                <Tag className="w-3.5 h-3.5" /> {t("tabThemes")}
              </TabsTrigger>
            </TabsList>

            {/* CALENDAR TAB */}
            <TabsContent value="calendar" className="space-y-4 mt-4">
              {/* Month navigator */}
              <div className="flex items-center justify-between">
                <button
                  onClick={goPrevMonth}
                  className="p-2 rounded-lg hover:bg-secondary btn-press"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="font-display text-lg font-semibold">
                  {cursor.getFullYear()} · {monthNames[cursor.getMonth()]}
                </h2>
                <button
                  onClick={goNextMonth}
                  disabled={isAtCurrentMonth}
                  className="p-2 rounded-lg hover:bg-secondary btn-press disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Heatmap calendar */}
              <div className="card-glass p-4">
                <div className="grid grid-cols-7 gap-1.5 mb-2">
                  {dayNames.map((d) => (
                    <div
                      key={d}
                      className="text-[10px] text-muted-foreground text-center font-medium"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarCells.map((cell, i) => {
                    if (!cell) return <div key={i} />;
                    const isToday = cell.dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                    const intensity = cell.entry?.intensity ?? 0;
                    const opacity = [0, 0.25, 0.45, 0.7, 0.95][intensity];
                    const themeClass = cell.entry ? THEME_DOTS[cell.entry.theme] : "";
                    return (
                      <button
                        key={i}
                        onClick={() => cell.entry && setSelectedDate(cell.dateStr)}
                        disabled={!cell.entry}
                        className={cn(
                          "aspect-square rounded-md relative flex items-center justify-center text-[11px] font-medium transition-all btn-press",
                          cell.entry
                            ? "cursor-pointer hover:ring-2 hover:ring-primary/40"
                            : "cursor-default",
                          isToday && "ring-2 ring-primary",
                        )}
                        style={{
                          backgroundColor: cell.entry
                            ? `hsl(var(--primary) / ${opacity})`
                            : "hsl(var(--secondary))",
                        }}
                      >
                        <span
                          className={cn(
                            cell.entry && intensity >= 3
                              ? "text-primary-foreground"
                              : "text-foreground/70",
                          )}
                        >
                          {cell.day}
                        </span>
                        {cell.entry && (
                          <span
                            className={cn(
                              "absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full",
                              themeClass,
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span>—</span>
                    {[1, 2, 3, 4].map((lv) => (
                      <div
                        key={lv}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${[0.25, 0.45, 0.7, 0.95][lv - 1]})`,
                        }}
                      />
                    ))}
                    <span>+</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {(Object.keys(THEME_DOTS) as ThemeCode[]).map((code) => (
                      <div key={code} className="flex items-center gap-1">
                        <span className={cn("w-1.5 h-1.5 rounded-full", THEME_DOTS[code])} />
                        {t(code)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly reflection */}
              <div className="card-glass p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-coral-deep" />
                  <h3 className="font-display font-semibold text-foreground">
                    {t("monthlyReflection")}
                  </h3>
                </div>
                {monthly ? (
                  <>
                    <p className="text-sm leading-relaxed text-foreground/85">
                      {monthly.narrative}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-3 py-1 rounded-full bg-secondary text-xs text-foreground/80">
                        {t("monthlyMostFrequent")}: <strong>{t(monthly.topTheme)}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-xs text-foreground/80">
                        {t("monthlyTone")}: <strong>{t(monthly.tone)}</strong>
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {t("monthlyReflectionEmpty")}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* TIMELINE TAB */}
            <TabsContent value="timeline" className="space-y-4 mt-4">
              {/* Filter chips */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTheme("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium btn-press transition-colors",
                    activeTheme === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/70",
                  )}
                >
                  {t("filterAll")} ({entries.length})
                </button>
                {(Object.keys(THEME_DOTS) as ThemeCode[]).map((code) => {
                  const count = entries.filter((e) => e.theme === code).length;
                  return (
                    <button
                      key={code}
                      onClick={() => setActiveTheme(code)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium btn-press transition-colors flex items-center gap-1.5",
                        activeTheme === code
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground/70 hover:bg-secondary/70",
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", THEME_DOTS[code])} />
                      {t(code)} ({count})
                    </button>
                  );
                })}
              </div>

              <ScrollArea className="h-[480px] pr-3">
                <div className="space-y-6">
                  {groupedTimeline.map(([monthKey, items]) => {
                    const [y, m] = monthKey.split("-").map(Number);
                    return (
                      <div key={monthKey} className="space-y-2">
                        <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground sticky top-0 bg-background/95 backdrop-blur py-1 z-10">
                          {y} · {monthNames[m - 1]} · {items.length}
                        </h3>
                        <div className="space-y-2 border-l-2 border-border/50 pl-4 ml-1.5">
                          {items.map((e) => (
                            <button
                              key={e.date}
                              onClick={() => setSelectedDate(e.date)}
                              className="w-full text-left card-glass p-3 hover:shadow-card transition-all btn-press relative"
                            >
                              <span
                                className={cn(
                                  "absolute -left-[1.4rem] top-4 w-2.5 h-2.5 rounded-full ring-2 ring-background",
                                  THEME_DOTS[e.theme],
                                )}
                              />
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-[11px] text-muted-foreground">
                                  {formatRelative(e.date)}
                                </p>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground/70">
                                  {t(e.theme)}
                                </span>
                              </div>
                              <p className="text-sm text-foreground/85 leading-snug line-clamp-2">
                                {e.summary[locale]}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {groupedTimeline.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-12">
                      {t("noEntriesMonth")}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* THEMES TAB */}
            <TabsContent value="themes" className="space-y-3 mt-4">
              <div className="card-glass p-5 space-y-4">
                {themeStats.map((s) => (
                  <div key={s.code} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", THEME_DOTS[s.code])} />
                        <span className="text-sm font-medium text-foreground">{t(s.code)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{s.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={cn("h-full rounded-full", THEME_DOTS[s.code])}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Day detail sheet */}
      <Sheet open={!!selectedDate} onOpenChange={(o) => !o && setSelectedDate(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl border-t max-h-[80vh]">
          <SheetHeader className="text-left">
            <SheetTitle className="font-display">
              {selectedDate &&
                (() => {
                  const d = new Date(selectedDate);
                  return `${d.getFullYear()} · ${monthNames[d.getMonth()]} ${d.getDate()}`;
                })()}
            </SheetTitle>
          </SheetHeader>
          <AnimatePresence mode="wait">
            {selectedEntry ? (
              <motion.div
                key={selectedEntry.date}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mt-4"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs">
                  <span className={cn("w-1.5 h-1.5 rounded-full", THEME_DOTS[selectedEntry.theme])} />
                  {t(selectedEntry.theme)}
                </span>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {selectedEntry.summary[locale]}
                </p>
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">
                    {t("entryResonance")}
                  </p>
                  <p className="text-sm font-medium text-foreground italic">
                    "{selectedEntry.resonance[locale]}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground py-6 text-center">{t("noEntries")}</p>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Journey;
