import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ClubShell } from "@/components/md3/shell";
import {
  CrownBadge,
  LevelBadge,
  LevelFilter,
  RankBadge,
  TrendBadge,
} from "@/components/md3/ui";
import {
  CLUB,
  CURRENT_PLAYER_ID,
  rankedPlayers,
  type Level,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/club/rating")({
  head: () => ({
    meta: [
      { title: `Рейтинг клуба «${CLUB.name}» — RallyPoint` },
      { name: "description", content: "Полный рейтинг игроков клуба с медалями топ-3 и трендом позиций." },
      { property: "og:title", content: `Рейтинг клуба «${CLUB.name}»` },
      { property: "og:description", content: "Места, уровни L1–L3 и динамика позиций после последнего турнира." },
    ],
  }),
  component: RatingPage,
});

function RatingPage() {
  const [level, setLevel] = useState<Level | "all">("all");
  const players = rankedPlayers.filter((p) => level === "all" || p.level === level);

  return (
    <ClubShell nav="player">
      <div className="mb-4 flex items-center justify-between px-1">
        <h1 className="text-headline-s text-on-surface">Рейтинг</h1>
        <LevelFilter value={level} onChange={setLevel} />
      </div>

      <div className="flex flex-col gap-2">
        {players.map((p) => {
          const rank = rankedPlayers.indexOf(p) + 1;
          const isMe = p.id === CURRENT_PLAYER_ID;
          return (
            <Link
              key={p.id}
              to="/club/profile"
              className={cn(
                "pressable flex items-center gap-3 rounded-3xl p-3 shadow-elev-1 active:press-active",
                isMe
                  ? "bg-secondary-container/60 outline-2 outline-secondary"
                  : "bg-surface-container-low hover:bg-surface-container",
              )}
            >
              <RankBadge rank={rank} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-title-m text-on-surface">
                  {p.name}
                  <CrownBadge kind={p.crown} />
                  {isMe && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-on-secondary">
                      Вы
                    </span>
                  )}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <LevelBadge level={p.level} />
                  <span className="text-sm font-semibold text-on-surface">{p.rating}</span>
                </div>
              </div>
              <TrendBadge value={p.trend} />
            </Link>
          );
        })}
      </div>

      <p className="mt-4 px-1 text-xs text-on-surface-variant">
        Тренд — изменение позиции в таблице после последнего турнира.
      </p>
    </ClubShell>
  );
}
