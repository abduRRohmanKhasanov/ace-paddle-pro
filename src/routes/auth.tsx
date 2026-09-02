import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";

type Mode = "signin" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "signin" ? "signin" : "signup",
  }),
  head: () => ({
    meta: [
      { title: "Вход и регистрация клуба — ttSetka" },
      {
        name: "description",
        content:
          "Войдите как администратор клуба или зарегистрируйте новый клуб в ttSetka: по телефону, почте или через Google.",
      },
      { property: "og:title", content: "Вход и регистрация клуба — ttSetka" },
      {
        property: "og:description",
        content: "Один аккаунт администратора — весь клуб настольного тенниса под контролем.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const SOCIALS = [
  { id: "google", label: "Google", mark: "G", tint: "text-on-surface" },
  { id: "apple", label: "Apple ID", mark: "", tint: "text-on-surface" },
  { id: "vk", label: "VK ID", mark: "VK", tint: "text-primary" },
  { id: "telegram", label: "Telegram", mark: "TG", tint: "text-primary" },
] as const;

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const isSignup = mode === "signup";

  function proceed() {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      navigate({ to: isSignup ? "/onboarding" : "/admin" });
    }, 700);
  }

  return (
    <div className="min-h-dvh bg-surface">
      <main className="mx-auto flex max-w-md flex-col gap-6 px-5 pt-8 pb-12">
        <Link
          to="/"
          className="pressable inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container active:press-active"
        >
          <ArrowLeft className="size-4" />
          На главную
        </Link>

        <div>
          <h1 className="text-headline-m text-on-surface">
            {isSignup ? "Зарегистрируйте клуб" : "С возвращением"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {isSignup
              ? "Первая версия ttSetka открыта для администраторов клубов. После регистрации — 4 шага настройки, и клуб готов."
              : "Войдите в аккаунт администратора, чтобы попасть в панель своего клуба."}
          </p>
        </div>

        {/* Переключатель режима */}
        <div className="flex rounded-full bg-surface-container p-1">
          {(
            [
              { id: "signup", label: "Регистрация" },
              { id: "signin", label: "Вход" },
            ] as const
          ).map((tab) => (
            <Link
              key={tab.id}
              to="/auth"
              search={{ mode: tab.id }}
              className={`pressable flex-1 rounded-full py-2.5 text-center text-sm font-semibold transition-colors ${
                mode === tab.id
                  ? "bg-primary text-on-primary shadow-elev-1"
                  : "text-on-surface-variant"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Соцсети */}
        <div className="grid grid-cols-2 gap-3">
          {SOCIALS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={proceed}
              className="pressable flex items-center justify-center gap-2 rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container active:press-active"
            >
              <span className={`text-base font-extrabold ${s.tint}`}>{s.mark}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-outline-variant" />
          <span className="text-xs text-on-surface-variant">или</span>
          <span className="h-px flex-1 bg-outline-variant" />
        </div>

        {/* Телефон / почта */}
        <div className="rounded-3xl bg-surface-container-low p-4 shadow-elev-1">
          <div className="flex rounded-full bg-surface-container p-1">
            {(
              [
                { id: "phone", label: "Телефон", icon: Phone },
                { id: "email", label: "Почта", icon: Mail },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setChannel(c.id);
                  setValue("");
                }}
                className={`pressable flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-colors ${
                  channel === c.id
                    ? "bg-surface-container-lowest text-on-surface shadow-elev-1"
                    : "text-on-surface-variant"
                }`}
              >
                <c.icon className="size-4" />
                {c.label}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-label-l text-on-surface-variant">
            {channel === "phone" ? "Номер телефона" : "Электронная почта"}
          </label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode={channel === "phone" ? "tel" : "email"}
            placeholder={channel === "phone" ? "+7 900 000-00-00" : "admin@club.ru"}
            className="mt-2 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-base text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary"
          />

          <button
            type="button"
            disabled={busy}
            onClick={proceed}
            className="pressable mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-elev-1 disabled:opacity-70 active:press-active"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                {isSignup ? "Создать аккаунт" : "Войти"}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-on-surface-variant">
            Придёт код подтверждения — пароль не нужен.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-3xl bg-secondary-container p-4 text-on-secondary-container">
          <ShieldCheck className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-snug">
            {isSignup
              ? "После регистрации откроются настройки клуба: название, адрес, цвет и рейтинговое ядро."
              : "Вы попадёте в админ-панель своего клуба."}
          </p>
        </div>

        <Link
          to="/demo"
          className="text-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Сначала посмотреть демо
        </Link>
      </main>
    </div>
  );
}
