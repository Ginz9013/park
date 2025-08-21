import React, { useEffect, useRef, useState } from "react";
import DialogTemplate from "@/components/DialogTemplate";
import { Button } from "@/components/ui/button";
import { Map, Gamepad2 } from "lucide-react";
import { type CharacterSpec } from "@/game/config/characters";
import { useMission } from "@/hooks/useMission";
import { authService } from "@/services/authService";
import { playSound } from "@/utils/sound";
import { FIRST_GAME_POINT_RULE_ID, DAILY_GAME_POINT_RULE_ID } from "@/types/pointRule";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";


const endImgMap: Record<string, string> = {
  matrix: "./elements/r2/game/game_end_30thVGA.png",
  astral: "./elements/r2/game/game_end_ROGAstral.png",
  strix: "./elements/r2/game/game_end_ROGStrix.png",
  tuf: "./elements/r2/game/game_end_TUFGaming.png",
  proArt: "./elements/r2/game/game_end_ProArt.png",
}

type GameEndModalProps = {
  playerName: string;
  character: CharacterSpec;
  score: number;
  restart: () => void;
  onPageClose: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({ playerName, character, score, restart, onPageClose }) => {

  const { refreshAuth } = useAuth();
  const { t } = useTranslation();
  const { missions, refetch } = useMission();

  const isAddedPoint = useRef<boolean>(false);

  const [getPoint, setGetPoint] = useState<0 | 1 | 3>(0);

  useEffect(() => {
    (async () => {
      const hasGotFirstGamePoint = missions.get(FIRST_GAME_POINT_RULE_ID)?.completedAt;
      const hasGotDailyGamePoint = missions.get(DAILY_GAME_POINT_RULE_ID)?.completedAt;

      if (hasGotFirstGamePoint === undefined || hasGotDailyGamePoint === undefined) return;
      if (isAddedPoint.current) return;

      // 還沒完成第一次遊戲
      if (!hasGotFirstGamePoint) {

        // 加分
        const res = await authService.addPointByRuleId(FIRST_GAME_POINT_RULE_ID);
        if (res.status !== "Success") return;

        // 建立任務紀錄
        await authService.createMissionRecord(FIRST_GAME_POINT_RULE_ID);
        // 更新 API
        refetch();

        // 播放得分音效
        playSound("./sound/r2/get_point.wav");

        // 更新 UI
        const FIRST_GAME_POINT = 3;
        setGetPoint(FIRST_GAME_POINT);
        isAddedPoint.current = true;
        refreshAuth();
        return ;
      }

      // 完成第一次遊戲，還沒完成每日遊戲
      if (hasGotFirstGamePoint && !hasGotDailyGamePoint) {

        // 加分
        const res = await authService.addPointByRuleId(DAILY_GAME_POINT_RULE_ID);
        if (res.status !== "Success") return;

        // 建立任務紀錄
        await authService.createMissionRecord(DAILY_GAME_POINT_RULE_ID);

        // 更新 API
        refetch();

        // 播放得分音效
        playSound("./sound/r2/get_point.wav");

        // 更新 UI
        const DAILY_GAME_POINT = 1;
        setGetPoint(DAILY_GAME_POINT);
        isAddedPoint.current = true;
        refreshAuth();
        return;
      }

      // 都已完成
      return;
    })();

  }, [missions]);

  return (
    <DialogTemplate
      className="w-full md:w-[800px] py-8"
      open={true}
      setOpen={() => {}}
      onClose={() => {
        isAddedPoint.current = false;
        restart();
      }}
    >
      {/* Icon */}
      <img src="./images/wheel/video-finished.png" alt="Get Draw Point" />

      {/* 標題 */}
      <h2 className="text-2xl lg:text-4xl text-glow">{t("r2.arcade.game_over.title")}</h2>

      {/* 文字 */}
      <p className="font-bold text-2xl my-6">
        {getPoint === 0
          ? ""
          : getPoint === 3
            ? t("r2.arcade.game_over.points")
            : t("r2.arcade.game_over.points")
        }
      </p>

      {/* 結算圖片 */}
      <div className="relative mb-6">
        <img src={endImgMap[character.id]} alt="Game End" />

        <p className="absolute top-[6%] md:top-6 left-[15%] md:left-20 text-xs sm:text-md md:text-xl">{playerName}{t("r2.arcade.game_over.name")}</p>
        <p className="absolute top-[12%] md:top-8 left-[35%] md:left-64 -translate-x-1/2 text-[46px] sm:text-[72px] md:text-[100px] font-bold">{score}</p>
      </div>

      {/* 文字 */}
      <p className="text-xl mb-6">{t("r2.arcade.game_over.description")}</p>


      {/* 按鈕群 */}
      <div className="flex flex-col md:flex-row gap-6 w-full mb-4">
        {/* 回地圖 */}
        <Button
          size="lg"
          className="flex-1 buttonn-border-gradient cursor-pointer py-4"
          onClick={(e) => {
            e.stopPropagation();
            onPageClose();
          }}
        >
          <Map />
        </Button>
        
        {/* 回遊戲頁 - 選擇角色 */}
        <Button
          size="lg"
          className="flex-1 botton-background-gradient text-black cursor-pointer py-4"
          onClick={(e) => {
            e.stopPropagation();
            isAddedPoint.current = false;
            restart();
          }}
        >
          <Gamepad2 />
        </Button>
      </div>
    </DialogTemplate>
  );
}

export default GameEndModal;

