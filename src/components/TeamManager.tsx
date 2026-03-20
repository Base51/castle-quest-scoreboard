import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import type { Team } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TeamManagerProps {
  teams: Team[];
  onAddTeam: (name: string, color: string) => void;
  onUpdateTeam: (teamId: string, updates: Partial<Pick<Team, "name" | "color">>) => void;
  onDeleteTeam: (teamId: string) => void;
}

export function TeamManager({ teams, onAddTeam, onUpdateTeam, onDeleteTeam }: TeamManagerProps) {
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamColor, setNewTeamColor] = useState("#7c3aed");

  const handleAddTeam = () => {
    const name = newTeamName.trim();
    if (!name) return;

    onAddTeam(name, newTeamColor);
    setNewTeamName("");
  };

  return (
    <div className="border-ornate rounded-lg bg-card p-6">
      <h2 className="font-cinzel text-2xl text-gold text-shadow-gold text-center mb-6">
        <Users className="inline h-6 w-6 mr-2" />
        Teams
      </h2>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Input
          placeholder="New team name..."
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTeam()}
          className="max-w-xs font-crimson"
        />
        <Input
          type="color"
          value={newTeamColor}
          onChange={(e) => setNewTeamColor(e.target.value)}
          className="h-10 w-14 p-1"
          aria-label="New team color"
        />
        <Button onClick={handleAddTeam} className="font-cinzel gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add Team
        </Button>
      </div>

      <div className="space-y-3">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-lg border border-border bg-secondary/50 p-3"
            style={{ borderLeftWidth: "6px", borderLeftColor: team.color }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Input
                value={team.name}
                onChange={(e) => onUpdateTeam(team.id, { name: e.target.value })}
                className="min-w-44 flex-1 font-cinzel"
                aria-label={`Team name for ${team.name}`}
              />
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={team.color}
                  onChange={(e) => onUpdateTeam(team.id, { color: e.target.value })}
                  className="h-10 w-14 p-1"
                  aria-label={`Team color for ${team.name}`}
                />
                <span className="w-24 font-mono text-xs text-muted-foreground uppercase">
                  {team.color}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTeam(team.id)}
                  disabled={teams.length === 1}
                  className="text-muted-foreground hover:text-destructive"
                  title={teams.length === 1 ? "At least one team is required" : `Remove ${team.name}`}
                  aria-label={`Remove team ${team.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
