import { createFileRoute, Link } from "@tanstack/react-router";
import { BrainCircuit, ChevronRight, Info, Palette, ScrollText } from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { CLUB } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: `Настройки клуба «${CLUB.name}» — ttSetka` },
      { name: "description", content: "Информация о клубе, внешний вид, рейтинговое ядро и регламент." },
      { property: "og:title", content: `Настройки клуба «${CLUB.name}»` },
      { property: "og:description", content: "Редактирование параметров клуба после онбординга." },
    ],
  }),
  component: SettingsPage,
});

const SECTIONS = [
  {
    icon: Info,
    title: "Информация о клубе",
    caption: `${CLUB.name} · ${CLUB.subdomain}`,
    tint: "bg-primary-container text-on-primary-container",
  },
  {
    icon: Palette,
    title: "Внешний вид",
    caption: "Цвет клуба: Морская волна",
    tint: "bg-secondary-container text-on-secondary-container",
  },
  {
    icon: BrainCircuit,
    title: "Рейтинговое ядро",
    caption: `Текущее: ${CLUB.engine}`,
    tint: "bg-tertiary-container text-on-tertiary-container",
  },
  {
    icon: ScrollText,
    title: "Регламент клуба",
    caption: "Правила, которые видят игроки",
    tint: "bg-error-container text-on-error-container",
  },
];

function SettingsPage() {
  return (
    <ClubShell nav="admin">
      <h1 className="mb-4 px-1 text-headline-s text-on-surface">Настройки</h1>

      <div className="flex flex-col gap-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.title}
            to="/onboarding"
            className="pressable flex items-center gap-4 rounded-3xl bg-surface-container-low p-4 shadow-elev-1 hover:bg-surface-container active:press-active"
          >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${s.tint}`}>
              <s.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-title-m text-on-surface">{s.title}</span>
              <span className="block truncate text-sm text-on-surface-variant">{s.caption}</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-on-surface-variant" />
          </Link>
        ))}
      </div>

      <p className="mt-4 px-1 text-xs leading-relaxed text-on-surface-variant">
        Редакторы совпадают с шагами онбординга — клуб можно перенастроить в любой
        момент. Смена рейтингового ядра обнуляет историю рейтинга.
      </p>
    </ClubShell>
  );
}
