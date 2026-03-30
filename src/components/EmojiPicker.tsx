const EMOJIS = [
  "✨", "🔥", "💪", "📚", "🧘", "🏃", "💧", "🎯", "🌱", "💤",
  "🧠", "✍️", "🎨", "🎵", "🍎", "🥗", "💊", "🧹", "📝", "🐕",
  "☕", "🚶", "🧘‍♀️", "🏋️", "🚴", "🧑‍💻", "📖", "🎸", "🌿", "❤️",
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const EmojiPicker = ({ value, onChange }: EmojiPickerProps) => {
  return (
    <div className="grid grid-cols-6 gap-2">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`text-xl w-10 h-10 rounded-lg flex items-center justify-center transition-all
            ${value === emoji ? "bg-primary/15 ring-2 ring-primary scale-110" : "hover:bg-secondary"}
          `}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
