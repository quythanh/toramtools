export interface Level {
  level: number;
  date: string;
}

export interface MainQuest {
  id: number;
  chapter: number;
  name: string;
  exp: number;
}

export interface PlayerStat {
  level: number;
  percent: number;
  target: number;
}
