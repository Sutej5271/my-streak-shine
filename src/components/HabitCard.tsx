import { useState } from "react";
import { motion } from "framer-motion";
import { Habit } from "@/lib/types";
import WeekRow from "./WeekRow";
import ProgressRing from "./ProgressRing";
import StatBar from "./StatBar";
import HistoryGrid from "./HistoryGrid";
import OverflowMenu from "./OverflowMenu";
import { computeCurrentStreak, computePersonalBest, computeWeekCompletion } from "@/lib/streaks";
import { getCurrentWeekDates, formatDateKey } from "@/lib/dates";
import { ChevronDown } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  onToggle: (dateKey: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitCard = ({ habit, onToggle, onEdit, onDelete }: HabitCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const weekDates = getCurrentWeekDates().map(formatDateKey);
  const currentStreak = computeCurrentStreak(habit.logs);
  const personalBest = computePersonalBest(habit.logs);
  const weekPercent = computeWeekCompletion(habit.logs, weekDates);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{habit.emoji}</span>
          <h3 className="font-semibold text-foreground truncate" title={habit.name}>
            {habit.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ProgressRing percent={weekPercent} size={40} />
          <OverflowMenu onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>

      {/* Week row */}
      <div className="mb-4">
        <WeekRow logs={habit.logs} onToggle={onToggle} />
      </div>

      {/* Stats */}
      <StatBar current={currentStreak} best={personalBest} total={habit.logs.length} />

      {/* History toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        90-day history
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 overflow-hidden"
        >
          <HistoryGrid logs={habit.logs} createdAt={habit.createdAt} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default HabitCard;
