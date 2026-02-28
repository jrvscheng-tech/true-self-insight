import { motion } from "framer-motion";
import tarotCard1 from "@/assets/tarot-card-1.png";
import tarotCard2 from "@/assets/tarot-card-2.png";
import tarotCard3 from "@/assets/tarot-card-3.png";

const cards = [tarotCard1, tarotCard2, tarotCard3];

interface TarotCardProps {
  cardIndex?: number;
  label?: string;
}

const TarotCard = ({ cardIndex = 0, label }: TarotCardProps) => {
  const src = cards[cardIndex % cards.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: 90 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto w-48 sm:w-56 md:w-64"
    >
      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-card border-2 border-border/30">
        <img
          src={src}
          alt="Reflection card"
          className="w-full h-full object-cover"
        />
      </div>
      {label && (
        <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
          {label}
        </p>
      )}
    </motion.div>
  );
};

export default TarotCard;
