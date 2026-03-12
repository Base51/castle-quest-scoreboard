import { Plus, Trash2, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TEAMS, type Game, getTeamColorClass } from "@/types/game";
import { useState } from "react";

interface GameManagerProps {
  games: Game[];
  onAddGame: (name: string) => void;
  onUpdateScore: (gameId: string, teamId: string, score: number) => void;
  onDeleteGame: (gameId: string) => void;
}

export function GameManager({ games, onAddGame, onUpdateScore, onDeleteGame }: GameManagerProps) {
  const [newGameName, setNewGameName] = useState("");

  const handleAdd = () => {
    const name = newGameName.trim() || `Game ${games.length + 1}`;
    onAddGame(name);
    setNewGameName("");
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
                <h3 className="font-cinzel font-semibold text-foreground">{game.name}</h3>
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
                {TEAMS.map((team) => (
                  <div key={team.id} className="flex flex-col items-center gap-1">
                    <label className={`text-xs font-cinzel font-semibold ${getTeamColorClass(team.color, "text")}`}>
                      {team.name}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={game.scores[team.id] || 0}
                      onChange={(e) => onUpdateScore(game.id, team.id, parseInt(e.target.value) || 0)}
                      className={`w-full text-center font-medieval text-lg h-10 ${getTeamColorClass(team.color, "border")}`}
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