import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CalendarPlus,
  Flame,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { ClubShell } from "@/components/md3/shell";
import { CLUB, NEWS, PLAYERS, type NewsItem } from "@/lib/mock-data";

export const Route = createFileRoute("/club/")({
  head: () => ({
    meta: [
      { title: `Лента клуба «${CLUB.name}» — ttSetka` },
      { name: "description", content: "Новости клуба, карточка действующего чемпиона и итоги турниров." },
      { property: "og:title", content: `Лента клуба «${CLUB.name}»` },
      { property: "og:description", content: "Новости, чемпион клуба и автогенерируемые итоги турниров." },
    ],
  }),
  component: FeedPage,
});

const NEWS_ICONS: Record<NewsItem["type"], { icon: typeof Trophy; cls: string }> = {
  tournament: { icon: Trophy, cls: "bg-primary-container text-on-primary-container" },
  rating_up: { icon: TrendingUp, cls: "bg-success-container text-on-success-container" },
  badge: { icon: Award, cls: "bg-tertiary-container text-on-tertiary-container" },
  record: { icon: Flame, cls: "bg-error-container text-on-error-container" },
  announce: { icon: CalendarPlus, cls: "bg-secondary-container text-on-secondary-container" },
};

function ChampionCard() {
  const champion = PLAYERS.find((p) => p.crown === "current")!;
  return (
    <Link
      to="/club/profile"
      className="pressable relative block overflow-hidden rounded-4xl bg-primary p-5 shadow-elev-2 active:press-active"
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-20"
        style={{ backgroundColor: "var(--on-primary)" }}
      />
      <p className="text-xs font-semibold tracking-widest text-on-primary/80 uppercase">
        Действующий чемпион клуба
      </p>
      <div className="mt-4 flex items-center gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-on-primary/15">
          <Trophy className="size-8 fill-gold text-gold" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-title-l text-on-primary">{champion.name}</p>
          <p className="mt-0.5 text-sm text-on-primary/80">
            Титул защищён 21 августа
            <br />
            «Летний кубок 2026»
          </p>
        </div>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-on-primary/15 px-3 py-1.5 text-sm font-semibold text-on-primary">
        <Trophy className="size-4" />
        Рейтинг {champion.rating}
      </div>
    </Link>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const { icon: Icon, cls } = NEWS_ICONS[item.type];
  return (
    <article className="pressable flex gap-3.5 rounded-3xl bg-surface-container-low p-4 shadow-elev-1 hover:bg-surface-container active:press-active">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${cls}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <h3 className="text-title-m text-on-surface">{item.title}</h3>
        <p className="mt-1 text-sm leading-snug text-on-surface-variant">{item.description}</p>
        <p className="mt-2 text-xs font-medium text-on-surface-variant">{item.time}</p>
      </div>
    </article>
  );
}

function FeedPage() {
  return (
    <ClubShell nav="player">
      <div className="flex flex-col gap-3">
        <ChampionCard />
        <h2 className="mt-3 px-1 text-title-l text-on-surface">Новости клуба</h2>
        {NEWS.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </ClubShell>
  );
}
