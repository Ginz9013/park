import DialogTemplate from "@/components/DialogTemplate";
import { Button } from "@/components/ui/button";
import { useCardPosition } from "@/hooks/useCardPosition";
import { useMission } from "@/hooks/useMission";
import { authService } from "@/services/authService";
import React, { RefObject, useState } from "react";
import { createPortal } from "react-dom";
import { playSound } from "@/utils/sound";
import { FIND_CARD_POINT_RULE_ID } from "@/types/pointRule";
import { useTranslation } from "react-i18next";


type FoundedCardProps = {
  id: number;
  top: number;
  left: number;
  openCompletedModal: () => void;
  parentNode: RefObject<HTMLDivElement | null>;
}

const FoundedCard: React.FC<FoundedCardProps> = ({ id, top, left, openCompletedModal, parentNode }) => {

  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  const { removePosition } = useCardPosition();
  const { missions, refetch } = useMission();

  const handleFoundCard = async () => {
    const missionState = missions.get(FIND_CARD_POINT_RULE_ID);
    const isCompleted = !!missionState?.completedAt;
    const foundedCards = missionState?.progress ?? 0;

    let res;

    // 沒完成，也沒有找到任何一張卡 => 當日還沒有建立該任務紀錄
    if (!isCompleted && foundedCards === 0) {
      // 新增任務紀錄
      res = await authService.createMissionRecord(FIND_CARD_POINT_RULE_ID, 1);
    } else {
      // 更新任務紀錄
      res = await authService.updateMissionRecord({
        ruleId: FIND_CARD_POINT_RULE_ID,
        progress: foundedCards + 1,
        done: foundedCards === 2 ? true : false, // 如果已經找到 2 張，加上這次就是 3 張，因此修改狀態為完成
      });
    }

    // 統一更新 API 狀態
    refetch();

    // 找到三張 & completedAt 已有時間戳
    if (res.progress === 3 && res.completedAt) {
      playSound("./sound/r2/found_three_graphic_card.wav");
      // 打開湊齊完成視窗
      openCompletedModal();
    } else {
      playSound("./sound/r2/found_graphic_card.wav");
      // 打開普通反饋視窗
      setOpen(true);
    }    
  };

  const handleClose = () => {
    setOpen(false);
    // 更新 CarPosition 狀態
    removePosition(id);
  };

  return (<>
    {/* 隱形點擊區 */}
    <div
      className="absolute w-[6%] h-[10%] z-10 cursor-pointer transition-all duration-300 group"
      style={{ top: `${top}%`, left: `${left}%`}}
      onClick={handleFoundCard}
      onTouchStart={handleFoundCard}
    ></div>

    {/* 點擊 - 彈跳視窗 */}
    {createPortal(
      <DialogTemplate open={open} setOpen={setOpen} className="w-96">
        {/* 標題 */}
        <h2 className="text-4xl font-bold mb-8">{t("r2.secret_mission.found.title")}</h2>

        {/* 圖片 */}
        <img src="./elements/r2/findCard/completed.png" alt="Completed" className="w-36" />

        {/* 按鈕 */}
        <Button
          size="lg"
          className="botton-background-gradient text-black cursor-pointer w-full md:w-56 mt-12"
          onClick={handleClose}
        >
          OK
        </Button>
      </DialogTemplate>,
      parentNode?.current ?? document.body
    )}
  </>);
}

export default FoundedCard;
