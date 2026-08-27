import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ClipboardList, Sparkles, Trophy, User } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Демо-режим RallyPoint — выбор роли" },
      {
        name: "description",
        content:
          "Пройдите сценарий игрока, администратора клуба или судьи стола в кликабельном прототипе RallyPoint.",
      },
      { property: "og:title", content: "Демо-режим RallyPoint — выбор роли" },
      {
        property: "og:description",
        content: "Игрок, администратор и судья: три сценария демонстрационного клуба «ТопСпин».",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Launcher,
});

const ROLES = [
  {
    to: "/club",
    icon: User,
    title: "Я игрок",
    text: "Лента клуба, рейтинг, профиль, сравнение и регламент",
    tint: "bg-primary-container text-on-primary-container",
  },
  {
    to: "/admin",
    icon: Trophy,
    title: "Я администратор",
    text: "Дашборд, игроки, турниры, судьи на столах и настройки",
    tint: "bg-secondary-container text-on-secondary-container",
  },
  {
    to: "/referee",
    icon: ClipboardList,
    title: "Я судья",
    text: "Живой счёт на столе — без входа в аккаунт, по ссылке или QR",
    tint: "bg-tertiary-container text-on-tertiary-container",
  },
] as const;

function Launcher() {
  return (
    <div className="min-h-dvh bg-surface">
      <main className="mx-auto flex max-w-md flex-col gap-8 px-5 pt-8 pb-12">
        <Link
          to="/"
          className="pressable inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container active:press-active"
        >
          <ArrowLeft className="size-4" />
          На лендинг
        </Link>

        <div>
          <div className="mb-5 flex size-14 items-center justify-center rounded-3xl bg-primary shadow-elev-2">
            <span className="text-2xl font-extrabold text-on-primary">R</span>
          </div>
          <h1 className="text-display-s text-on-surface">
            Rally<span className="text-primary">Point</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-on-surface-variant">
            Демо-режим. Клуб «ТопСпин» уже настроен — выберите роль, чтобы пройти её сценарий.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {ROLES.map((role) => (
            <Link
              key={role.to}
              to={role.to}
              className="pressable group flex items-center gap-4 rounded-3xl bg-surface-container-low p-4 shadow-elev-1 hover:bg-surface-container active:press-active"
            >
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${role.tint}`}
              >
                <role.icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-title-m text-on-surface">{role.title}</span>
                <span className="mt-0.5 block text-sm leading-snug text-on-surface-variant">
                  {role.text}
                </span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <Link
          to="/onboarding"
          className="pressable flex items-center justify-center gap-2 rounded-full border border-outline px-6 py-3 text-sm font-semibold text-primary hover:bg-surface-container active:press-active"
        >
          <Sparkles className="size-4" />
          Онбординг: создать новый клуб
        </Link>

        <p className="text-center text-xs text-on-surface-variant">
          Material Design 3 · mobile-first · данные демонстрационные
        </p>
      </main>
    </div>
  );
}
