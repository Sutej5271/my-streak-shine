import { startOfWeek, endOfWeek, eachDayOfInterval, format, isAfter, isSameDay, startOfDay, subDays } from "date-fns";

export function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(today, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function formatDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function isFutureDate(date: Date): boolean {
  return isAfter(startOfDay(date), startOfDay(new Date()));
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function getLast90Days(): Date[] {
  const today = startOfDay(new Date());
  const days: Date[] = [];
  for (let i = 89; i >= 0; i--) {
    days.push(subDays(today, i));
  }
  return days;
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}
