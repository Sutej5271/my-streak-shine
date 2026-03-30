import { useState, useEffect, useCallback, useRef } from "react";
import { Habit } from "@/lib/types";

const STORAGE_KEY = "streak_habits";

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Basic validation
    return parsed.filter(
      (h: any) => h && typeof h.id === "string" && typeof h.name === "string" && Array.isArray(h.logs)
    );
  } catch {
    console.warn("Corrupted streak_habits data, resetting.");
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error("Failed to save habits to localStorage", e);
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const deletedRef = useRef<{ habit: Habit; timeout: ReturnType<typeof setTimeout> } | null>(null);

  // Persist on change
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // Listen for cross-tab storage changes
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setHabits(loadHabits());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Date change detection
  const [, setTick] = useState(0);
  useEffect(() => {
    let lastDate = new Date().toDateString();
    const interval = setInterval(() => {
      const now = new Date().toDateString();
      if (now !== lastDate) {
        lastDate = now;
        setTick((t) => t + 1);
      }
    }, 60000);
    const onVisibility = () => {
      const now = new Date().toDateString();
      if (now !== lastDate) {
        lastDate = now;
        setTick((t) => t + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const addHabit = useCallback((name: string, emoji: string) => {
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji,
      createdAt: new Date().toISOString(),
      sortOrder: 0,
      logs: [],
    };
    setHabits((prev) => [...prev, habit]);
  }, []);

  const updateHabit = useCallback((id: string, name: string, emoji: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: name.trim(), emoji } : h))
    );
  }, []);

  const deleteHabit = useCallback((id: string): (() => void) => {
    // Clear any previous pending delete
    if (deletedRef.current) {
      clearTimeout(deletedRef.current.timeout);
      deletedRef.current = null;
    }

    let deletedHabit: Habit | null = null;
    setHabits((prev) => {
      deletedHabit = prev.find((h) => h.id === id) || null;
      return prev.filter((h) => h.id !== id);
    });

    // Undo function
    const undo = () => {
      if (deletedRef.current) {
        clearTimeout(deletedRef.current.timeout);
        deletedRef.current = null;
      }
      if (deletedHabit) {
        setHabits((prev) => [...prev, deletedHabit!]);
      }
    };

    const timeout = setTimeout(() => {
      deletedRef.current = null;
    }, 5000);

    if (deletedHabit) {
      deletedRef.current = { habit: deletedHabit, timeout };
    }

    return undo;
  }, []);

  const toggleLog = useCallback((habitId: string, dateKey: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.logs.some((l) => l.date === dateKey);
        return {
          ...h,
          logs: exists
            ? h.logs.filter((l) => l.date !== dateKey)
            : [...h.logs, { date: dateKey, completedAt: new Date().toISOString() }],
        };
      })
    );
  }, []);

  const canAddHabit = habits.length < 6;

  return { habits, addHabit, updateHabit, deleteHabit, toggleLog, canAddHabit };
}
