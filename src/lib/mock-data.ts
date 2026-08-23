// Мок-данные прототипа клуба «ТопСпин» (платформа RallyPoint)

export type Level = "L1" | "L2" | "L3";

export interface Player {
  id: string;
  name: string;
  initials: string;
  rating: number;
  level: Level;
  matches: number;
  wins: number;
  trend: number; // изменение позиции за последний турнир
  crown: "current" | "former" | null;
  joinedAt: string;
  avatarHue: number;
}

export const CLUB = {
  name: "ТопСпин",
  subdomain: "topspin.rallypoint.app",
  engine: "Glicko-2",
  defaultRating: 1200,
  adminTelegram: "@topspin_admin",
  developerTelegram: "@rallypoint_dev",
};

export const PLAYERS: Player[] = [
  { id: "p1", name: "Алексей Смирнов", initials: "АС", rating: 1840, level: "L1", matches: 87, wins: 71, trend: 0, crown: "current", joinedAt: "с марта 2024", avatarHue: 178 },
  { id: "p2", name: "Дмитрий Козлов", initials: "ДК", rating: 1795, level: "L1", matches: 92, wins: 68, trend: 1, crown: null, joinedAt: "с января 2024", avatarHue: 215 },
  { id: "p3", name: "Мария Ветрова", initials: "МВ", rating: 1762, level: "L1", matches: 74, wins: 55, trend: -1, crown: null, joinedAt: "с мая 2024", avatarHue: 330 },
  { id: "p4", name: "Никита Орлов", initials: "НО", rating: 1701, level: "L1", matches: 81, wins: 52, trend: 2, crown: "former", joinedAt: "с февраля 2024", avatarHue: 65 },
  { id: "p5", name: "Игорь Соколов", initials: "ИС", rating: 1655, level: "L1", matches: 63, wins: 38, trend: -2, crown: null, joinedAt: "с июня 2024", avatarHue: 25 },
  { id: "p6", name: "Анна Лебедева", initials: "АЛ", rating: 1602, level: "L1", matches: 58, wins: 34, trend: 3, crown: null, joinedAt: "с сентября 2024", avatarHue: 280 },
  { id: "p7", name: "Павел Морозов", initials: "ПМ", rating: 1560, level: "L2", matches: 66, wins: 33, trend: 0, crown: null, joinedAt: "с апреля 2024", avatarHue: 145 },
  { id: "p8", name: "Ольга Зимина", initials: "ОЗ", rating: 1512, level: "L2", matches: 49, wins: 24, trend: 1, crown: null, joinedAt: "с октября 2024", avatarHue: 190 },
  { id: "p9", name: "Сергей Волков", initials: "СВ", rating: 1468, level: "L2", matches: 71, wins: 29, trend: -1, crown: "former", joinedAt: "с декабря 2023", avatarHue: 250 },
  { id: "p10", name: "Елена Крайнова", initials: "ЕК", rating: 1401, level: "L2", matches: 37, wins: 16, trend: 0, crown: null, joinedAt: "с ноября 2024", avatarHue: 100 },
  { id: "p11", name: "Артём Гусев", initials: "АГ", rating: 1330, level: "L3", matches: 28, wins: 10, trend: 2, crown: null, joinedAt: "с января 2025", avatarHue: 310 },
  { id: "p12", name: "Вера Полякова", initials: "ВП", rating: 1245, level: "L3", matches: 19, wins: 6, trend: -1, crown: null, joinedAt: "с марта 2025", avatarHue: 40 },
];

// «Вы» — текущий игрок, чьими глазами смотрим прототип
export const CURRENT_PLAYER_ID = "p4";

export const rankedPlayers = [...PLAYERS].sort((a, b) => b.rating - a.rating);

export function rankOf(id: string) {
  return rankedPlayers.findIndex((p) => p.id === id) + 1;
}

export interface NewsItem {
  id: string;
  type: "tournament" | "rating_up" | "badge" | "record" | "announce";
  title: string;
  description: string;
  time: string;
}

export const NEWS: NewsItem[] = [
  { id: "n1", type: "tournament", title: "Завершился «Летний кубок 2026»", description: "Алексей Смирнов защитил титул! 14 участников, 23 матча за два дня.", time: "2 ч назад" },
  { id: "n2", type: "rating_up", title: "Никита Орлов поднялся на 4 место", description: "+2 позиции в рейтинге клуба после победы над Игорем Соколовым.", time: "5 ч назад" },
  { id: "n3", type: "badge", title: "Новая награда у Марии Ветровой", description: "«Стальные нервы» — три победы на тай-брейках подряд.", time: "вчера" },
  { id: "n4", type: "record", title: "Рекорд клуба: серия из 9 побед", description: "Дмитрий Козлов установил новый клубный рекорд серии побед.", time: "вчера" },
  { id: "n5", type: "announce", title: "Анонс: «Кубок осени»", description: "Олимпийская сетка, 12–13 сентября. Участвуют все уровни.", time: "2 дня назад" },
  { id: "n6", type: "badge", title: "Анна Лебедева — «Лучшая подача»", description: "Средний выигрыш на своей подаче — 68% за месяц.", time: "3 дня назад" },
];

export interface Match {
  id: string;
  opponentId: string;
  date: string;
  sets: string;
  won: boolean;
}

export const CURRENT_PLAYER_MATCHES: Match[] = [
  { id: "m1", opponentId: "p5", date: "21 авг", sets: "3:1", won: true },
  { id: "m2", opponentId: "p2", date: "21 авг", sets: "1:3", won: false },
  { id: "m3", opponentId: "p7", date: "20 авг", sets: "3:0", won: true },
  { id: "m4", opponentId: "p1", date: "20 авг", sets: "0:3", won: false },
  { id: "m5", opponentId: "p8", date: "14 авг", sets: "3:2", won: true },
  { id: "m6", opponentId: "p6", date: "14 авг", sets: "3:1", won: true },
  { id: "m7", opponentId: "p3", date: "7 авг", sets: "2:3", won: false },
  { id: "m8", opponentId: "p9", date: "7 авг", sets: "3:0", won: true },
];

export interface Award {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
}

export const AWARDS: Award[] = [
  { id: "a1", name: "Лучший на приёме", icon: "shield", earned: true },
  { id: "a2", name: "Лучшая подача", icon: "zap", earned: true },
  { id: "a3", name: "Серия побед ×8", icon: "flame", earned: true },
  { id: "a4", name: "Король камбэков", icon: "rotate", earned: true },
  { id: "a5", name: "Стальные нервы", icon: "gem", earned: false },
  { id: "a6", name: "Марафон очков", icon: "timer", earned: true },
  { id: "a7", name: "Снайпер углов", icon: "target", earned: false },
  { id: "a8", name: "Стена", icon: "brick", earned: false },
];

export interface RatingHistoryEntry {
  id: string;
  kind: "tournament" | "match";
  title: string;
  date: string;
  delta: number;
  matches?: { opponentId: string; sets: string; won: boolean; delta: number }[];
}

export const RATING_HISTORY: RatingHistoryEntry[] = [
  {
    id: "h1",
    kind: "tournament",
    title: "Летний кубок 2026",
    date: "20–21 авг",
    delta: 38,
    matches: [
      { opponentId: "p5", sets: "3:1", won: true, delta: 14 },
      { opponentId: "p2", sets: "1:3", won: false, delta: -9 },
      { opponentId: "p7", sets: "3:0", won: true, delta: 21 },
      { opponentId: "p1", sets: "0:3", won: false, delta: -4 },
    ],
  },
  { id: "h2", kind: "match", title: "Товарищеский матч", date: "16 авг", delta: 7 },
  {
    id: "h3",
    kind: "tournament",
    title: "Клубный чемпионат · июль",
    date: "12–13 июл",
    delta: 25,
    matches: [
      { opponentId: "p6", sets: "3:1", won: true, delta: 12 },
      { opponentId: "p8", sets: "3:2", won: true, delta: 18 },
      { opponentId: "p3", sets: "2:3", won: false, delta: -5 },
    ],
  },
  { id: "h4", kind: "match", title: "Товарищеский матч", date: "2 июл", delta: -6 },
];

export interface Tournament {
  id: string;
  name: string;
  format: string;
  dates: string;
  status: "active" | "upcoming" | "finished";
  played?: number;
  total?: number;
  participants?: number;
  affectsRating: boolean;
}

export const TOURNAMENTS: Tournament[] = [
  { id: "t1", name: "Кубок осени", format: "Олимпийка", dates: "12–13 сен", status: "upcoming", affectsRating: true },
  { id: "t2", name: "Летний кубок 2026", format: "Круговая", dates: "20–21 авг", status: "active", played: 14, total: 23, participants: 14, affectsRating: true },
  { id: "t3", name: "Клубный чемпионат · июль", format: "Группы + два финала", dates: "12–13 июл", status: "finished", participants: 12, affectsRating: true },
  { id: "t4", name: "Парный турнир", format: "Пары + два финала", dates: "21 июн", status: "finished", participants: 16, affectsRating: false },
  { id: "t5", name: "Весенний мейджор", format: "Круговая", dates: "18 мая", status: "finished", participants: 10, affectsRating: true },
];

export interface TableSlot {
  id: number;
  match: string;
  status: "live" | "waiting";
  refereeAssigned: boolean;
}

export const TABLES: TableSlot[] = [
  { id: 1, match: "Смирнов — Козлов", status: "live", refereeAssigned: true },
  { id: 2, match: "Ветрова — Лебедева", status: "live", refereeAssigned: true },
  { id: 3, match: "Орлов — Соколов", status: "waiting", refereeAssigned: false },
  { id: 4, match: "Морозов — Зимина", status: "waiting", refereeAssigned: false },
];

export const ADMIN_ACTIVITY = [
  { id: "ac1", text: "Судья назначен на стол 2", time: "10 мин назад" },
  { id: "ac2", text: "Завершён матч: Ветрова — Лебедева 3:2", time: "26 мин назад" },
  { id: "ac3", text: "Добавлен игрок: Вера Полякова", time: "вчера" },
];

// Курированная палитра цветов клуба (проверена на читаемость в обеих темах)
export const CLUB_COLORS = [
  { id: "teal", name: "Морская волна", light: "oklch(0.55 0.10 178)", dark: "oklch(0.80 0.09 178)" },
  { id: "blue", name: "Сапфир", light: "oklch(0.52 0.11 250)", dark: "oklch(0.78 0.09 250)" },
  { id: "violet", name: "Ирис", light: "oklch(0.50 0.13 300)", dark: "oklch(0.76 0.11 300)" },
  { id: "crimson", name: "Малина", light: "oklch(0.52 0.16 15)", dark: "oklch(0.74 0.13 15)" },
  { id: "amber", name: "Янтарь", light: "oklch(0.60 0.13 65)", dark: "oklch(0.82 0.12 80)" },
  { id: "forest", name: "Хвоя", light: "oklch(0.50 0.10 150)", dark: "oklch(0.76 0.10 150)" },
];

export function playerById(id: string): Player {
  return PLAYERS.find((p) => p.id === id) ?? PLAYERS[0]!;
}

export function winRate(p: Player) {
  return Math.round((p.wins / p.matches) * 100);
}
