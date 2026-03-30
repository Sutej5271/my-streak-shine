export interface HabitLog {
  date: string; // YYYY-MM-DD
  completedAt?: string; // ISO 8601
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: string; // ISO 8601
  sortOrder: number;
  logs: HabitLog[];
}
