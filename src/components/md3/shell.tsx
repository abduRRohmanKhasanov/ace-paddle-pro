import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  LayoutDashboard,
  Newspaper,
  ScrollText,
  Settings,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CLUB } from "@/lib/mock-data";

/* ---------- Шапка клуба ---------- */
export function ClubHeader() {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
        <Link to="/club" className="pressable active:press-active">
          <span className="text-headline-s font-bold text-primary">{CLUB.name}</span>
          <span className="block text-xs text-on-surface-variant">{CLUB.subdomain}</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            aria-label="Уведомления"
            className="pressable relative flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container active:press-active"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-error" />
          </button>
          <Link
            to="/admin/settings"
            aria-label="Настройки"
            className="pressable flex size-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container active:press-active"
          >
            <Settings className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- Нижняя навигация MD3 ---------- */
interface NavItem {
  to: string;
  label: string;
  icon: typeof Newspaper;
}

const PLAYER_NAV: NavItem[] = [
  { to: "/club", label: "Лента", icon: Newspaper },
  { to: "/club/rating", label: "Рейтинг", icon: Trophy },
  { to: "/club/profile", label: "Профиль", icon: User },
  { to: "/club/rules", label: "Регламент", icon: ScrollText },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { to: "/admin/players", label: "Игроки", icon: Users },
  { to: "/admin/tournaments", label: "Турниры", icon: Trophy },
  { to: "/admin/settings", label: "Настройки", icon: Settings },
];

function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-surface-container shadow-elev-2">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/club" || item.to === "/admin" }}
            className="pressable flex flex-1 flex-col items-center gap-1 active:press-active"
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex h-8 w-16 items-center justify-center rounded-full transition-colors",
                    isActive ? "bg-secondary-container" : "bg-transparent",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5",
                      isActive ? "text-on-secondary-container" : "text-on-surface-variant",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-xs",
                    isActive ? "font-semibold text-on-surface" : "font-medium text-on-surface-variant",
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* ---------- Каркас «клубного» экрана ---------- */
export function ClubShell({
  nav,
  children,
}: {
  nav: "player" | "admin";
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface">
      <ClubHeader />
      <main className="mx-auto max-w-md px-4 pt-2 pb-32">{children}</main>
      <BottomNav items={nav === "player" ? PLAYER_NAV : ADMIN_NAV} />
    </div>
  );
}
