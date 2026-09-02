import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Camera, MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { EmptyState, LevelBadge, Sheet } from "@/components/md3/ui";
import { CLUB, PLAYERS, type Player } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/players")({
  head: () => ({
    meta: [
      { title: `Игроки — клуб «${CLUB.name}»` },
      { name: "description", content: "Список игроков клуба, поиск и добавление карточек." },
      { property: "og:title", content: `Игроки — клуб «${CLUB.name}»` },
      { property: "og:description", content: "Карточки игроков без аккаунтов: рейтинг, уровень, редактирование." },
    ],
  }),
  component: PlayersPage,
});

function PlayerRow({
  player,
  onDelete,
}: {
  player: Player;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-3 rounded-3xl bg-surface-container-low p-3 shadow-elev-1">
      <div className="min-w-0 flex-1">
        <p className="truncate text-title-m text-on-surface">{player.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-on-surface">{player.rating}</span>
          <LevelBadge level={player.level} />
        </div>
      </div>
      <div className="relative" ref={ref}>
        <button
          aria-label={`Действия с игроком ${player.name}`}
          onClick={() => setMenuOpen((v) => !v)}
          className="pressable flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container active:press-active"
        >
          <MoreVertical className="size-5" />
        </button>
        {menuOpen && (
          <>
            <button
              aria-label="Закрыть меню"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 z-20 w-44 animate-spring-pop overflow-hidden rounded-2xl bg-surface-container-high py-1 shadow-elev-2">
              <button
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-highest"
              >
                <Pencil className="size-4" /> Редактировать
              </button>
              <button
                onClick={() => onDelete(player.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-surface-container-highest"
              >
                <Trash2 className="size-4" /> Удалить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AddPlayerSheet({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (p: Player) => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(String(CLUB.defaultRating));
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    const parts = name.trim().split(/\s+/);
    const initials = parts
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
    onAdd({
      id: `p${Date.now()}`,
      name: name.trim(),
      initials: initials || "??",
      rating: Number(rating) || CLUB.defaultRating,
      level: "L3",
      matches: 0,
      wins: 0,
      trend: 0,
      crown: null,
      joinedAt: "сегодня",
      avatarHue: Math.floor(Math.random() * 360),
    });
    setName("");
    setPhone("");
    setRating(String(CLUB.defaultRating));
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Новый игрок">
      <div className="flex flex-col gap-4 pt-2">
        <button className="pressable mx-auto flex size-20 flex-col items-center justify-center gap-1 rounded-full bg-surface-container-high text-on-surface-variant active:press-active">
          <Camera className="size-6" />
          <span className="text-[10px] font-medium">Фото</span>
        </button>
        <p className="-mt-2 text-center text-xs text-on-surface-variant">
          Необязательно — без фото будут инициалы
        </p>

        <label className="block">
          <span className="text-label-l text-on-surface-variant">Имя и фамилия *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван Иванов"
            className="mt-1.5 w-full rounded-2xl border border-outline bg-surface px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="block">
          <span className="text-label-l text-on-surface-variant">Начальный рейтинг</span>
          <input
            value={rating}
            onChange={(e) => setRating(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            className="mt-1.5 w-full rounded-2xl border border-outline bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <span className="mt-1 block text-xs text-on-surface-variant">
            Предзаполнен значением клуба по умолчанию
          </span>
        </label>

        <label className="block">
          <span className="text-label-l text-on-surface-variant">Телефон</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 900 000-00-00"
            inputMode="tel"
            className="mt-1.5 w-full rounded-2xl border border-outline bg-surface px-4 py-3 text-on-surface outline-none placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <span className="mt-1 block text-xs text-on-surface-variant">
            Понадобится, если игрок позже привяжет аккаунт
          </span>
        </label>

        <button
          onClick={submit}
          disabled={!name.trim()}
          className="pressable mt-2 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-elev-1 active:press-active disabled:opacity-40"
        >
          Добавить игрока
        </button>
      </div>
    </Sheet>
  );
}

function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>(PLAYERS);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(
    () =>
      players.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [players, query],
  );

  return (
    <ClubShell nav="admin">
      <h1 className="mb-4 px-1 text-headline-s text-on-surface">
        Игроки · {players.length}
      </h1>

      <div className="mb-4 flex items-center gap-3 rounded-full bg-surface-container-high px-4 py-3">
        <Search className="size-5 shrink-0 text-on-surface-variant" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени"
          className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
        />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            onDelete={(id) => setPlayers((prev) => prev.filter((x) => x.id !== id))}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState
            icon={<Search className="size-8" />}
            text="Никого не нашлось. Попробуйте изменить запрос."
          />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        aria-label="Добавить игрока"
        className="pressable fixed right-[max(1rem,calc(50%-13rem))] bottom-24 z-40 flex h-14 items-center gap-2 rounded-2xl bg-primary px-5 text-on-primary shadow-elev-3 active:press-active"
      >
        <Plus className="size-6" />
        <span className="text-sm font-semibold">Игрок</span>
      </button>

      <AddPlayerSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdd={(p) => setPlayers((prev) => [...prev, p])}
      />
    </ClubShell>
  );
}
