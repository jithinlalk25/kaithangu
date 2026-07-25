"use client";

import { HeartPulse, Users } from "lucide-react";

import { PreventView } from "@/components/kaithangu/prevent-view";
import { RescueView } from "@/components/kaithangu/rescue-view";
import { ScriptView } from "@/components/kaithangu/script-view";
import { ToolkitView } from "@/components/kaithangu/toolkit-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Language, Role } from "@/lib/catalog";
import { t } from "@/lib/ui-text";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/use-local-storage";

/**
 * Kaithangu — one screen, three tabs, no sign-up.
 *
 * Role and language are the only global state: everything downstream, including
 * every prompt sent to Gemini, is derived from them.
 */
export default function Home() {
  const [role, setRole] = useLocalStorage<Role>("kaithangu.role", "person");
  const [lang, setLang] = useLocalStorage<Language>("kaithangu.lang", "en");
  const [savedPlan, setSavedPlan] = useLocalStorage<string>("kaithangu.plan", "");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-16">
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to content
      </a>

      <header className="flex flex-col gap-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-primary text-2xl font-semibold tracking-tight">
              Kaithangu
              <span lang="ml" className="text-muted-foreground ml-2 text-lg font-normal">
                കൈത്താങ്ങ്
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">{t("tagline", lang)}</p>
          </div>

          <div
            className="border-border flex shrink-0 overflow-hidden rounded-full border"
            role="group"
            aria-label="Language"
          >
            {(["en", "ml"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setLang(option)}
                aria-pressed={lang === option}
                className={cn(
                  "min-h-11 px-3 text-sm transition-colors",
                  lang === option
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-card hover:bg-secondary",
                )}
              >
                {option === "en" ? "EN" : "മല"}
              </button>
            ))}
          </div>
        </div>

        <div
          className="grid grid-cols-2 gap-2"
          role="group"
          aria-label="Who is using Kaithangu"
        >
          {(
            [
              { value: "person", icon: HeartPulse, label: t("person", lang) },
              { value: "caregiver", icon: Users, label: t("caregiver", lang) },
            ] as const
          ).map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              aria-pressed={role === value}
              className={cn(
                "focus-visible:ring-ring flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4",
                "text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                role === value
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border bg-card hover:bg-secondary",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </header>

      <main id="main" className="flex-1">
        <Tabs defaultValue="rescue" className="gap-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rescue" className="min-h-11 px-1 text-xs sm:text-sm">
              {t("rescue", lang)}
            </TabsTrigger>
            <TabsTrigger value="scripts" className="min-h-11 px-1 text-xs sm:text-sm">
              {t("scripts", lang)}
            </TabsTrigger>
            <TabsTrigger value="prevent" className="min-h-11 px-1 text-xs sm:text-sm">
              {t("prevent", lang)}
            </TabsTrigger>
            <TabsTrigger value="toolkit" className="min-h-11 px-1 text-xs sm:text-sm">
              {t("toolkit", lang)}
            </TabsTrigger>
          </TabsList>

          {/* Each panel opens with a visually hidden h2. It keeps the document
              outline sequential (h1 → h2 → h3) and gives screen-reader users a
              landmark to jump to, which sighted users get from the tab itself.
              `key` remounts each flow when the role or language changes, so a
              caregiver never sees a plan written for the person in recovery. */}
          <TabsContent value="rescue">
            <h2 className="sr-only">{t("rescue", lang)}</h2>
            <RescueView
              key={`rescue-${role}-${lang}`}
              role={role}
              lang={lang}
              onSavePlan={setSavedPlan}
            />
          </TabsContent>
          <TabsContent value="scripts">
            <h2 className="sr-only">{t("scripts", lang)}</h2>
            <ScriptView key={`script-${role}-${lang}`} role={role} lang={lang} />
          </TabsContent>
          <TabsContent value="prevent">
            <h2 className="sr-only">{t("prevent", lang)}</h2>
            <PreventView key={`prevent-${role}-${lang}`} role={role} lang={lang} />
          </TabsContent>
          <TabsContent value="toolkit">
            <h2 className="sr-only">{t("toolkit", lang)}</h2>
            <ToolkitView lang={lang} savedPlan={savedPlan} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="text-muted-foreground mt-12 space-y-1 text-center text-xs">
        <p>
          {t("disclaimer", lang)} {t("emergencyCall", lang)}{" "}
          <a className="underline" href="tel:112">
            112
          </a>
          .
        </p>
        <p>Built for PromptWars Kerala · Gemini + Next.js</p>
      </footer>
    </div>
  );
}
