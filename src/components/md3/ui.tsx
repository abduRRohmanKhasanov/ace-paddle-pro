import { type ReactNode, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Crown,
  Minus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Level, Player } from "@/lib/mock-data";

/* ---------- Аватар с инициалами ---------- */
export function Avatar({
  player,
  size = 44,
  className,
}: {
  player: Pick<Player, "initials" | "avatarHue">;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        backgroundColor: `oklch(0.88 0.06 ${player.avatarHue})`,
        color: `oklch(0.35 0.08 ${player.avatarHue})`,
      }}
    >
      {player.initials}
    </div>
  );
}

/* ---------- Бейдж уровня L1/L2/L3 ---------- */
export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  const styles: Record<Level, string> = {
    L1: "bg-primary-container text-on-primary-container",
    L2: "bg-secondary-container text-on-secondary-container",
    L3: "bg-tertiary-container text-on-tertiary-container",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold tracking-wide",
        styles[level],
        className,
      )}
    >
      {level}
    </span>
  );
}

/* ---------- Корона чемпиона ---------- */
export function CrownBadge({ kind }: { kind: Player["crown"] }) {
  if (!kind) return null;
  return (
    <Crown
      className={cn(
        "inline size-4 shrink-0",
        kind === "current" ? "fill-gold text-gold" : "fill-outline-variant text-outline-variant",
      )}
      aria-label={kind === "current" ? "Действующий чемпион" : "Экс-чемпион"}
    />
  );
}

/* ---------- Место в рейтинге: медали топ-3 ---------- */
export function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="flex size-8 items-center justify-center text-sm font-semibold text-on-surface-variant">
        {rank}
      </span>
    );
  }
  const colors = {
    1: { bg: "var(--gold)", fg: "oklch(0.3 0.08 80)" },
    2: { bg: "var(--silver)", fg: "oklch(0.35 0.01 250)" },
    3: { bg: "var(--bronze)", fg: "oklch(0.95 0.02 70)" },
  } as const;
  const c = colors[rank as 1 | 2 | 3];
  return (
    <span
      className="flex size-8 items-center justify-center rounded-full text-sm font-bold shadow-elev-1"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {rank}
    </span>
  );
}

/* ---------- Тренд позиции (▲/▼/—) ---------- */
export function TrendBadge({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-success">
        <ArrowUp className="size-4" />
        {value}
        {suffix}
      </span>
    );
  if (value < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-error">
        <ArrowDown className="size-4" />
        {Math.abs(value)}
        {suffix}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-sm font-medium text-on-surface-variant">
      <Minus className="size-4" />
    </span>
  );
}

/* ---------- Точка статуса ---------- */
export function StatusDot({ tone }: { tone: "success" | "error" | "muted" }) {
  const cls = {
    success: "bg-success",
    error: "bg-error",
    muted: "bg-outline",
  }[tone];
  return <span className={cn("inline-block size-2.5 rounded-full", cls)} />;
}

/* ---------- MD3 Bottom Sheet (модалка) ---------- */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        aria-label="Закрыть"
        className="absolute inset-0 animate-fade-in bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        className="relative flex max-h-[92dvh] w-full max-w-md animate-sheet-in flex-col overflow-hidden rounded-t-4xl bg-surface-container-low shadow-elev-3 sm:rounded-4xl"
      >
        <div className="mx-auto mt-3 h-1 w-8 rounded-full bg-outline-variant sm:hidden" />
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 className="text-title-l">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="pressable flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high active:press-active"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 pb-8">{children}</div>
      </div>
    </div>
  );
}

/* ---------- MD3 Switch ---------- */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "pressable relative h-8 w-13 shrink-0 rounded-full border-2 transition-colors",
        checked ? "border-primary bg-primary" : "border-outline bg-surface-container-highest",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 rounded-full transition-all",
          checked
            ? "left-[calc(100%-1.5rem)] size-6 bg-on-primary"
            : "left-1 size-4 bg-outline",
        )}
      />
    </button>
  );
}

/* ---------- MD3 Segmented filter (фильтр уровней) ---------- */
export function LevelFilter({
  value,
  onChange,
}: {
  value: Level | "all";
  onChange: (v: Level | "all") => void;
}) {
  const options: { id: Level | "all"; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "L1", label: "L1" },
    { id: "L2", label: "L2" },
    { id: "L3", label: "L3" },
  ];
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "pressable rounded-full px-4 py-2 text-sm font-semibold transition-colors active:press-active",
            value === o.id
              ? "bg-secondary-container text-on-secondary-container"
              : "border border-outline-variant text-on-surface-variant hover:bg-surface-container",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Пустое состояние ---------- */
export function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-surface-container-low px-6 py-10 text-center">
      <div className="text-on-surface-variant">{icon}</div>
      <p className="text-sm text-on-surface-variant">{text}</p>
    </div>
  );
}
