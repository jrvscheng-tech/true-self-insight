import { motion } from "framer-motion";

interface TypingLoaderProps {
  message?: string;
}

const TypingLoader = ({ message }: TypingLoaderProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export default TypingLoader;
