"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { F1Event } from "@/types/f1";
import { ChevronRight } from "lucide-react";
import RaceCard from "./RaceCard";

const UpcomingRaces = () => {
  const [upcomingRaces, setUpcomingRaces] = useState<F1Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingRaces = async () => {
      try {
        const response = await fetch("/api/f1/schedule");
        if (!response.ok) throw new Error("Failed to fetch schedule");

        const events: F1Event[] = await response.json();

        // Filter for race events only (not practice/qualifying) and include all races
        const raceEvents = events
          .filter((event) => event.eventType === "race")
          .sort(
            (a, b) =>
              new Date(a.utcDateTime).getTime() -
              new Date(b.utcDateTime).getTime()
          );

        setUpcomingRaces(raceEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching upcoming races:", err);
        setError("Failed to load race calendar");
        setLoading(false);
      }
    };

    fetchUpcomingRaces();
  }, []);

  // Old helpers removed; RaceCard handles date/time/flags internally

  if (loading) {
    return (
      <section id="races" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming <span className="f1-text-glow">Races</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="f1-border-glow bg-card/50 backdrop-blur animate-pulse"
              >
                <CardHeader className="pb-4">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-20 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="races" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Upcoming <span className="f1-text-glow">Races</span>
            </h2>
            <p className="text-lg text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="races" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Upcoming <span className="f1-text-glow">Races</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with the Formula 1 calendar. Get detailed schedules,
            circuit information, and race insights.
          </p>
        </div>

        <div className="space-y-6">
          {upcomingRaces.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>

        {/* View All Races Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="f1-gradient text-white border-0 hover:opacity-90"
          >
            View Full {new Date().getFullYear()} Calendar
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingRaces;
