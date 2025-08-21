import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
// import { t } from "i18next";
// import useMobile from "@/hooks/useMobile";
import GameApp from "@/game/GameApp";



type GamePageProps = {
  onClose: () => void;
}

const GamePage: React.FC<GamePageProps> = ({ onClose }) => {
  // const { isMobile } = useMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "text-white absolute top-0 left-0 w-full h-screen z-40 flex flex-col items-center justify-start overflow-auto"
      )}
      style={{
        backgroundImage: `url(./images/r2/background_arcade.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      {/* 主要內容 */}
      <GameApp onPageClose={onClose} />
    </motion.div>
  );
}

export default GamePage;