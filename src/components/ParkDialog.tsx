import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { t } from "i18next";

interface ParkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
}

export const ParkDialog: React.FC<ParkDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setHasReadToBottom(isAtBottom);
    console.log(hasReadToBottom);
  };

  const handleClose = () => {
    onClose();
  };

  // const handleAccept = () => {
  //   if (hasReadToBottom) {
  //     onAccept();
  //     onClose();
  //   }
  // };

  useEffect(() => {
    if (isOpen) {
      setHasReadToBottom(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-full mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            style={{
              background:
                "linear-gradient(65deg,rgba(20, 156, 255, .5) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .5) 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 標題欄 */}
            <div className=" pt-12">
              <h2 className="text-3xl md:text-4xl  text-white text-center font-TTNormsProMedium">
                {t("r1.entry.title")}
              </h2>
            </div>

            {/* 內容區域 */}
            <div className="px-8 pt-4 pb-5">
              <div
                ref={contentRef}
                onScroll={handleScroll}
                className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto  space-y-4 text-sm leading-relaxed term-content"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
                }}
              >
                <div className="text-lg md:text-xl  text-white text-center font-TTNormsProMedium">
                  {t("r1.entry.description")}
                </div>

                <div className="flex flex-col items-center justify-center mt-12">
                  <div className="text-3xl md:text-4xl  text-[#C1BCFA] text-center font-TTNormsProMedium">
                    {t("r1.entry.wheel_title")}
                  </div>
                  <div className="text-lg md:text-xl  text-white text-center mt-4">
                    {t("r1.entry.wheel_description")}
                  </div>
                  <img
                    src="./images/0703/map01.png"
                    alt="Memory Ferris Wheel"
                    className="w-full mt-6"
                  />
                </div>
                <div className="flex flex-col items-center justify-center mt-12">
                  <div className="text-3xl md:text-4xl  text-[#C1BCFA] text-center font-TTNormsProMedium">
                    {t("r1.entry.coaster_title")}
                  </div>
                  <div className="text-lg md:text-xl  text-white text-center mt-4">
                    {t("r1.entry.coaster_description")}
                  </div>
                  <img
                    src="./images/0703/map02.png"
                    alt="Memory Ferris Wheel"
                    className="w-full mt-6"
                  />
                </div>
                {/* 第二階段開放 - display hidden */}
                <div className="flex flex-col items-center justify-center mt-12 hidden">
                  <div className="text-3xl md:text-4xl  text-[#C1BCFA] text-center font-TTNormsProMedium">
                    Polling Station
                  </div>
                  <div className="text-lg md:text-xl  text-white text-center mt-4">
                    Share your story and step into a cabin full of memories!
                     More attractions coming soon—bring your friends and win
                    amazing prizes!
                  </div>
                  <img
                    src="./images/0703/map03.png"
                    alt="Memory Ferris Wheel"
                    className="w-full mt-6"
                  />
                </div>
                <div className="flex flex-col items-center justify-center mt-12 hidden">
                  <div className="text-3xl md:text-4xl  text-[#C1BCFA] text-center font-TTNormsProMedium">
                    Cable Car
                  </div>
                  <div className="text-lg md:text-xl  text-white text-center mt-4">
                    Share your story and step into a cabin full of memories!
                     More attractions coming soon—bring your friends and win
                    amazing prizes!
                  </div>
                  <img
                    src="./images/0703/map04.png"
                    alt="Memory Ferris Wheel"
                    className="w-full mt-6"
                  />
                </div>
              </div>

              {/* 按鈕區域 */}
              <div className="flex justify-center items-center mt-6 pt-4 border-t border-white/10">
                <Button
                  onClick={handleClose}
                  className="border-white/20 text-white hover:bg-white/10  cursor-pointer"
                >
                  {t("r1.entry.close")}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParkDialog;
