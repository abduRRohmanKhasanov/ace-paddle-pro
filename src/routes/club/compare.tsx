import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Swords, UserRoundSearch } from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { CrownBadge, Sheet } from "@/components/md3/ui";
import {
  CLUB,
  CURRENT_PLAYER_ID,
  PLAYERS,
  playerById,
  winRate,
  type Player,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/club/compare")({
  head: () => ({
    meta: [
      { title: `Сравнение игроков — клуб «${CLUB.name}»` },
      { name: "description", content: "Построчное сравнение двух игроков и счёт личных встреч." },
      { property: "og:title", content: `Сравнение игроков — клуб «${CLUB.name}»` },
      { property: "og:description", content: "Рейтинг, уровень, матчи и личные встречи двух игроков." },
    ],
  }),
  component: ComparePage,
});

function CompareRow({
  label,
  a,
  b,
  format = (v: number) => String(v),
}: {
  label: string;
  a: number;
  b: number;
  format?: (v: number) => string;
}) {
  const aWins = a > b;
  const bWins = b > a;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-outline-variant py-3.5 last:border-0">
      <span
        className={cn(
          "text-right text-lg",
          aWins ? "font-bold text-success" : bWins ? "text-on-surface" : "text-on-surface-variant",
        )}
      >
        {format(a)}
      </span>
      <span className="px-2 text-center text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
        {label}
      </span>
      <span
        className={cn(
          "text-lg",
          bWins ? "font-bold text-success" : aWins ? "text-on-surface" : "text-on-surface-variant",
        )}
      >
        {format(b)}
      </span>
    </div>
  );
}

function ComparePage() {
  const me = playerById(CURRENT_PLAYER_ID);
  const [opponentId, setOpponentId] = useState("p2");
  const [pickerOpen, setPickerOpen] = useState(false);
  const opp = playerById(opponentId);

  const candidates = PLAYERS.filter((p) => p.id !== me.id);

  return (
    <ClubShell nav="player">
      <h1 className="mb-4 px-1 text-headline-s text-on-surface">Сравнение</h1>

      {/* VS-шапка */}
      <section className="rounded-4xl bg-surface-container-low p-5 shadow-elev-1">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <PlayerSide player={me} align="right" />
          <span className="mx-2 flex size-12 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-on-primary shadow-elev-1">
            VS
          </span>
          <PlayerSide player={opp} align="left" onPick={() => setPickerOpen(true)} />
        </div>

        <div className="mt-4">
          <CompareRow label="Рейтинг" a={me.rating} b={opp.rating} />
          <CompareRow
            label="Уровень"
            a={Number(me.level.slice(1))}
            b={Number(opp.level.slice(1))}
            format={(v) => `L${v}`}
          />
          <CompareRow label="Матчи" a={me.matches} b={opp.matches} />
          <CompareRow label="% побед" a={winRate(me)} b={winRate(opp)} format={(v) => `${v}%`} />
        </div>
      </section>

      {/* Личные встречи */}
      <section className="mt-4 rounded-3xl bg-surface-container-low p-5 shadow-elev-1">
        <div className="flex items-center gap-2">
          <Swords className="size-5 text-primary" />
          <h2 className="text-title-m text-on-surface">Личные встречи</h2>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-center">
            <p className="text-headline-l text-primary">5</p>
            <p className="text-xs text-on-surface-variant">{me.name.split(" ")[0]}</p>
          </div>
          <div className="mx-4 flex h-2.5 flex-1 overflow-hidden rounded-full">
            <div className="bg-primary" style={{ width: "62.5%" }} />
            <div className="bg-tertiary" style={{ width: "37.5%" }} />
          </div>
          <div className="text-center">
            <p className="text-headline-l text-tertiary">3</p>
            <p className="text-xs text-on-surface-variant">{opp.name.split(" ")[0]}</p>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-on-surface-variant">
          8 очных матчей · последний: победа {me.name.split(" ")[1]} 3:1
        </p>
      </section>

      <button
        onClick={() => setPickerOpen(true)}
        className="pressable mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-outline px-6 py-3.5 text-sm font-semibold text-primary hover:bg-surface-container active:press-active"
      >
        <UserRoundSearch className="size-4" />
        Сравнить с другим
      </button>

      <Sheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Выберите соперника">
        <div className="flex flex-col gap-1">
          {candidates.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setOpponentId(p.id);
                setPickerOpen(false);
              }}
              className={cn(
                "pressable flex items-center gap-3 rounded-2xl p-3 text-left active:press-active",
                p.id === opponentId
                  ? "bg-secondary-container"
                  : "hover:bg-surface-container",
              )}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant">
                <UserRoundSearch className="size-4" />
              </span>
              <span className="flex-1 text-title-m text-on-surface">{p.name}</span>
              <span className="text-sm font-semibold text-on-surface-variant">{p.rating}</span>
            </button>
          ))}
        </div>
      </Sheet>
    </ClubShell>
  );
}

function PlayerSide({
  player,
  align,
  onPick,
}: {
  player: Player;
  align: "left" | "right";
  onPick?: () => void;
}) {
  const content = (
    <>
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant">
        <UserRoundSearch className="size-6" />
      </span>
      <span className="mt-2 flex items-center gap-1 text-center text-sm leading-tight font-semibold text-on-surface">
        {player.name}
        <CrownBadge kind={player.crown} />
      </span>
    </>
  );
  const cls = cn(
    "flex flex-col items-center",
    align === "right" ? "items-end text-right" : "items-start text-left",
  );
  if (onPick) {
    return (
      <button onClick={onPick} className={cn("pressable active:press-active", cls)}>
        {content}
      </button>
    );
  }
  return <div className={cls}>{content}</div>;
}
