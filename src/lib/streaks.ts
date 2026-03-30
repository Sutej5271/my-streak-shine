import { Habit } from "./types";
import { subDays, format, startOfDay } from "date-fns";

export function computeCurrentStreak(logs: Habit["logs"]): number {
  const logSet = new Set(logs.map((l) => l.date));
  const today = startOfDay(new Date());
  const todayKey = format(today, "yyyy-MM-dd");
  const yesterdayKey = format(subDays(today, 1), "yyyy-MM-dd");

  // Start from today if completed, otherwise yesterday (grace period)
  let startDate: Date;
  if (logSet.has(todayKey)) {
    startDate = today;
  } else if (logSet.has(yesterdayKey)) {
    startDate = subDays(today, 1);
  } else {
    return 0;
  }

  let streak = 0;
  let current = startDate;
  while (true) {
    const key = format(current, "yyyy-MM-dd");
    if (logSet.has(key)) {
      streak++;
      current = subDays(current, 1);
    } else {
      break;
    }
  }
  return streak;
}

export function computePersonalBest(logs: Habit["logs"]): number {
  if (logs.length === 0) return 0;
  const sorted = [...logs].map((l) => l.date).sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      current++;
      best = Math.max(best, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }
  return best;
}

export function computeWeekCompletion(logs: Habit["logs"], weekDates: string[]): number {
  const logSet = new Set(logs.map((l) => l.date));
  const completed = weekDates.filter((d) => logSet.has(d)).length;
  return completed / 7;
}
