"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { F1Event } from "@/types/f1";
import {
  Calendar,
  Clock,
  MapPin,
  Thermometer,
  Wind,
  ChevronRight,
  Play,
} from "lucide-react";

const HeroSection = () => {
  const [timeToRace, setTimeToRace] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [nextRace, setNextRace] = useState<F1Event | null>(null);
  const [relatedSessions, setRelatedSessions] = useState<F1Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const response = await fetch("/api/f1/schedule");
        if (!response.ok) throw new Error("Failed to fetch schedule");

        const events: F1Event[] = await response.json();

        // Find the next race event - get the next future race
        const now = new Date();
        const futureRaces = events
          .filter((event) => {
            const eventDateTime = new Date(event.utcDateTime);
            return eventDateTime > now && event.eventType === "race";
          })
          .sort(
            (a, b) =>
              new Date(a.utcDateTime).getTime() -
              new Date(b.utcDateTime).getTime(),
          );

        const nextRaceEvent = futureRaces[0];

        if (nextRaceEvent) {
          setNextRace(nextRaceEvent);

          // Find related sessions for this race weekend
          const raceWeekendSessions = events
            .filter((event) => event.round === nextRaceEvent.round)
            .sort(
              (a, b) =>
                new Date(a.utcDateTime).getTime() -
                new Date(b.utcDateTime).getTime(),
            );

          setRelatedSessions(raceWeekendSessions);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching next race:", err);
        setError("Failed to load race data");
        setLoading(false);
      }
    };

    fetchNextRace();
  }, []);

  useEffect(() => {
    if (!nextRace) return;

    const calculateTimeToRace = () => {
      const now = new Date().getTime();
      const raceTime = new Date(nextRace.utcDateTime).getTime();
      const difference = raceTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeToRace({ days, hours, minutes, seconds });
      }
    };

    calculateTimeToRace();
    const timer = setInterval(calculateTimeToRace, 1000);

    return () => clearInterval(timer);
  }, [nextRace]);

  if (loading) {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center f1-hero-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-muted rounded mb-4"></div>
              <div className="h-8 bg-muted rounded mb-8"></div>
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !nextRace) {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center f1-hero-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-6xl font-thin leading-tight mb-4">
              <span className="f1-text-glow">F1 Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {error || "No upcoming races found"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center f1-hero-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="f1-gradient text-white border-0"
              >
                Next Race
              </Badge>
              <h1 className="font-display text-4xl md:text-6xl font-medium uppercase leading-tight tracking-tight">
                <span className="f1-text-glow">{nextRace.name}</span>
              </h1>
              <div className="flex items-center space-x-4 text-lg text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{nextRace.circuit}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{nextRace.location}</span>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Days", value: timeToRace.days },
                { label: "Hours", value: timeToRace.hours },
                { label: "Minutes", value: timeToRace.minutes },
                { label: "Seconds", value: timeToRace.seconds },
              ].map((item) => (
                <Card
                  key={item.label}
                  className="f1-border-glow bg-card/50 backdrop-blur"
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold f1-text-glow">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="f1-gradient text-white border-0 hover:opacity-90"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Live Timing
              </Button>
              <Button size="lg" variant="outline" className="f1-border-glow">
                View Race Schedule
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Column - Race Weekend Schedule */}
          <div className="space-y-6">
            <div className="relative overflow-hidden bg-background backdrop-blur-sm ring-1 ring-white/20 shadow-[0_0_0_1px_var(--color-border)_inset,0_18px_60px_-30px_rgb(0_0_0/0.65)]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-heading text-xl font-medium tracking-tight text-foreground">
                    RACE WEEKEND SCHEDULE
                  </h3>
                  <div className="h-px flex-1 ml-6 bg-white/20" />
                </div>

                <div className="space-y-2">
                  {/* Show related sessions */}
                  {relatedSessions.slice(0, 5).map((session, index) => {
                    const sessionType = session.eventType;
                    const sessionName = session.name.replace(
                      ` - ${nextRace.name}`,
                      "",
                    );
                    const isRace = sessionType === "race";
                    const isQualifying = sessionType === "qualifying";
                    const isSprint = sessionType === "sprint";

                    return (
                      <article
                        key={session.id}
                        className="group relative overflow-hidden bg-gradient-to-b from-background/90 to-background/80 backdrop-blur-sm p-4 ring-1 ring-white/15 transition transform-gpu motion-safe:group-hover:-translate-y-[0.5px] shadow-[0_0_0_1px_var(--color-border)_inset,0_4px_12px_-6px_rgb(0_0_0/0.3)] motion-safe:group-hover:shadow-[0_6px_16px_-8px_rgb(0_0_0/0.4)] motion-safe:group-hover:ring-white/25"
                      >
                        {/* subtle shimmer for sessions */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-y-2 left-[-15%] z-0 h-[120%] w-[15%] -rotate-12 bg-gradient-to-r from-transparent via-white/4 to-transparent opacity-0 transition duration-400 motion-safe:group-hover:translate-x-[180%] motion-safe:group-hover:opacity-100"
                        />
                        {/* red accent glow for race */}
                        {isRace && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-2 top-1/3 h-8 w-8 bg-destructive/40 blur-xl opacity-0 transition-opacity duration-300 motion-safe:group-hover:opacity-60"
                          />
                        )}

                        {/* corner accent for race */}
                        {/*{isRace && (
                          <div className="absolute top-0 right-0 w-8 h-8">
                            <div className="absolute top-1 right-1 w-full h-px bg-gradient-to-l from-destructive/60 to-transparent" />
                            <div className="absolute bottom-1 right-1 w-px h-full bg-gradient-to-b from-destructive/60 to-transparent" />
                          </div>
                        )}*/}
                        {/* accent bar with session type colors */}
                        <div
                          className={`absolute left-0 top-0 h-full w-1 transition-colors duration-200 ${
                            isRace
                              ? "bg-gradient-to-b from-destructive via-destructive/80 to-destructive/40 shadow-[0_0_8px_-1px_rgba(239,68,68,0.7)]"
                              : isSprint
                                ? "bg-gradient-to-b from-yellow-500/50 to-yellow-600/30 group-hover:from-yellow-500/70 group-hover:to-yellow-600/50"
                                : isQualifying
                                  ? "bg-gradient-to-b from-blue-500/50 to-blue-600/30 group-hover:from-blue-500/70 group-hover:to-blue-600/50"
                                  : "bg-gradient-to-b from-white/30 to-white/10 group-hover:from-white/50 group-hover:to-white/20"
                          }`}
                        />

                        <div className="relative flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-3">
                              <div>
                                <div className="font-medium text-foreground tracking-tight text-sm uppercase">
                                  {isRace ? "Race" : sessionName.toUpperCase()}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5 tracking-wide font-mono uppercase">
                                  {new Date(
                                    session.utcDateTime,
                                  ).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono text-sm tabular-nums tracking-tight text-foreground">
                              {new Date(session.utcDateTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZoneName: "short",
                                },
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">
                              LOCAL TIME
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Circuit Info */}
            {/*<Card className="f1-border-glow bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Circuit Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-lg font-semibold">{nextRace.circuit}</div>
                    <div className="text-sm text-muted-foreground">{nextRace.location}</div>
                  </div>

                  {nextRace.lastYearWinner && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-1">2024 Winner</div>
                      <div className="text-base">
                        {nextRace.lastYearWinner.driver.givenName} {nextRace.lastYearWinner.driver.familyName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {nextRace.lastYearWinner.constructor.name}
                      </div>
                    </div>
                  )}

                  {nextRace.hasSprint && (
                    <div className="flex items-center space-x-2">
                      <Badge className="f1-gradient text-white border-0 text-xs">
                        ⚡ Sprint Weekend
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>*/}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
