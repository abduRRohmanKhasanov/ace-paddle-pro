import { createFileRoute } from "@tanstack/react-router";
import { Code2, Clock, Headset, Send, UserCog } from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { CLUB } from "@/lib/mock-data";

export const Route = createFileRoute("/club/rules")({
  head: () => ({
    meta: [
      { title: `Регламент клуба «${CLUB.name}» — RallyPoint` },
      { name: "description", content: "Правила платформы, регламент клуба и каналы связи." },
      { property: "og:title", content: `Регламент клуба «${CLUB.name}»` },
      { property: "og:description", content: "Два уровня правил и контакты: администратор, поддержка, разработчик." },
    ],
  }),
  component: RulesPage,
});

const PLATFORM_RULES = [
  "Официальный результат матча фиксирует судья стола или администратор клуба.",
  "Рейтинг пересчитывается автоматически после каждого утверждённого результата.",
  "Уважительное поведение обязательно: спорные ситуации решает администратор клуба.",
  "Турниры, отмеченные «вне рейтинга», не влияют на позиции в таблице клуба.",
];

const CLUB_RULES = [
  "Играем в сменной обуви с немаркой подошвой.",
  "Бронирование стола — не более 2 часов подряд в прайм-тайм.",
  "Опоздание на турнирный матч более чем на 10 минут — техническое поражение.",
  "Гости клуба допускаются на товарищеские матчи по согласованию с администратором.",
];

function RuleSection({
  title,
  caption,
  rules,
}: {
  title: string;
  caption: string;
  rules: string[];
}) {
  return (
    <section className="rounded-3xl bg-surface-container-low p-5 shadow-elev-1">
      <h2 className="text-title-l text-on-surface">{title}</h2>
      <p className="mt-1 text-xs text-on-surface-variant">{caption}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {rules.map((rule, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-on-surface">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-container text-[11px] font-bold text-on-primary-container">
              {i + 1}
            </span>
            {rule}
          </li>
        ))}
      </ul>
    </section>
  );
}

function RulesPage() {
  return (
    <ClubShell nav="player">
      <h1 className="mb-4 px-1 text-headline-s text-on-surface">Регламент</h1>

      <div className="flex flex-col gap-4">
        <RuleSection
          title="Правила платформы"
          caption="Одинаковы для всех клубов RallyPoint, не редактируются клубом"
          rules={PLATFORM_RULES}
        />
        <RuleSection
          title={`Регламент клуба «${CLUB.name}»`}
          caption="Установлен администратором клуба"
          rules={CLUB_RULES}
        />

        <section className="rounded-3xl bg-surface-container-low p-5 shadow-elev-1">
          <h2 className="text-title-l text-on-surface">Связь</h2>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="#"
              className="pressable flex items-center gap-3 rounded-2xl bg-surface-container p-3.5 active:press-active"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                <UserCog className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-title-m text-on-surface">Администратор клуба</span>
                <span className="text-sm text-on-surface-variant">{CLUB.adminTelegram}</span>
              </span>
              <Send className="size-4 text-primary" />
            </a>

            <div className="flex items-center gap-3 rounded-2xl bg-surface-container p-3.5 opacity-55">
              <span className="flex size-10 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant">
                <Headset className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-title-m text-on-surface">Поддержка платформы</span>
                <span className="inline-flex items-center gap-1 text-sm text-on-surface-variant">
                  <Clock className="size-3.5" /> Появится в следующих версиях
                </span>
              </span>
            </div>

            <a
              href="#"
              className="pressable flex items-center gap-3 rounded-2xl bg-surface-container p-3.5 active:press-active"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                <Code2 className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-title-m text-on-surface">Разработчик</span>
                <span className="text-sm text-on-surface-variant">{CLUB.developerTelegram}</span>
              </span>
              <Send className="size-4 text-primary" />
            </a>
          </div>
        </section>
      </div>
    </ClubShell>
  );
}
