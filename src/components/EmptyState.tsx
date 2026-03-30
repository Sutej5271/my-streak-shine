import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onAdd: () => void;
}

const EmptyState = ({ onAdd }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <h2 className="font-display text-2xl text-foreground mb-2">Start your streak</h2>
      <p className="text-muted-foreground text-sm max-w-[260px] mb-8">
        Track daily habits and build consistency. Add your first habit to get started.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Add your first habit
      </button>
    </motion.div>
  );
};

export default EmptyState;
