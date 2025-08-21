import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, X } from "lucide-react";

interface MusicHintProps {
  onEnableMusic: () => void;
  onDismiss: () => void;
}

export default function MusicHint({
  onEnableMusic,
  onDismiss,
}: MusicHintProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 5秒後自動隱藏
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 500); // 動畫完成後移除
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <Music size={20} className="animate-pulse" />
            <div>
              <div className="font-semibold">🎵 開啟背景音樂</div>
              <div className="text-sm opacity-80">讓您的體驗更加豐富</div>
            </div>
            <button
              onClick={() => {
                onEnableMusic();
                setIsVisible(false);
                setTimeout(onDismiss, 500);
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              開啟
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 500);
              }}
              className="text-black/60 hover:text-black/80 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
