import { motion } from "framer-motion";

interface DayCellProps {
  date: Date;
  done: boolean;
  isFuture: boolean;
  isToday: boolean;
  dayLabel: string;
  onClick: () => void;
}

const DayCell = ({ done, isFuture, isToday, dayLabel, onClick }: DayCellProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isFuture}
      className={`flex flex-col items-center gap-1 group`}
    >
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {dayLabel}
      </span>
      <motion.div
        whileTap={!isFuture ? { scale: 0.85 } : undefined}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-colors duration-200 flex items-center justify-center
          ${isFuture ? "bg-habit-future cursor-not-allowed opacity-40" : ""}
          ${!isFuture && done ? "bg-habit-done" : ""}
          ${!isFuture && !done ? "bg-habit-empty hover:bg-border cursor-pointer" : ""}
          ${isToday ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}
        `}
      >
        {done && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 text-primary-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </motion.div>
    </button>
  );
};

export default DayCell;
