import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import VideoFinishedDialog from "./VideoFinishedDialog";
import ReactPlayer from "react-player";

type FullScreenVideoProps = {
  videoUrl: string;
};
const FullScreenVideo: React.FC<FullScreenVideoProps> = ({ videoUrl }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openFinishedDialog, setOpenFinishedDialog] = useState<boolean>(false);

  return (
    <>
      {/* 預覽圖 */}
      <div
        className="w-full aspect-[1/1] bg-gray-800 cursor-pointer relative"
        // onClick={() => setOpen(true)}
      >
        <ReactPlayer
          url={videoUrl}
          light={true} // 這會只顯示預覽圖片
          playing={false} // 預設不播放（其實light=true時也不會自動播放）
          width="100%"
          height="100%"
        />
      </div>

      {/* 點擊打開的內容 */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-black/70 text-white absolute top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center"
        >
          {/* 右上角 X */}
          <Button
            variant="ghost"
            className="absolute z-50 top-4 right-4 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>

          {/* 影片 */}
          {/* controls 控制項再選擇是否要留著 */}
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls={true}
          />
        </motion.div>
      )}

      {/* 影片播完的彈跳視窗 */}
      {/* 後續補上影片播放完畢，setOpenFinishedDialog(true) 邏輯 */}
      {openFinishedDialog && (
        <VideoFinishedDialog
          open={openFinishedDialog}
          setOpen={setOpenFinishedDialog}
        />
      )}
    </>
  );
};

export default FullScreenVideo;
