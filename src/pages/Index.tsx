import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { Habit } from "@/lib/types";
import HabitCard from "@/components/HabitCard";
import HabitModal from "@/components/HabitModal";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";

const Index = () => {
  const { habits, addHabit, updateHabit, deleteHabit, toggleLog, canAddHabit } = useHabits();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const openCreate = () => {
    setEditingHabit(undefined);
    setModalOpen(true);
  };

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleSave = (name: string, emoji: string) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, name, emoji);
    } else {
      addHabit(name, emoji);
    }
    setModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleDelete = (habit: Habit) => {
    const undo = deleteHabit(habit.id);
    toast(`"${habit.name}" deleted`, {
      action: {
        label: "Undo",
        onClick: undo,
      },
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground">Streak Tracker</h1>
            <p className="text-sm text-muted-foreground mt-1">Build consistency, one day at a time</p>
          </div>
          {habits.length > 0 && (
            <button
              onClick={openCreate}
              disabled={!canAddHabit}
              title={!canAddHabit ? "Delete a habit to add a new one" : "Add habit"}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add habit
            </button>
          )}
        </div>

        {/* Content */}
        {habits.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={(dateKey) => toggleLog(habit.id, dateKey)}
                  onEdit={() => openEdit(habit)}
                  onDelete={() => handleDelete(habit)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <HabitModal
            initialHabit={editingHabit}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditingHabit(undefined); }}
            existingNames={habits.map((h) => h.name)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
