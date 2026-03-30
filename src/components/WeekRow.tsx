import { format } from "date-fns";
import DayCell from "./DayCell";
import { getCurrentWeekDates, formatDateKey, isFutureDate, isToday } from "@/lib/dates";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

interface WeekRowProps {
  logs: { date: string }[];
  onToggle: (dateKey: string) => void;
}

const WeekRow = ({ logs, onToggle }: WeekRowProps) => {
  const weekDates = getCurrentWeekDates();
  const logSet = new Set(logs.map((l) => l.date));

  return (
    <div className="flex justify-between gap-1">
      {weekDates.map((date, i) => {
        const key = formatDateKey(date);
        return (
          <DayCell
            key={key}
            date={date}
            done={logSet.has(key)}
            isFuture={isFutureDate(date)}
            isToday={isToday(date)}
            dayLabel={DAY_LABELS[i]}
            onClick={() => onToggle(key)}
          />
        );
      })}
    </div>
  );
};

export default WeekRow;
