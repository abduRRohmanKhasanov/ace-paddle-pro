import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ClipboardList,
  QrCode,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RallyPoint — платформа для клубов настольного тенниса" },
      {
        name: "description",
        content:
          "RallyPoint объединяет рейтинг клуба, турниры, профили игроков и живое судейство столов в одном мобильном приложении. Зарегистрируйте свой клуб за 4 шага.",
      },
      { property: "og:title", content: "RallyPoint — платформа для клубов настольного тенниса" },
      {
        property: "og:description",
        content:
          "Рейтинг, турниры, профили игроков и живой счёт на столах — всё в одном приложении для вашего клуба.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: BarChart3,
    title: "Живой рейтинг клуба",
    text: "Очки пересчитываются после каждого матча. Игроки видят своё место, тренд и историю.",
    tint: "bg-primary-container text-on-primary-container",
  },
  {
    icon: CalendarDays,
    title: "Турниры без Excel",
    text: "Круговая, олимпийка, группы + плей-офф и швейцарка — сетка и результаты собираются сами.",
    tint: "bg-secondary-container text-on-secondary-container",
  },
  {
    icon: Users,
    title: "Профили и сравнение",
    text: "Карточка игрока с наградами, графиком рейтинга и режимом VS для личных встреч.",
    tint: "bg-tertiary-container text-on-tertiary-container",
  },
  {
    icon: QrCode,
    title: "Судейство по QR",
    text: "Судья открывает стол по ссылке без регистрации и ведёт счёт — зал следит онлайн.",
    tint: "bg-primary-container text-on-primary-container",
  },
] as const;

const SHOTS = [
  { title: "Лента клуба", text: "Новости, чемпион недели и ближайший турнир", icon: Sparkles },
  { title: "Рейтинг", text: "Медали топ-3, фильтры по уровням, тренды позиций", icon: Trophy },
  { title: "Админ-панель", text: "Состав, турниры, судьи и настройки клуба", icon: ClipboardList },
  { title: "Счёт на столе", text: "Подача, сеты, отмена действия и смена сторон", icon: Smartphone },
] as const;

const STEPS = [
  "Регистрируетесь как администратор",
  "Заполняете 4 шага настройки клуба",
  "Добавляете игроков и первый турнир",
  "Раздаёте судьям ссылки на столы",
] as const;

function AuthButtons({ size = "sm" }: { size?: "sm" | "lg" }) {
  const pad = size === "lg" ? "px-6 py-3.5 text-base" : "px-4 py-2 text-sm";
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/auth"
        search={{ mode: "signin" as const }}
        className={`pressable rounded-full border border-outline font-semibold text-on-surface hover:bg-surface-container active:press-active ${pad}`}
      >
        Войти
      </Link>
      <Link
        to="/auth"
        search={{ mode: "signup" as const }}
        className={`pressable rounded-full bg-primary font-semibold text-on-primary shadow-elev-1 active:press-active ${pad}`}
      >
        Регистрация
      </Link>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
          <span className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary">
              <span className="text-base font-extrabold text-on-primary">R</span>
            </span>
            <span className="text-title-m text-on-surface">
              Rally<span className="text-primary">Point</span>
            </span>
          </span>
          <AuthButtons />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16">
        {/* Hero */}
        <section className="pt-12 pb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-1.5 text-xs font-semibold text-on-primary-container">
            <Sparkles className="size-3.5" />
            Первая версия — открыта для клубов
          </span>
          <h1 className="mt-5 text-display-s text-on-surface">
            Весь клуб настольного тенниса — в одном приложении
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            RallyPoint ведёт рейтинг игроков, проводит турниры, хранит профили и историю матчей и
            позволяет судить столы с телефона. Больше никаких таблиц в мессенджерах и споров о том,
            кто сильнее.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" as const }}
              className="pressable inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-on-primary shadow-elev-2 active:press-active"
            >
              Зарегистрировать клуб
              <ArrowRight className="size-5" />
            </Link>
            <Link
              to="/demo"
              className="pressable inline-flex items-center gap-2 rounded-full border border-outline px-6 py-3.5 text-base font-semibold text-primary hover:bg-surface-container active:press-active"
            >
              Посмотреть демо
            </Link>
          </div>
        </section>

        {/* Чем удобна */}
        <section className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-3xl bg-surface-container-low p-5 shadow-elev-1">
              <span className={`flex size-11 items-center justify-center rounded-2xl ${f.tint}`}>
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-title-m text-on-surface">{f.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{f.text}</p>
            </article>
          ))}
        </section>

        {/* Скриншоты */}
        <section className="pt-14">
          <h2 className="text-headline-s text-on-surface">Как это выглядит</h2>
          <p className="mt-2 text-sm text-on-surface-variant">
            Экраны приложения — в мобильном формате, которым игроки пользуются прямо в зале.
          </p>
          <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
            {SHOTS.map((s) => (
              <figure
                key={s.title}
                className="w-56 shrink-0 snap-start rounded-4xl bg-surface-container-low p-3 shadow-elev-2"
              >
                <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-3xl bg-surface-container-highest px-4 text-center">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-on-primary">
                    <s.icon className="size-6" />
                  </span>
                  <span className="text-title-m text-on-surface">{s.title}</span>
                  <span className="text-xs leading-snug text-on-surface-variant">{s.text}</span>
                </div>
                <figcaption className="px-2 pt-3 pb-1 text-xs text-on-surface-variant">
                  Скриншот появится здесь
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Как начать */}
        <section className="pt-14">
          <h2 className="text-headline-s text-on-surface">Как запустить клуб</h2>
          <ol className="mt-6 flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-3xl bg-surface-container-low p-4 shadow-elev-1"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                  {i + 1}
                </span>
                <span className="text-sm text-on-surface">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Нижний CTA */}
        <section className="mt-14 rounded-4xl bg-primary-container p-7 text-center shadow-elev-2">
          <h2 className="text-headline-s text-on-primary-container">Готовы попробовать?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-primary-container/85">
            В первой версии клуб регистрирует администратор. Вход и регистрация — по номеру
            телефона, почте или через Google, Apple, VK и Telegram.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" as const }}
              className="pressable inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-on-primary shadow-elev-1 active:press-active"
            >
              Зарегистрироваться
              <ArrowRight className="size-5" />
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signin" as const }}
              className="pressable inline-flex items-center rounded-full border border-on-primary-container/40 px-7 py-3.5 text-base font-semibold text-on-primary-container active:press-active"
            >
              Войти
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant px-5 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <span className="text-title-m text-on-surface">
            Rally<span className="text-primary">Point</span>
          </span>
          <p className="text-xs text-on-surface-variant">
            Платформа для клубов настольного тенниса · Material Design 3 · демо-данные
          </p>
          <Link to="/demo" className="text-sm font-semibold text-primary hover:underline">
            Демо-режим
          </Link>
        </div>
      </footer>
    </div>
  );
}
