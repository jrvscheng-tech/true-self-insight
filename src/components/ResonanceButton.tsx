import { motion } from "framer-motion";

interface ResonanceButtonProps {
  text: string;
  selected?: boolean;
  onClick: () => void;
}

const ResonanceButton = ({ text, selected, onClick }: ResonanceButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm leading-relaxed btn-press ${
        selected
          ? "bg-accent/30 border-accent text-foreground shadow-glow"
          : "bg-card border-border/50 text-foreground/80 hover:border-accent/50 hover:bg-accent/10"
      }`}
    >
      "{text}"
    </motion.button>
  );
};

export default ResonanceButton;
