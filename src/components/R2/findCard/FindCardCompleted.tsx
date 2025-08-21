import DialogTemplate from "@/components/DialogTemplate";
import { Button } from "@/components/ui/button";
import React from "react";
import { createPortal } from "react-dom";
import ReactPlayer from "react-player";
import { Map } from "lucide-react";
import { authService } from "@/services/authService";
import { useCardPosition } from "@/hooks/useCardPosition";
import { playSound } from "@/utils/sound";
import { FIND_CARD_POINT_RULE_ID } from "@/types/pointRule";
import { useTranslation } from "react-i18next";


type FindCardCompletedProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  url: string;
  parentNode?: React.RefObject<HTMLDivElement | null>;
}

const FindCardCompleted: React.FC<FindCardCompletedProps> = ({ open, setOpen, url, parentNode = "body" }) => {

  const { t } = useTranslation();
  const { clearPosition } = useCardPosition();
  const [isClickedlink, setIsClickedLink] = React.useState(false);
  
  const handleLearnMore = async () => {
    window.open("https://rog.asus.com/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/", "_blank");
    
    const res = await authService.addPointByRuleId(FIND_CARD_POINT_RULE_ID);

    if (res.status === "Success") {
      setIsClickedLink(true);
      // 播放得分音效
      playSound("./sound/r2/get_point.wav");
    }    
  }

  // 如果已經點擊了連結，則顯示不同的內容
  if (isClickedlink) return createPortal(
    <DialogTemplate open={open} setOpen={setOpen} className="w-auto">
      {/* Icon */}
      <img src="./images/wheel/video-finished.png" alt="Get Draw Point" />

      {/* 文字 */}
      <h2 className="text-3xl">{t("r2.secret_mission.get_points.title")}</h2>
      <h2 className="">{t("r2.secret_mission.get_points.sub_title")}</h2>
      <p className="font-bold my-6">{t("r2.secret_mission.get_points.point")}</p>


      {/* 按鈕 */}
      <Button
        size="lg"
        className="botton-background-gradient text-black cursor-pointer w-full"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false);
          clearPosition();
        }}
      >
        <Map />
      </Button>
    </DialogTemplate>,
    parentNode && typeof parentNode !== "string" && parentNode.current
      ? parentNode.current
      : document.body
  );
  
  return createPortal(
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      onClose={clearPosition}
      closeButton={false}
    >
      {/* 標題 */}
      <h2 className="text-4xl font-bold mb-8">{t("r2.secret_mission.found.title")}</h2>

      {/* 圖片 */}
      <img src="./elements/r2/findCard/completed.png" alt="Completed" className="w-2/3 md:w-56 mb-8" />

      {/* 文字 - 段落 1 */}
      <div className="flex flex-col gap-4 mb-8">
        <p>
          {t("r2.secret_mission.found.description1")}
        </p>
        {/* 文字 - 段落 2 */}
        <p>
          {t("r2.secret_mission.found.description2")}
        </p>

        {/* 文字 - 段落 3 */}
        <p>
          {t("r2.secret_mission.found.description3")}
        </p>
      </div>


      <div
        className=""
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
          playing={open}
        />
      </div>

      {/* 按鈕 */}
      <Button
        size="lg"
        className="botton-background-gradient text-black cursor-pointer w-full md:w-56 mt-12"
        onClick={handleLearnMore}
      >
        {t("r2.secret_mission.found.button")}
      </Button>
    </DialogTemplate>,
    parentNode && typeof parentNode !== "string" && parentNode.current
      ? parentNode.current
      : document.body
  );
}

export default FindCardCompleted;