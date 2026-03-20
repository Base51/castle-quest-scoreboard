export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Game {
  id: string;
  name: string;
  scores: Record<string, number>; // teamId -> points
}

export const DEFAULT_TEAMS: Team[] = [
  { id: "red", name: "Red Knights", color: "#b91c1c" },
  { id: "blue", name: "Blue Dragons", color: "#1d4ed8" },
  { id: "green", name: "Green Rangers", color: "#15803d" },
  { id: "yellow", name: "Yellow Lions", color: "#ca8a04" },
];