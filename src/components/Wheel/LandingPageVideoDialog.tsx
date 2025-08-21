import React from "react";
import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "motion/react";

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const LandingPageVideoDialog: React.FC<VideoDialogProps> = ({
  isOpen,
  onClose,
  url,
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            style={{
              background:
                "linear-gradient(65deg,rgba(20, 156, 255, .5) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .5) 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ReactPlayer
              url={url}
              width="100%"
              height="360px"
              controls
              playing={isOpen}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingPageVideoDialog;
