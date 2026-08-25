import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Check, ChevronRight, Plus, Zap } from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { Sheet, Switch } from "@/components/md3/ui";
import { CLUB, TOURNAMENTS, type Level, type Tournament } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/tournaments")({
  head: () => ({
    meta: [
      { title: `Турниры — клуб «${CLUB.name}»` },
      { name: "description", content: "Создание турниров, форматы сетки и влияние на рейтинг клуба." },
      { property: "og:title", content: `Турниры — клуб «${CLUB.name}»` },
      { property: "og:description", content: "Круговая, олимпийка, группы и пары — форматы турниров клуба." },
    ],
  }),
  component: TournamentsPage,
});

const FORMATS = [
  { id: "round", name: "Круговая", desc: "Каждый играет с каждым. Точнее, но дольше", tag: null },
  { id: "olympic", name: "Олимпийка", desc: "Выбывание после одного поражения", tag: "Быстрый турнир" },
  { id: "groups", name: "Группы + два финала", desc: "Второй финал изолирован и не влияет на первый", tag: null },
  { id: "pairs", name: "Пары + два финала", desc: "Победитель второго финала получает «дикую карту» в первый", tag: null },
];

const STATUS_LABEL: Record<Tournament["status"], { text: string; cls: string }> = {
  active: { text: "Идёт сейчас", cls: "bg-success-container text-on-success-container" },
  upcoming: { text: "Скоро", cls: "bg-secondary-container text-on-secondary-container" },
  finished: { text: "Завершён", cls: "bg-surface-container-highest text-on-surface-variant" },
};

function CreateTournamentSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [format, setFormat] = useState("round");
  const [affects, setAffects] = useState(true);
  const [level, setLevel] = useState<Level | "all">("all");

  return (
    <Sheet open={open} onClose={onClose} title="Новый турнир">
      <div className="flex flex-col gap-4 pt-2">
        <label className="block">
          <span className="text-label-l text-on-surface-variant">Название</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Кубок осени"
            className="mt-1.5 w-full rounded-2xl border border-outline bg-surface px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-label-l text-on-surface-variant">Начало</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-outline bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="text-label-l text-on-surface-variant">Конец</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-outline bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </label>
        </div>

        <div>
          <span className="text-label-l text-on-surface-variant">Формат</span>
          <div className="mt-1.5 flex flex-col gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "pressable flex items-start gap-3 rounded-2xl border p-3.5 text-left active:press-active",
                  format === f.id
                    ? "border-primary bg-primary-container/50"
                    : "border-outline-variant hover:bg-surface-container",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    format === f.id ? "border-primary bg-primary" : "border-outline",
                  )}
                >
                  {format === f.id && <Check className="size-3 text-on-primary" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-title-m text-on-surface">
                    {f.name}
                    {f.tag && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
                        <Zap className="size-3" />
                        {f.tag}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-on-surface-variant">{f.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-surface-container p-4">
          <div>
            <p className="text-title-m text-on-surface">Учитывать в рейтинге клуба</p>
            <p className="text-xs text-on-surface-variant">
              Не все турниры должны влиять на рейтинг
            </p>
          </div>
          <Switch checked={affects} onChange={setAffects} label="Учитывать в рейтинге клуба" />
        </div>

        <div>
          <span className="text-label-l text-on-surface-variant">Кто может участвовать</span>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "Все уровни" },
                { id: "L1", label: "L1" },
                { id: "L2", label: "L2" },
                { id: "L3", label: "L3" },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                onClick={() => setLevel(o.id)}
                className={cn(
                  "pressable rounded-full px-4 py-2 text-sm font-semibold active:press-active",
                  level === o.id
                    ? "bg-secondary-container text-on-secondary-container"
                    : "border border-outline-variant text-on-surface-variant",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={!name.trim()}
          className="pressable mt-2 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-elev-1 active:press-active disabled:opacity-40"
        >
          Создать турнир
        </button>
      </div>
    </Sheet>
  );
}

function TournamentsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <ClubShell nav="admin">
      <h1 className="mb-4 px-1 text-headline-s text-on-surface">Турниры</h1>

      <div className="flex flex-col gap-2">
        {TOURNAMENTS.map((t) => {
          const st = STATUS_LABEL[t.status];
          return (
            <div
              key={t.id}
              className="rounded-3xl bg-surface-container-low p-4 shadow-elev-1"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-title-m text-on-surface">{t.name}</p>
                  <p className="mt-0.5 text-sm text-on-surface-variant">
                    {t.format} · {t.dates}
                  </p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-bold", st.cls)}>
                  {st.text}
                </span>
              </div>

              {t.status === "active" && t.played != null && t.total != null && (
                <>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((t.played / t.total) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-on-surface-variant">
                    Сыграно {t.played} из {t.total} матчей
                  </p>
                  <Link
                    to="/admin/referees"
                    className="pressable mt-3 flex items-center justify-center gap-1.5 rounded-full bg-secondary-container px-4 py-2.5 text-sm font-semibold text-on-secondary-container active:press-active"
                  >
                    Судьи и столы
                    <ChevronRight className="size-4" />
                  </Link>
                </>
              )}

              {t.status !== "active" && (
                <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant">
                  <CalendarDays className="size-3.5" />
                  {t.participants ? `${t.participants} участников · ` : ""}
                  {t.affectsRating ? "учитывается в рейтинге" : "вне рейтинга"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        aria-label="Создать турнир"
        className="pressable fixed right-[max(1rem,calc(50%-13rem))] bottom-24 z-40 flex h-14 items-center gap-2 rounded-2xl bg-primary px-5 text-on-primary shadow-elev-3 active:press-active"
      >
        <Plus className="size-6" />
        <span className="text-sm font-semibold">Турнир</span>
      </button>

      <CreateTournamentSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </ClubShell>
  );
}
