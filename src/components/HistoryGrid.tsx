import { format, isBefore, startOfDay } from "date-fns";
import { getLast90Days, formatDateKey } from "@/lib/dates";
import { useState } from "react";

interface HistoryGridProps {
  logs: { date: string }[];
  createdAt: string;
}

const HistoryGrid = ({ logs, createdAt }: HistoryGridProps) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const days = getLast90Days();
  const logSet = new Set(logs.map((l) => l.date));
  const createdDate = startOfDay(new Date(createdAt));

  // Arrange into weeks (columns) with Mon at top
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  for (const day of days) {
    const dow = day.getDay(); // 0=Sun
    const isoDay = dow === 0 ? 7 : dow; // 1=Mon..7=Sun
    if (isoDay === 1 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="relative">
      {hoveredDate && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap z-10">
          {hoveredDate}
        </div>
      )}
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => {
              const key = formatDateKey(day);
              const isPreCreation = isBefore(day, createdDate);
              const done = logSet.has(key);

              let bgClass = "bg-habit-empty";
              if (isPreCreation) bgClass = "bg-habit-precreation";
              else if (done) bgClass = "bg-history-l3";

              return (
                <div
                  key={key}
                  className={`w-[10px] h-[10px] rounded-[2px] ${bgClass} transition-colors`}
                  onMouseEnter={() => setHoveredDate(format(day, "MMM d, yyyy"))}
                  onMouseLeave={() => setHoveredDate(null)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGrid;
