import { Crown, Shield } from "lucide-react";
import type { Game, Team } from "@/types/game";

interface ScoreboardProps {
  games: Game[];
  teams: Team[];
}

function toMutedColor(hex: string, opacity = 0.18): string {
  const clean = hex.replace("#", "");
  const valid = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(clean);
  if (!valid) return "rgba(255, 255, 255, 0.08)";

  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function Scoreboard({ games, teams }: ScoreboardProps) {
  const totals = teams.map((team) => ({
    team,
    total: games.reduce((sum, g) => sum + (g.scores[team.id] || 0), 0),
  })).sort((a, b) => b.total - a.total);

  const maxScore = totals[0]?.total || 0;

  return (
    <div className="border-ornate rounded-lg bg-card p-6">
      <h2 className="font-cinzel text-2xl text-gold text-shadow-gold text-center mb-6">
        <Shield className="inline h-6 w-6 mr-2" />
        Leaderboard
      </h2>

      <div className="space-y-3">
        {totals.map((entry, index) => (
          <div
            key={entry.team.id}
            className="flex items-center gap-4 rounded-lg p-4 border transition-all"
            style={{
              borderColor: entry.team.color,
              backgroundColor: toMutedColor(entry.team.color),
            }}
          >
            {/* Rank */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card font-cinzel text-lg font-bold">
              {index === 0 && maxScore > 0 ? (
                <Crown className="h-6 w-6 text-gold" />
              ) : (
                <span className="text-muted-foreground">{index + 1}</span>
              )}
            </div>

            {/* Team Color Bar */}
            <div className="h-10 w-2 rounded-full" style={{ backgroundColor: entry.team.color }} />

            {/* Team Name */}
            <div className="flex-1">
              <p className="font-cinzel font-bold text-lg" style={{ color: entry.team.color }}>
                {entry.team.name}
              </p>
            </div>

            {/* Total */}
            <div className="text-right">
              <p className="font-medieval text-3xl text-gold">{entry.total}</p>
              <p className="text-xs text-muted-foreground font-cinzel">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}