import useMobile from "@/hooks/useMobile";
import DialogTemplate from "../DialogTemplate";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

type VideoFinishedDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
   okText?: string;
};

const VideoFinishedDialog: React.FC<VideoFinishedDialogProps> = ({
  open,
  setOpen,
  okText,
}) => {
  const { isMobile } = useMobile();
  const { t } = useTranslation();

  return (
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      className={cn("gap-6 z-[70]", isMobile ? "" : "w-[40vw]")}
    >
      {/* Icon */}
      <img src="./images/wheel/video-finished.png" alt="Video Finished" />

      {/* 文字 */}
      <h2 className="text-3xl">{t("r1.wheel.videoFinished.title")}</h2>
      <p>{t("r1.wheel.videoFinished.sub_title")}</p>
      <p className="font-bold">{t("r1.wheel.videoFinished.point")}</p>

      {/* 按鈕群 */}
      <div className={cn("w-full flex gap-4", isMobile && "flex-col")}>
        <Button
          className="botton-background-gradient flex-1 text-black cursor-pointer"
          onClick={() => {
            setOpen(false);
          }}
        >
          {okText ?? t("r1.wheel.videoFinished.wheel_button")}
        </Button>
      </div>
    </DialogTemplate>
  );
};

export default VideoFinishedDialog;
