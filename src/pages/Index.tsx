import { useState, useCallback } from "react";
import { Swords } from "lucide-react";
import { TimerSection } from "@/components/TimerSection";
import { Scoreboard } from "@/components/Scoreboard";
import { GameManager } from "@/components/GameManager";
import { TeamManager } from "@/components/TeamManager";
import { useTimer } from "@/hooks/useTimer";
import { DEFAULT_TEAMS, type Game, type Team } from "@/types/game";

const Index = () => {
  const timer = useTimer();
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);

  const addGame = useCallback((name: string) => {
    setGames((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, scores: {} },
    ]);
  }, []);

  const updateScore = useCallback((gameId: string, teamId: string, score: number) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId ? { ...g, scores: { ...g.scores, [teamId]: score } } : g
      )
    );
  }, []);

  const deleteGame = useCallback((gameId: string) => {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  }, []);

  const addTeam = useCallback((name: string, color: string) => {
    setTeams((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        color,
      },
    ]);
  }, []);

  const updateTeam = useCallback((teamId: string, updates: Partial<Pick<Team, "name" | "color">>) => {
    setTeams((prev) => prev.map((team) => (team.id === teamId ? { ...team, ...updates } : team)));
  }, []);

  return (
    <div className="min-h-screen bg-background bg-parchment-texture">
      {/* Header */}
      <header className="border-b border-gold-dim py-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <Swords className="h-8 w-8 text-gold" />
          <h1 className="font-medieval text-4xl md:text-5xl text-gold text-shadow-gold tracking-wide">
            Medieval Team Battle
          </h1>
          <Swords className="h-8 w-8 text-gold scale-x-[-1]" />
        </div>
        <p className="mt-2 font-crimson text-muted-foreground text-lg italic">
          May the bravest kingdom prevail!
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Timer */}
        <TimerSection timer={timer} />

        {/* Team Management */}
        <TeamManager teams={teams} onAddTeam={addTeam} onUpdateTeam={updateTeam} />

        {/* Scoreboard */}
        <Scoreboard games={games} teams={teams} />

        {/* Game Management */}
        <GameManager
          teams={teams}
          games={games}
          onAddGame={addGame}
          onUpdateScore={updateScore}
          onDeleteGame={deleteGame}
        />
      </main>
    </div>
  );
};

export default Index;