import { Plus, Trash2, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Game, Team } from "@/types/game";
import { useState } from "react";

interface GameManagerProps {
  teams: Team[];
  games: Game[];
  onAddGame: (name: string) => void;
  onUpdateGameName: (gameId: string, name: string) => void;
  onUpdateScore: (gameId: string, teamId: string, score: number) => void;
  onDeleteGame: (gameId: string) => void;
}

export function GameManager({ teams, games, onAddGame, onUpdateGameName, onUpdateScore, onDeleteGame }: GameManagerProps) {
  const [newGameName, setNewGameName] = useState("");

  const handleAdd = () => {
    const name = newGameName.trim() || `Game ${games.length + 1}`;
    onAddGame(name);
    setNewGameName("");
  };

  const handleGameNameBlur = (game: Game) => {
    const trimmed = game.name.trim();
    if (!trimmed) {
      onUpdateGameName(game.id, "Untitled Game");
      return;
    }
    if (trimmed !== game.name) {
      onUpdateGameName(game.id, trimmed);
    }
  };

  return (
    <div className="border-ornate rounded-lg bg-card p-6">
      <h2 className="font-cinzel text-2xl text-gold text-shadow-gold text-center mb-6">
        <Swords className="inline h-6 w-6 mr-2" />
        Games & Scores
      </h2>

      {/* Add Game */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter game name..."
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="font-crimson text-base"
        />
        <Button onClick={handleAdd} className="font-cinzel gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add Game
        </Button>
      </div>

      {/* Games List */}
      {games.length === 0 ? (
        <p className="text-center text-muted-foreground font-crimson italic py-8">
          No games yet. Add a game to begin the tournament!
        </p>
      ) : (
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <Input
                  value={game.name}
                  onChange={(e) => onUpdateGameName(game.id, e.target.value)}
                  onBlur={() => handleGameNameBlur(game)}
                  onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
                  className="max-w-sm font-cinzel font-semibold"
                  aria-label={`Game name for ${game.name || "untitled game"}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteGame(game.id)}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {teams.map((team) => (
                  <div key={team.id} className="flex flex-col items-center gap-1">
                    <label className="text-xs font-cinzel font-semibold" style={{ color: team.color }}>
                      {team.name}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={game.scores[team.id] || 0}
                      onChange={(e) => onUpdateScore(game.id, team.id, parseInt(e.target.value) || 0)}
                      className="w-full text-center font-medieval text-lg h-10"
                      style={{ borderColor: team.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}