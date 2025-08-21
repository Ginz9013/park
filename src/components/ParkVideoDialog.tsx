import React, { useState } from "react";
import ReactPlayer from "react-player";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useMission } from "@/hooks/useMission";
import VideoFinishedDialog from "./Wheel/VideoFinishedDialog";
import { authService } from "@/services/authService";
import { playSound } from "@/utils/sound";
import { KOL_VIDEO_POINT_RULE_ID } from "@/types/pointRule";


interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const ParkVideoDialog: React.FC<VideoDialogProps> = ({
  isOpen,
  onClose,
  url,
}) => {
  const { missions } = useMission();

  const isGetPointDaily = !!missions.get(7)?.completedAt;

  const [showGetPointDialog, setShowGetPointDialog] = useState<boolean>(false);

  const handleClose = () => {
    onClose();
  };

  const handlePlayEnd = async () => {
    // 如果當天已經得過分了，不處理直接跳過
    if (isGetPointDaily) return;

    const addedPoint = await authService.addPointByRuleId(KOL_VIDEO_POINT_RULE_ID);

    // 如果加分失敗，不處理
    if (addedPoint.status !== "Success") return;
    setShowGetPointDialog(true);
    // 播放得分音效
    playSound("./sound/r2/get_point.wav");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="video-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative px-7 py-10 w-full max-w-3xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            style={{
              background:
                "linear-gradient(65deg,rgba(20, 156, 255, .5) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .5) 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* close button */}
            <div className="absolute top-0 right-0 ">
              <button
                className="text-white p-4 cursor-pointer"
                onClick={handleClose}
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-white text-2xl text-center font-bold mb-7">
              Video
            </div>
            <div
              className=" "
              style={{
                width: "100%",
                height: "auto",
                position: "relative",
                paddingTop: "56.25%",
              }}
            >
              <ReactPlayer
                url={url}
                style={{ position: "absolute", top: 0, left: 0 }}
                width="100%"
                height="100%"
                controls
                playing={isOpen}
                onEnded={handlePlayEnd}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 得分彈跳視窗 */}
      <VideoFinishedDialog
        open={showGetPointDialog}
        setOpen={setShowGetPointDialog}
        okText="OK"
      />
    </AnimatePresence>
  );
};

export default ParkVideoDialog;
