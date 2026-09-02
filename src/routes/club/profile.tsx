import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BrickWall,
  ChevronDown,
  Flame,
  Gem,
  GitCompareArrows,
  RotateCcw,
  Shield,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { CrownBadge, LevelBadge, TrendBadge } from "@/components/md3/ui";
import {
  AWARDS,
  CLUB,
  CURRENT_PLAYER_MATCHES,
  CURRENT_PLAYER_ID,
  RATING_HISTORY,
  playerById,
  rankOf,
  winRate,
  type Award,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/club/profile")({
  head: () => ({
    meta: [
      { title: `Профиль игрока — клуб «${CLUB.name}»` },
      { name: "description", content: "Рейтинг, награды, история матчей и динамика игрока." },
      { property: "og:title", content: `Профиль игрока — клуб «${CLUB.name}»` },
      { property: "og:description", content: "Награды, матчи и история рейтинга игрока клуба." },
    ],
  }),
  component: ProfilePage,
});

const AWARD_ICONS: Record<string, typeof Shield> = {
  shield: Shield,
  zap: Zap,
  flame: Flame,
  rotate: RotateCcw,
  gem: Gem,
  timer: Timer,
  target: Target,
  brick: BrickWall,
};

type Tab = "awards" | "matches" | "rating";
const TABS: { id: Tab; label: string }[] = [
  { id: "awards", label: "Награды" },
  { id: "matches", label: "Матчи" },
  { id: "rating", label: "Рейтинг" },
];

function AwardCard({ award }: { award: Award }) {
  const Icon = AWARD_ICONS[award.icon] ?? Shield;
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2.5 rounded-3xl p-4 text-center shadow-elev-1",
        award.earned
          ? "bg-tertiary-container text-on-tertiary-container"
          : "bg-surface-container-low text-on-surface-variant opacity-55",
      )}
    >
      <span
        className={cn(
          "flex size-12 items-center justify-center rounded-full",
          award.earned ? "bg-tertiary text-on-tertiary" : "bg-surface-container-highest",
        )}
      >
        <Icon className="size-6" />
      </span>
      <span className="text-xs leading-tight font-semibold">{award.name}</span>
    </div>
  );
}

function RatingChart() {
  const points = [1620, 1645, 1638, 1660, 1672, 1663, 1701];
  const w = 320;
  const h = 90;
  const min = Math.min(...points) - 10;
  const max = Math.max(...points) + 10;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (w - 16) + 8;
    const y = h - 12 - ((p - min) / (max - min)) * (h - 28);
    return [x, y] as const;
  });
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="График динамики рейтинга">
      <path d={`${path} L${w - 8},${h - 4} L8,${h - 4} Z`} fill="var(--primary-container)" opacity={0.4} />
      <path d={path} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="var(--primary)" />
      ))}
    </svg>
  );
}

function ProfilePage() {
  const [tab, setTab] = useState<Tab>("awards");
  const [period, setPeriod] = useState("месяц");
  const [expanded, setExpanded] = useState<string | null>(null);
  const me = playerById(CURRENT_PLAYER_ID);

  return (
    <ClubShell nav="player">
      {/* Шапка профиля */}
      <section className="rounded-4xl bg-surface-container-low p-5 shadow-elev-1">
        <div className="min-w-0">
          <h1 className="flex items-center gap-1.5 text-title-l text-on-surface">
            {me.name}
            <CrownBadge kind={me.crown} />
          </h1>
          <p className="mt-0.5 text-sm text-on-surface-variant">
            В клубе {me.joinedAt} · {rankOf(me.id)} место в рейтинге
          </p>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="text-display-s leading-none text-on-surface">{me.rating}</span>
          <span className="pb-1.5">
            <TrendBadge value={me.trend} suffix=" поз." />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-4 divide-x divide-outline-variant rounded-2xl bg-surface-container py-3">
          {[
            { label: "Матчи", value: String(me.matches) },
            { label: "Победы", value: String(me.wins) },
            { label: "% побед", value: `${winRate(me)}%` },
          ].map((s) => (
            <div key={s.label} className="px-1 text-center">
              <p className="text-lg font-bold text-on-surface">{s.value}</p>
              <p className="text-[11px] text-on-surface-variant">{s.label}</p>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <LevelBadge level={me.level} />
            <p className="text-[11px] text-on-surface-variant">Уровень</p>
          </div>
        </div>
      </section>

      {/* Вкладки */}
      <div className="mt-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "pressable flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors active:press-active",
              tab === t.id
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface-variant hover:bg-surface-container",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "awards" && (
          <div className="grid grid-cols-2 gap-3">
            {AWARDS.map((a) => (
              <AwardCard key={a.id} award={a} />
            ))}
          </div>
        )}

        {tab === "matches" && (
          <div className="flex flex-col gap-2">
            {CURRENT_PLAYER_MATCHES.map((m) => {
              const opp = playerById(m.opponentId);
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-3xl bg-surface-container-low p-3 shadow-elev-1"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-title-m text-on-surface">{opp.name}</p>
                    <p className="text-xs text-on-surface-variant">{m.date} · сеты {m.sets}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold",
                      m.won
                        ? "bg-success-container text-on-success-container"
                        : "bg-error-container text-on-error-container",
                    )}
                  >
                    {m.won ? "Победа" : "Поражение"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {tab === "rating" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-surface-container-low p-5 shadow-elev-1">
              <div className="flex items-center justify-between">
                <p className="text-title-m text-on-surface">Динамика</p>
                <div className="flex gap-1.5">
                  {["неделя", "месяц", "год", "всё"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        period === p
                          ? "bg-primary text-on-primary"
                          : "text-on-surface-variant hover:bg-surface-container",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <RatingChart />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {RATING_HISTORY.map((entry) => (
                <div
                  key={entry.id}
                  className="overflow-hidden rounded-3xl bg-surface-container-low shadow-elev-1"
                >
                  <button
                    className="flex w-full items-center gap-3 p-4 text-left"
                    onClick={() =>
                      entry.kind === "tournament" &&
                      setExpanded(expanded === entry.id ? null : entry.id)
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-title-m text-on-surface">{entry.title}</p>
                      <p className="text-xs text-on-surface-variant">{entry.date}</p>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        entry.delta >= 0 ? "text-success" : "text-error",
                      )}
                    >
                      {entry.delta >= 0 ? "+" : ""}
                      {entry.delta}
                    </span>
                    {entry.kind === "tournament" && (
                      <ChevronDown
                        className={cn(
                          "size-4 text-on-surface-variant transition-transform",
                          expanded === entry.id && "rotate-180",
                        )}
                      />
                    )}
                  </button>
                  {entry.kind === "tournament" && expanded === entry.id && entry.matches && (
                    <div className="flex flex-col gap-1 border-t border-outline-variant px-4 py-3">
                      {entry.matches.map((m, i) => {
                        const opp = playerById(m.opponentId);
                        return (
                          <div key={i} className="flex items-center gap-2 py-1 text-sm">
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                m.won ? "bg-success" : "bg-error",
                              )}
                            />
                            <span className="flex-1 truncate text-on-surface">
                              {opp.name} · {m.sets}
                            </span>
                            <span
                              className={cn(
                                "font-semibold",
                                m.delta >= 0 ? "text-success" : "text-error",
                              )}
                            >
                              {m.delta >= 0 ? "+" : ""}
                              {m.delta}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link
        to="/club/compare"
        className="pressable mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-elev-1 active:press-active"
      >
        <GitCompareArrows className="size-4" />
        Сравнить с другим игроком
      </Link>
    </ClubShell>
  );
}
