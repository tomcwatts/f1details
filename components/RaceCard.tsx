"use client";

import { cn } from "@/lib/utils";
import React from "react";
import type { F1Event } from "@/types/f1";
import { getFlagCode } from "@/lib/flags";

type RaceCardProps = { race: F1Event; now?: Date };


function useNow(tickMs = 1000) {
  const [now, setNow] = React.useState<Date>(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs)
    return () => clearInterval(id)
  }, [tickMs])
  return now
}

function formatLocalDate(date: Date) {
  try {
    const weekday = date.toLocaleDateString(undefined, { weekday: "long" })
    const day = date.getDate()
    const month = date.toLocaleDateString(undefined, { month: "long" })
    const year = date.getFullYear()
    return `${weekday}, ${day} ${month} ${year}`
  } catch {
    return date.toDateString()
  }
}

function formatLocalTime(date: Date) {
  try {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  } catch {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
  }
}

function getTimeZoneAbbr(date: Date) {
  try {
    const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(date)
    return parts.find((p) => p.type === "timeZoneName")?.value || ""
  } catch {
    return ""
  }
}

function getCountdown(target: Date, now: Date) {
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return { label: "Finished", negative: true }
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (days > 0) return { label: `${days} days away`, negative: false }
  if (hours > 0) return { label: `in ${hours}h ${minutes}m`, negative: false }
  return { label: `in ${minutes}m`, negative: false }
}

function getDaysUntilRace(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
}

function RaceCard({ race, now: nowProp }: RaceCardProps) {
  const now = nowProp ?? useNow(1000);
  const date = new Date(race.utcDateTime);
  const { label: countdown, negative } = getCountdown(date, now);
  const isPast = negative;
  const chips: string[] = [];
  if (race.circuit.toLowerCase().includes("street"))
    chips.push("Street Circuit");
  if (race.name.toLowerCase().includes("singapore")) chips.push("Night Race");
  const isSoon =
    !isPast && date.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
  const headingId = React.useId();
  const displayType =
    race.eventType === "race"
      ? "Grand Prix"
      : race.eventType.charAt(0).toUpperCase() + race.eventType.slice(1);
  const flagCode = getFlagCode(race.circuitDetails?.location.country, race.location);

  return (
    <article
      className={cn(
        "group mx-auto relative w-full overflow-hidden rounded-none bg-card p-4 ring-1 ring-white/20 transition",
        "bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-sm",
        "shadow-[0_0_0_1px_var(--color-border)_inset,0_18px_60px_-30px_rgb(0_0_0/0.65)]",
        "hover:ring-foreground/30 focus-within:ring-foreground/30 sm:p-6 max-w-[1000px]",
        "transform-gpu",
        !isPast && "motion-safe:group-hover:-translate-y-[1px]",
        !isPast &&
          "motion-safe:group-hover:shadow-[0_10px_40px_-20px_rgb(155_140_255/0.35)]",
        isPast && "opacity-80 saturate-75 grayscale-[12%]"
      )}
      aria-labelledby={headingId}
    >
      {/* shimmer sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-10 left-[-40%] z-0 h-[220%] w-[35%] -rotate-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition duration-700 motion-safe:group-hover:translate-x-[160%] motion-safe:group-hover:opacity-100"
      />
      {/* luxe sheen + micro grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(closest-side, rgba(255,255,255,0.10), transparent 70%)",
          filter: "blur(2px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />
      {/* ambient glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-1/4 h-24 w-24 rounded-full bg-destructive/25 blur-3xl opacity-0 transition-opacity duration-500 motion-safe:group-hover:opacity-40"
      />
      {/* inner stroke */}
      {/* <div
        className="pointer-events-none absolute inset-1 ring-1 ring-white/15"
        aria-hidden="true"
      /> */}
      {/* corner brackets */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-white/20" />
        <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-white/20" />
        <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-white/20" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-white/20" />
      </div>
      {/* right-edge hairline accent */}
      {/* <div
        className="pointer-events-none absolute inset-y-1 right-0 w-px bg-gradient-to-b from-transparent via-red-500 to-transparent"
        aria-hidden="true"
      /> */}
      {/* bottom hairline accent */}
      {/* <div
        className="pointer-events-none absolute inset-x-1 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"
        aria-hidden="true"
      /> */}
      {/* red accent bar */}
      {/* <div
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b shadow-[0_0_12px_-2px_rgba(239,68,68,0.7)] transition-all",
          !isPast && "from-destructive to-destructive/20",
          isPast && "from-muted to-muted/20 shadow-none",
          "group-hover:w-[5px]"
        )}
      /> */}
      {/* oversized flag watermark */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 z-0 px-1 select-none font-heading text-6xl font-black tracking-tighter text-foreground/20 sm:text-7xl md:text-8xl motion-safe:transition-opacity motion-safe:duration-300 motion-safe:group-hover:opacity-60",
          // make the text outlined and remove the fill color
          // "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        )}
        style={{
          maskImage:
            "radial-gradient(60% 60% at 70% 30%, black 20%, transparent 80%)",
        }}
      >
        {flagCode ? (
          <div
            className={cn("fib block w-[24rem] h-[18rem] opacity-10", `fi-${flagCode}`)}
          />
        ) : (
          ''
        )}
      </div>
      {/* oversized round watermark */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-8 top-1 z-0 px-1 select-none font-heading text-6xl font-black tracking-tighter text-foreground sm:text-4xl md:text-8xl motion-safe:transition-opacity motion-safe:duration-300 motion-safe:group-hover:opacity-60",
          // make the text outlined and remove the fill color
          // "text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
        )}
        style={{
          maskImage:
            "radial-gradient(60% 60% at 70% 30%, black 20%, transparent 150%)",
        }}
      >
        R{String(race.round ?? "").padStart(2, "0")}
      </div>
      {/* top row */}
      <div className="flex flex-wrap items-start justify-between gap-3 pl-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {/* <div className="flex h-7 min-w-16 items-center justify-center rounded-sm bg-gradient-to-b from-secondary to-muted/60 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground ring-1 ring-border/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
            Round {race.round.toString().padStart(2, "0")}
          </div> */}
          <div className="min-w-0">
            <h3
              className="truncate font-semibold text-base leading-tight tracking-tight sm:text-xl"
              id={headingId}
            >
              {race.name}
            </h3>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              {displayType} • {race.circuit}
            </p>
          </div>
        </div>
      </div>

      {chips.length ? (
        <div className="mt-2 pl-2 flex flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-sm bg-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground ring-1 ring-white/10 motion-safe:transition motion-safe:duration-200 group-hover:ring-white/20"
            >
              {c}
            </span>
          ))}
        </div>
      ) : null}

      {/* divider */}
      <div
        className="mt-5 mb-0 h-px w-full opacity-70 bg-transparent"
      />

      {/* details grid */}
      <div className="relative grid grid-cols-1 gap-3 pl-2 sm:grid-cols-3 sm:gap-4">
        {/* subtle vertical separators on larger screens */}
        <div
          className="pointer-events-none absolute inset-0 hidden sm:block"
          aria-hidden="true"
        >
          <span className="absolute left-1/4 top-0 hidden h-full w-px bg-white/8 sm:block" />
          <span className="absolute left-1/2 top-0 hidden h-full w-px bg-white/8 sm:block" />
          <span className="absolute left-3/4 top-0 hidden h-full w-px bg-white/8 sm:block" />
        </div>
        <Detail
          label="Date"
          value={formatLocalDate(date)}
          // icon={<Calendar className="h-3.5 w-3.5" />}
        />
        <Detail
          label={`Time`}
          value={`${formatLocalTime(date)} ${getTimeZoneAbbr(date)}`}
          // icon={<Clock className="h-3.5 w-3.5" />}
          valueClassName="tabular-nums tracking-tight"
        />
        {/* <Detail
          label="Countdown"
          value={countdown}
          emphasis={!isPast}
          status={isPast ? "muted" : "active"}
          icon={<FlagIcon className="h-3.5 w-3.5" />}
          pulse={isSoon}
        /> */}
        {/* <Detail
          label="Venue"
          value={`${race.location} • ${race.country}`}
          // icon={<MapPin className="h-3.5 w-3.5" />}
        /> */}

        <Detail
          label="Starts in"
          value={Math.abs(getDaysUntilRace(date)).toString() + " days"}
          // icon={<FlagIcon className="h-3.5 w-3.5" />}
        />
      </div>

      {/* footer: country + action affordance */}
      {/* <div className="mt-3 border-t border-border/60 pt-3 flex items-center justify-between pl-2">
        <span className="text-xs text-muted-foreground">
          Time shown in your local timezone
        </span>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground hover:underline hover:underline-offset-4">
          View circuit
          <ChevronRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div> */}

      {/* focus ring target */}
      <button
        type="button"
        aria-label={`More info about ${race.name}`}
        className="absolute inset-0 cursor-default rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={0}
      />
    </article>
  );
}

function Detail({
  label,
  value,
  emphasis,
  status,
  icon,
  valueClassName,
  pulse,
}: {
  label: string
  value: string
  emphasis?: boolean
  status?: "active" | "muted"
  icon?: React.ReactNode
  valueClassName?: string
  pulse?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon ? <span className="text-muted-foreground/80">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "mt-1 min-w-0 break-words text-sm",
          emphasis ? "font-semibold text-foreground" : "text-foreground",
          valueClassName
        )}
      >
        {status === "active" ? (
          <span className={cn(
            "inline-flex items-center rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-semibold text-destructive ring-1 ring-destructive/40 shadow-[0_0_0_2px_rgba(239,68,68,0.12)]",
            pulse && "motion-safe:animate-pulse ring-2 ring-destructive/40 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
          )}>
            {value}
          </span>
        ) : status === "muted" ? (
          <span className="inline-flex items-center rounded-full bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/60">
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  )
}

export default RaceCard;