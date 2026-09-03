import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Trophy, Users } from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { ADMIN_ACTIVITY, CLUB, PLAYERS, TOURNAMENTS } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: `Дашборд администратора — клуб «${CLUB.name}»` },
      { name: "description", content: "Активный турнир, быстрый доступ к игрокам и последняя активность клуба." },
      { property: "og:title", content: `Дашборд администратора — клуб «${CLUB.name}»` },
      { property: "og:description", content: "Управление турниром, игроками и активность клуба." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const active = TOURNAMENTS.find((t) => t.status === "active")!;
  const finished = TOURNAMENTS.filter((t) => t.status === "finished").length;
  const progress = Math.round(((active.played ?? 0) / (active.total ?? 1)) * 100);

  return (
    <ClubShell nav="admin">
      <h1 className="mb-4 px-1 text-headline-s text-on-surface">Дашборд</h1>

      {/* Активный турнир */}
      <section className="rounded-4xl bg-primary-container p-5 shadow-elev-1">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-primary-container opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-on-primary-container" />
          </span>
          <p className="text-xs font-semibold tracking-widest text-on-primary-container uppercase">
            Идёт турнир
          </p>
        </div>
        <h2 className="mt-2 text-title-l text-on-primary-container">{active.name}</h2>
        <p className="mt-1 text-sm text-on-primary-container/80">
          {active.format} · сыграно {active.played} из {active.total} матчей
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-on-primary-container/15">
          <div
            className="h-full rounded-full bg-on-primary-container transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <Link
          to="/admin/referees"
          className="pressable mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-on-primary-container px-6 py-3 text-sm font-semibold text-primary-container active:press-active"
        >
          Управлять турниром
          <ChevronRight className="size-4" />
        </Link>
      </section>

      {/* Тайлы быстрого доступа */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/admin/players"
          className="pressable flex flex-col justify-between rounded-3xl bg-surface-container-low p-4 shadow-elev-1 hover:bg-surface-container active:press-active"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
              <Users className="size-5" />
            </span>
            <span className="text-headline-l font-bold text-on-surface">{PLAYERS.length}</span>
          </div>
          <p className="text-title-m font-bold text-on-surface">Игроки</p>
        </Link>
        <Link
          to="/admin/tournaments"
          className="pressable flex flex-col justify-between rounded-3xl bg-surface-container-low p-4 shadow-elev-1 hover:bg-surface-container active:press-active"
        >
          <div className="flex items-start justify-between">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-tertiary-container text-on-tertiary-container">
              <Trophy className="size-5" />
            </span>
            <span className="text-headline-l font-bold text-on-surface">{finished}</span>
          </div>
          <p className="text-title-m font-bold text-on-surface">Турниров завершено</p>
        </Link>
      </div>

      {/* Активность */}
      <section className="mt-4 rounded-3xl bg-surface-container-low p-5 shadow-elev-1">
        <h2 className="text-title-m text-on-surface">Последняя активность</h2>
        <ul className="mt-3 flex flex-col divide-y divide-outline-variant">
          {ADMIN_ACTIVITY.map((a) => (
            <li key={a.id} className="flex items-baseline justify-between gap-3 py-2.5">
              <span className="text-sm text-on-surface">{a.text}</span>
              <span className="shrink-0 text-xs text-on-surface-variant">{a.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </ClubShell>
  );
}
