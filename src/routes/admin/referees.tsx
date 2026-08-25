import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  QrCode,
  UserCheck,
} from "lucide-react";
import QRCode from "qrcode";
import { ClubShell } from "@/components/md3/shell";
import { Sheet, StatusDot } from "@/components/md3/ui";
import { CLUB, TABLES, TOURNAMENTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/referees")({
  head: () => ({
    meta: [
      { title: `Судьи и столы — клуб «${CLUB.name}»` },
      { name: "description", content: "Назначение судей на столы турнира через ссылку или QR-код." },
      { property: "og:title", content: `Судьи и столы — клуб «${CLUB.name}»` },
      { property: "og:description", content: "Статусы столов, назначение судей и ссылки для живого счёта." },
    ],
  }),
  component: RefereesPage,
});

function RefereeSheet({
  tableId,
  onClose,
}: {
  tableId: number | null;
  onClose: () => void;
}) {
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const link = `https://${CLUB.subdomain}/referee?table=${tableId ?? ""}`;

  useEffect(() => {
    if (tableId == null) return;
    setCopied(false);
    QRCode.toDataURL(link, { width: 240, margin: 1 }).then(setQr);
  }, [tableId, link]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* буфер может быть недоступен в превью */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={tableId != null} onClose={onClose} title={`Стол ${tableId}`}>
      <div className="flex flex-col items-center gap-4 pt-2">
        <p className="text-center text-sm text-on-surface-variant">
          Судья открывает ссылку или сканирует QR — без регистрации, доступ только
          к этому столу.
        </p>
        <div className="rounded-3xl bg-surface-container-lowest p-4 shadow-elev-1">
          {qr ? (
            <img src={qr} alt={`QR-код для судьи стола ${tableId}`} className="size-48" />
          ) : (
            <div className="size-48 animate-pulse rounded-2xl bg-surface-container" />
          )}
        </div>
        <div className="flex w-full items-center gap-2 rounded-2xl bg-surface-container p-2 pl-4">
          <span className="min-w-0 flex-1 truncate text-xs text-on-surface-variant">{link}</span>
          <button
            onClick={copy}
            className={cn(
              "pressable flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold active:press-active",
              copied ? "bg-success-container text-on-success-container" : "bg-primary text-on-primary",
            )}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function RefereesPage() {
  const active = TOURNAMENTS.find((t) => t.status === "active")!;
  const [tables, setTables] = useState(TABLES);
  const [qrTable, setQrTable] = useState<number | null>(null);

  const selfAssign = (id: number) =>
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, refereeAssigned: true } : t)),
    );

  return (
    <ClubShell nav="admin">
      <Link
        to="/admin"
        className="pressable mb-2 inline-flex items-center gap-1 rounded-full py-1 pr-3 pl-1 text-sm font-semibold text-primary active:press-active"
      >
        <ArrowLeft className="size-4" />
        Дашборд
      </Link>
      <h1 className="mb-1 px-1 text-headline-s text-on-surface">Судьи и столы</h1>
      <p className="mb-4 px-1 text-sm text-on-surface-variant">{active.name}</p>

      <div className="flex flex-col gap-3">
        {tables.map((t) => (
          <section
            key={t.id}
            className="rounded-3xl bg-surface-container-low p-4 shadow-elev-1"
          >
            <div className="flex items-center justify-between">
              <p className="text-title-m text-on-surface">Стол {t.id}</p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold",
                  t.status === "live"
                    ? "bg-success-container text-on-success-container"
                    : "bg-surface-container-highest text-on-surface-variant",
                )}
              >
                {t.status === "live" ? "Идёт матч" : "Ожидает"}
              </span>
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">{t.match}</p>

            <div className="mt-3 flex items-center gap-2">
              <StatusDot tone={t.refereeAssigned ? "success" : "error"} />
              <span className="text-sm font-medium text-on-surface">
                {t.refereeAssigned ? "Судья назначен" : "Судья не назначен"}
              </span>
            </div>

            {!t.refereeAssigned && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => selfAssign(t.id)}
                  className="pressable flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary active:press-active"
                >
                  <UserCheck className="size-4" />
                  Судить самому
                </button>
                <button
                  onClick={() => setQrTable(t.id)}
                  className="pressable flex flex-1 items-center justify-center gap-1.5 rounded-full border border-outline px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface-container active:press-active"
                >
                  <QrCode className="size-4" />
                  QR / ссылка
                </button>
              </div>
            )}
          </section>
        ))}
      </div>

      <RefereeSheet tableId={qrTable} onClose={() => setQrTable(null)} />
    </ClubShell>
  );
}
