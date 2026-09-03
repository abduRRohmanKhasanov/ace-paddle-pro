import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Info,
  Moon,
  Palette,
  ScrollText,
  Sun,
  X,
} from "lucide-react";
import { CLUB_COLORS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Создание клуба — ttSetka" },
      { name: "description", content: "Мастер настройки клуба: поддомен, цвет, рейтинговое ядро и регламент." },
      { property: "og:title", content: "Создание клуба — ttSetka" },
      { property: "og:description", content: "Четыре шага до собственного PWA клуба настольного тенниса." },
    ],
  }),
  component: OnboardingPage,
});

const TAKEN_SUBDOMAINS = ["spin", "tt", "pro", "topspin"];
const STEPS = [
  { id: 1, title: "Создание клуба", icon: Info },
  { id: 2, title: "Внешний вид", icon: Palette },
  { id: 3, title: "Рейтинговое ядро", icon: BrainCircuit },
  { id: 4, title: "Регламент и поддержка", icon: ScrollText },
];

const ENGINES = [
  {
    id: "elo",
    name: "Elo",
    desc: "Классическая формула, простая и понятная. Не учитывает уверенность рейтинга новичков.",
    tag: null,
  },
  {
    id: "glicko",
    name: "Glicko-2",
    desc: "Как Elo, но быстрее находит уровень новых и давно неактивных игроков.",
    tag: "Рекомендуется",
  },
  {
    id: "points",
    name: "Elo + RTTF",
    desc: "Модифицированная Elo под РТТФ. Популярна в России.",
    tag: null,
  },
];

function StepClub({
  name,
  setName,
  sub,
  setSub,
}: {
  name: string;
  setName: (v: string) => void;
  sub: string;
  setSub: (v: string) => void;
}) {
  const subStatus = useMemo(() => {
    const v = sub.trim().toLowerCase();
    if (v.length === 0) return "idle";
    if (v.length < 3) return "short";
    if (TAKEN_SUBDOMAINS.includes(v)) return "taken";
    return "free";
  }, [sub]);

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="text-label-l text-on-surface-variant">Название клуба</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ТопСпин"
          className="mt-1.5 w-full rounded-2xl border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <label className="block">
        <span className="text-label-l text-on-surface-variant">Поддомен</span>
        <div className="mt-1.5 flex items-center rounded-2xl border border-outline bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
          <input
            value={sub}
            onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="topspin"
            className="w-full bg-transparent px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/60"
          />
          <span className="pr-4 text-sm text-on-surface-variant">.rallypoint.app</span>
        </div>
        <span
          className={cn(
            "mt-1.5 flex items-center gap-1.5 text-xs font-medium",
            subStatus === "free" && "text-success",
            (subStatus === "taken" || subStatus === "short") && "text-error",
            subStatus === "idle" && "text-on-surface-variant",
          )}
        >
          {subStatus === "free" && (
            <>
              <Check className="size-3.5" /> Адрес свободен: {sub}.rallypoint.app
            </>
          )}
          {subStatus === "taken" && (
            <>
              <X className="size-3.5" /> Адрес занят — попробуйте другой
            </>
          )}
          {subStatus === "short" && "Минимум 3 символа"}
          {subStatus === "idle" && "Такой адрес получит приложение клуба"}
        </span>
      </label>

      <div>
        <span className="text-label-l text-on-surface-variant">Ярлык приложения</span>
        <button className="pressable mt-1.5 flex w-full items-center gap-4 rounded-2xl border border-dashed border-outline p-4 hover:bg-surface-container-low active:press-active">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-on-primary">
            {name.trim() ? name.trim()[0]!.toUpperCase() : <ImagePlus className="size-6" />}
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold text-on-surface">Загрузить иконку</span>
            <span className="block text-xs text-on-surface-variant">
              Появится на экране телефона при установке PWA
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

function StepAppearance({ color, setColor }: { color: string; setColor: (v: string) => void }) {
  const selected = CLUB_COLORS.find((c) => c.id === color)!;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        Палитра курируется платформой: каждый цвет заранее проверен на читаемость в
        светлой и тёмной теме.
      </p>
      <div className="grid grid-cols-3 gap-3">
        {CLUB_COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => setColor(c.id)}
            className={cn(
              "pressable flex flex-col items-center gap-2 rounded-2xl border-2 p-3 active:press-active",
              color === c.id ? "border-primary bg-primary-container/40" : "border-outline-variant",
            )}
          >
            <span
              className="flex size-10 items-center justify-center rounded-full"
              style={{ backgroundColor: c.light }}
            >
              {color === c.id && <Check className="size-5 text-white" />}
            </span>
            <span className="text-center text-xs font-medium text-on-surface">{c.name}</span>
          </button>
        ))}
      </div>

      {/* Предпросмотр в двух темах */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { mode: "light", icon: Sun, bg: "#f7faf9", fg: "#101b1a", card: "#ffffff", accent: selected.light },
          { mode: "dark", icon: Moon, bg: "#131b1d", fg: "#e2e8e9", card: "#1d2628", accent: selected.dark },
        ].map((t) => (
          <div
            key={t.mode}
            className="overflow-hidden rounded-2xl border border-outline-variant"
            style={{ backgroundColor: t.bg }}
          >
            <div className="flex items-center justify-between px-3 py-2" style={{ color: t.fg }}>
              <span className="text-xs font-bold" style={{ color: t.accent }}>
                {selected.name}
              </span>
              <t.icon className="size-3.5 opacity-60" />
            </div>
            <div className="mx-3 mb-3 rounded-xl p-2.5" style={{ backgroundColor: t.card }}>
              <div className="h-2 w-3/4 rounded-full" style={{ backgroundColor: t.accent }} />
              <div className="mt-1.5 h-2 w-1/2 rounded-full opacity-30" style={{ backgroundColor: t.fg }} />
              <div
                className="mt-2.5 flex h-6 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ backgroundColor: t.accent, color: t.mode === "light" ? "#ffffff" : "#10201d" }}
              >
                Кнопка
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepEngine({ engine, setEngine }: { engine: string; setEngine: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {ENGINES.map((e) => (
        <button
          key={e.id}
          onClick={() => setEngine(e.id)}
          className={cn(
            "pressable flex items-start gap-3 rounded-2xl border p-4 text-left active:press-active",
            engine === e.id
              ? "border-primary bg-primary-container/50"
              : "border-outline-variant hover:bg-surface-container-low",
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
              engine === e.id ? "border-primary bg-primary" : "border-outline",
            )}
          >
            {engine === e.id && <Check className="size-3 text-on-primary" />}
          </span>
          <span>
            <span className="flex flex-wrap items-center gap-2 text-title-m text-on-surface">
              {e.name}
              {e.tag && (
                <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
                  {e.tag}
                </span>
              )}
            </span>
            <span className="mt-1 block text-sm leading-snug text-on-surface-variant">{e.desc}</span>
          </span>
        </button>
      ))}
      <div className="flex gap-3 rounded-2xl bg-tertiary-container p-4">
        <AlertTriangle className="size-5 shrink-0 text-on-tertiary-container" />
        <p className="text-sm leading-snug text-on-tertiary-container">
          Смена ядра позже возможна, но история рейтинга начнётся заново.
        </p>
      </div>
    </div>
  );
}

function StepRules() {
  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="text-label-l text-on-surface-variant">Регламент клуба</span>
        <textarea
          rows={5}
          placeholder="Обувь, бронирование столов, опоздания…"
          className="mt-1.5 w-full resize-none rounded-2xl border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <span className="mt-1 block text-xs text-on-surface-variant">
          Эти правила увидят игроки на экране «Регламент»
        </span>
      </label>
      <label className="block">
        <span className="text-label-l text-on-surface-variant">Telegram администратора</span>
        <input
          placeholder="@topspin_admin"
          className="mt-1.5 w-full rounded-2xl border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <span className="mt-1 block text-xs text-on-surface-variant">
          Именно ваш контакт — игроки напишут сюда по вопросам клуба
        </span>
      </label>
    </div>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const [color, setColor] = useState("teal");
  const [engine, setEngine] = useState("glicko");

  const canNext =
    step === 1
      ? name.trim().length > 0 && sub.trim().length >= 3 && !TAKEN_SUBDOMAINS.includes(sub)
      : true;

  const next = () => {
    if (step < 4) setStep(step + 1);
    else navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-dvh bg-surface">
      <div className="mx-auto flex max-w-md flex-col px-5 pt-6 pb-32">
        {/* Шапка мастера */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-on-surface-variant">
            Шаг {step} из 4
          </span>
          <button
            onClick={() => navigate({ to: "/" })}
            aria-label="Закрыть мастер"
            className="pressable flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container active:press-active"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-2 flex gap-1.5">
          {STEPS.map((s) => (
            <span
              key={s.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                s.id <= step ? "bg-primary" : "bg-surface-container-highest",
              )}
            />
          ))}
        </div>
        <h1 className="mt-5 text-headline-m text-on-surface">{STEPS[step - 1]!.title}</h1>

        <div className="mt-6">
          {step === 1 && (
            <StepClub name={name} setName={setName} sub={sub} setSub={setSub} />
          )}
          {step === 2 && <StepAppearance color={color} setColor={setColor} />}
          {step === 3 && <StepEngine engine={engine} setEngine={setEngine} />}
          {step === 4 && <StepRules />}
        </div>
      </div>

      {/* Нижняя панель действий */}
      <div className="fixed inset-x-0 bottom-0 bg-surface-container shadow-elev-2">
        <div className="mx-auto flex max-w-md gap-3 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="pressable flex items-center justify-center gap-1 rounded-full border border-outline px-5 py-3.5 text-sm font-semibold text-primary active:press-active"
            >
              <ChevronLeft className="size-4" />
              Назад
            </button>
          )}
          <button
            onClick={next}
            disabled={!canNext}
            className="pressable flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-elev-1 active:press-active disabled:opacity-40"
          >
            {step < 4 ? "Далее" : "Создать клуб"}
            {step < 4 ? <ChevronRight className="size-4" /> : <Check className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
