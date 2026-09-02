import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Flag, Undo2 } from "lucide-react";
import { TOURNAMENTS, playerById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/referee")({
  head: () => ({
    meta: [
      { title: "Судейский режим — Стол 3 · ttSetka" },
      { name: "description", content: "Живой счёт на столе без входа в аккаунт: очки, подача, сеты." },
      { property: "og:title", content: "Судейский режим — Стол 3" },
      { property: "og:description", content: "Ведение живого счёта матча настольного тенниса." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RefereePage,
});

interface Snapshot {
  a: number;
  b: number;
  setsA: number;
  setsB: number;
}

const PLAYER_A = playerById("p4"); // Орлов
const PLAYER_B = playerById("p5"); // Соколов

function plural(n: number, forms: [string, string, string]) {
  const m = Math.abs(n) % 100;
  const d = m % 10;
  if (m > 10 && m < 20) return forms[2];
  if (d > 1 && d < 5) return forms[1];
  if (d === 1) return forms[0];
  return forms[2];
}

function RefereePage() {
  const tournament = TOURNAMENTS.find((t) => t.status === "active")!;
  const [{ a, b, setsA, setsB }, setScore] = useState<Snapshot>({
    a: 0,
    b: 0,
    setsA: 0,
    setsB: 0,
  });
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [sent, setSent] = useState(false);

  const deuce = a >= 10 && b >= 10;
  const total = a + b;
  const server: "a" | "b" = deuce
    ? (total - 20) % 2 === 0
      ? "a"
      : "b"
    : Math.floor(total / 2) % 2 === 0
      ? "a"
      : "b";
  const servesLeft = deuce ? 1 : 2 - (total % 2);

  const setWon = (a >= 11 || b >= 11) && Math.abs(a - b) >= 2;
  const currentSet = setsA + setsB + 1;
  const decidingSet = currentSet === 3;
  const matchOver = setsA === 2 || setsB === 2;

  const addPoint = (side: "a" | "b") => {
    if (setWon || matchOver || sent) return;
    setHistory((h) => [...h, { a, b, setsA, setsB }]);
    setScore((s) => ({ ...s, [side]: s[side] + 1 }));
  };

  const undo = () => {
    setHistory((h) => {
      const last = h[h.length - 1];
      if (!last) return h;
      setScore(last);
      return h.slice(0, -1);
    });
  };

  const finishSet = () => {
    if (!setWon || matchOver) return;
    setHistory((h) => [...h, { a, b, setsA, setsB }]);
    setScore({
      a: 0,
      b: 0,
      setsA: setsA + (a > b ? 1 : 0),
      setsB: setsB + (b > a ? 1 : 0),
    });
  };

  const PlayerBlock = ({ side }: { side: "a" | "b" }) => {
    const player = side === "a" ? PLAYER_A : PLAYER_B;
    const score = side === "a" ? a : b;
    const isServer = server === side;
    return (
      <button
        onClick={() => addPoint(side)}
        disabled={setWon || matchOver || sent}
        aria-label={`Очко: ${player.name}`}
        className={cn(
          "pressable relative flex flex-1 flex-col items-center justify-center gap-1 rounded-4xl shadow-elev-1 transition-colors active:press-active disabled:opacity-90",
          isServer
            ? "bg-primary text-on-primary shadow-elev-2"
            : "bg-surface-container-low text-on-surface",
        )}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          {isServer && (
            <span
              className={cn(
                "size-2.5 rounded-full",
                isServer ? "bg-on-primary" : "bg-primary",
              )}
            />
          )}
          {player.name}
        </span>
        <span className="text-[5.5rem] leading-none font-extrabold tabular-nums">
          {score}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            isServer ? "text-on-primary/80" : "text-on-surface-variant",
          )}
        >
          {isServer ? "Подаёт" : "На приёме"}
        </span>
      </button>
    );
  };

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      {/* Минимальная шапка — без клубного nav */}
      <header className="mx-auto w-full max-w-md px-5 pt-5 pb-3 text-center">
        <p className="text-title-m text-on-surface">
          {tournament.name} · Стол 3
        </p>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          Судейский режим · без входа в аккаунт
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-1.5 text-sm font-semibold text-on-secondary-container">
          Сет {Math.min(currentSet, 3)} · Сеты {setsA}:{setsB}
        </div>
      </header>

      {sent ? (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="flex size-20 animate-spring-pop items-center justify-center rounded-full bg-success-container text-on-success-container">
            <Check className="size-10" />
          </span>
          <h1 className="text-headline-s text-on-surface">Результат отправлен</h1>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {PLAYER_A.name} — {PLAYER_B.name} · сеты {setsA}:{setsB}. Сетка турнира
            и рейтинги обновятся автоматически.
          </p>
        </div>
      ) : (
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 px-4 pb-6">
          {/* Тап-блоки счёта */}
          <div className="flex min-h-64 flex-1 gap-3">
            <PlayerBlock side="a" />
            <PlayerBlock side="b" />
          </div>

          {/* Подсказки */}
          <div className="rounded-2xl bg-surface-container-low px-4 py-3 text-center">
            <p className="text-sm text-on-surface">
              {setWon
                ? "Сет решён — нажмите «Завершить сет»"
                : deuce
                  ? "Баланс: подача меняется каждое очко"
                  : `Смена подачи через ${servesLeft} ${plural(servesLeft, ["очко", "очка", "очков"])}`}
            </p>
            {decidingSet && !setWon && (
              <p className="mt-1 text-xs text-on-surface-variant">
                В решающем сете игроки меняются сторонами при 5 очках лидера
              </p>
            )}
            {matchOver && (
              <p className="mt-1 text-xs font-semibold text-on-surface-variant">
                Матч завершён · сеты {setsA}:{setsB}
              </p>
            )}
          </div>

          {/* Действия */}
          {matchOver ? (
            <button
              onClick={() => setSent(true)}
              className="pressable flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-on-primary shadow-elev-2 active:press-active"
            >
              <Flag className="size-5" />
              Отправить результат
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={undo}
                disabled={history.length === 0}
                className="pressable flex flex-1 items-center justify-center gap-2 rounded-full border border-outline px-4 py-3.5 text-sm font-semibold text-primary active:press-active disabled:opacity-40"
              >
                <Undo2 className="size-4" />
                Отменить очко
              </button>
              <button
                onClick={finishSet}
                disabled={!setWon}
                className="pressable flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-on-primary shadow-elev-1 active:press-active disabled:opacity-40"
              >
                <Flag className="size-4" />
                Завершить сет
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
