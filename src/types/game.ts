export interface Team {
  id: string;
  name: string;
  color: "red" | "blue" | "green" | "yellow";
}

export interface Game {
  id: string;
  name: string;
  scores: Record<string, number>; // teamId -> points
}

export const TEAMS: Team[] = [
  { id: "red", name: "Red Knights", color: "red" },
  { id: "blue", name: "Blue Dragons", color: "blue" },
  { id: "green", name: "Green Rangers", color: "green" },
  { id: "yellow", name: "Yellow Lions", color: "yellow" },
];

export function getTeamColorClass(color: Team["color"], type: "bg" | "text" | "border" | "bg-muted") {
  const map = {
    bg: { red: "bg-team-red", blue: "bg-team-blue", green: "bg-team-green", yellow: "bg-team-yellow" },
    text: { red: "text-team-red", blue: "text-team-blue", green: "text-team-green", yellow: "text-team-yellow" },
    border: { red: "border-team-red", blue: "border-team-blue", green: "border-team-green", yellow: "border-team-yellow" },
    "bg-muted": { red: "bg-team-red-muted", blue: "bg-team-blue-muted", green: "bg-team-green-muted", yellow: "bg-team-yellow-muted" },
  };
  return map[type][color];
}