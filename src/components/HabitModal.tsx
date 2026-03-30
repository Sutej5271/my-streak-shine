import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { Habit } from "@/lib/types";

interface HabitModalProps {
  initialHabit?: Habit;
  onSave: (name: string, emoji: string) => void;
  onClose: () => void;
  existingNames: string[];
}

const HabitModal = ({ initialHabit, onSave, onClose, existingNames }: HabitModalProps) => {
  const [name, setName] = useState(initialHabit?.name || "");
  const [emoji, setEmoji] = useState(initialHabit?.emoji || "✨");
  const [error, setError] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const trimmed = name.trim();

  useEffect(() => {
    const isDuplicate = existingNames.some(
      (n) => n.toLowerCase() === trimmed.toLowerCase() && n !== initialHabit?.name
    );
    setDuplicateWarning(isDuplicate);
  }, [trimmed, existingNames, initialHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    if (trimmed.length > 40) {
      setError("Max 40 characters");
      return;
    }
    onSave(trimmed, emoji);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-display">
            {initialHabit ? "Edit habit" : "New habit"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              maxLength={40}
              placeholder="e.g. Read 30 minutes"
              className="w-full bg-secondary border-0 rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-destructive">{error}</span>
              <span className="text-xs text-muted-foreground">{trimmed.length}/40</span>
            </div>
            {duplicateWarning && (
              <p className="text-xs text-primary mt-1">You already have a habit called this.</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Emoji</label>
            <EmojiPicker value={emoji} onChange={setEmoji} />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            {initialHabit ? "Save changes" : "Save"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default HabitModal;
