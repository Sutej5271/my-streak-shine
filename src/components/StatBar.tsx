import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Calendar } from "lucide-react";

interface StatBarProps {
  current: number;
  best: number;
  total: number;
}

const StatItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: number }) => (
  <div className="flex items-center gap-1.5 text-sm">
    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
    <span className="text-muted-foreground">{label}</span>
    <motion.span
      key={value}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="font-semibold text-foreground tabular-nums"
    >
      {value}
    </motion.span>
  </div>
);

const StatBar = ({ current, best, total }: StatBarProps) => {
  return (
    <div className="flex gap-4 flex-wrap">
      <StatItem icon={Flame} label="Streak" value={current} />
      <StatItem icon={Trophy} label="Best" value={best} />
      <StatItem icon={Calendar} label="Total" value={total} />
    </div>
  );
};

export default StatBar;
