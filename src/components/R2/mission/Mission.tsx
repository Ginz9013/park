import { RefObject, useEffect, useState } from "react";
import DialogTemplate from "@/components/DialogTemplate";
import { Button } from "@/components/ui/button";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Goal } from "lucide-react";
import { useMission } from "@/hooks/useMission";
import { MissionData } from "@/types/auth";
import {
  WHEEL_POST_POINT_RULE_ID,
  FIRST_ROLLER_TEST_POINT_RULE_ID,
  DAILY_ROLLER_TEST_POINT_RULE_ID,
  FIRST_CABLE_CAR_POINT_RULE_ID,
  FIRST_GAME_POINT_RULE_ID,
  DAILY_GAME_POINT_RULE_ID,
  FIND_CARD_POINT_RULE_ID,
  DRAW_CARD_POINT_RULE_ID,
  WHEEL_VOTE_POINT_RULE_ID,
  SHOP_LINK_POINT_RULE_ID,
 } from "@/types/pointRule";
 import { useTranslation } from "react-i18next";


const missionList = [
  {
    id: "memoryWheel",
    ruleIds: [WHEEL_POST_POINT_RULE_ID],
    title: "r2.map.mission.wheel.title",
    description: "r2.map.mission.wheel.description",
    img: "./elements/r2/mission/wheel.png",
  },
  {
    id: "rollerCoaster",
    ruleIds: [
      FIRST_ROLLER_TEST_POINT_RULE_ID,
      DAILY_ROLLER_TEST_POINT_RULE_ID
    ],
    title: "r2.map.mission.roller.title",
    description: "r2.map.mission.roller.description",
    img: "./elements/r2/mission/roller_coaster.png",
  },
  {
    id: "cableCar",
    ruleIds: [FIRST_CABLE_CAR_POINT_RULE_ID],
    title: "r2.map.mission.cable.title",
    description: "r2.map.mission.cable.description",
    img: "./elements/r2/mission/cable_car.png",
  },
  {
    id: "arcade",
    ruleIds: [
      FIRST_GAME_POINT_RULE_ID,
      DAILY_GAME_POINT_RULE_ID
    ],
    title: "r2.map.mission.arcade.title",
    description: "r2.map.mission.arcade.description",
    img: "./elements/r2/mission/arcade.png",
  },
  {
    id: "secretMission",
    ruleIds: [FIND_CARD_POINT_RULE_ID],
    title: "r2.map.mission.secret_mission.title",
    description: "r2.map.mission.secret_mission.description",
    img: "./elements/r2/mission/graphic_card.png",
  },
  {
    id: "cardCollection",
    ruleIds: [DRAW_CARD_POINT_RULE_ID],
    title: "r2.map.mission.card_collection.title",
    description: "r2.map.mission.card_collection.description",
    img: "./elements/r2/mission/card_collection.png",
  },
  {
    id: "pollingStation",
    ruleIds: [WHEEL_VOTE_POINT_RULE_ID],
    title: "r2.map.mission.polling.title",
    description: "r2.map.mission.polling.description",
    img: "./elements/r2/mission/polling.png",
  },
  {
    id: "souvenirShop",
    ruleIds: [SHOP_LINK_POINT_RULE_ID],
    title: "r2.map.mission.shop.title",
    description: "r2.map.mission.shop.description",
    img: "./elements/r2/mission/shop.png",
  },
  {
    id: "dreamCraft",
    ruleIds: [],
    title: "r2.map.mission.dream_craft.title",
    description: "r2.map.mission.dream_craft.description",
    img: "./elements/r2/mission/dream_craft.png",
  },
]

const getCurrentState = (ruleIds: number[], misssionMap: Map<number, MissionData>): boolean => {
  const get = (id: number) => misssionMap.get(id);

  // 1. 如果只有一個規則，直接取得狀態回傳
  if (ruleIds.length === 1) return !!get(ruleIds[0])?.completedAt;

  // 2. 如果有兩個以上的規則，直接判斷 DAILY 規則的狀態
  // 約定：不可能會出現DAILY完成，但 ONCE 沒有完成的情況
  // 所以就算第一次完成 ONCE 規則，當天也有 DAILY 的任務可以做
  // 因此 UI 狀態一樣顯示未完成即可
  const dailyId = ruleIds.find(ruleId => get(ruleId)?.type === "DAILY");

  // 出錯，回傳預設 false
  if (!dailyId) return false;

  return !!get(dailyId)?.completedAt;
}

type MissionProps = {
  parentNode: RefObject<HTMLDivElement | null>;
  onClose?: () => void;
  isAuth?: boolean;
}

const Mission: React.FC<MissionProps> = ({ parentNode, onClose, isAuth }) => {

  const { t } = useTranslation();
  const { isMobile } = useMobile();

  const [open, setOpen] = useState<boolean>(true);

  const { missions, refetch } = useMission();

  useEffect(() => {
    if (isAuth) refetch();
  }, [isAuth]);

  return (
    <div className="absolute top-[2%] md:top-[2%] left-2 md:left-4 z-30 font-RobotoRegular">
      {/* 按鈕 */}
      <button
        className="flex flex-col gap-2 justify-center items-center shadow-blue-200  rounded-lg border border-white text-white px-2 py-2 font-semibold shadow hover:bg-gray-600 transition cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Goal />
      </button>

      {/* 彈跳視窗 */}
      {open && createPortal(
        <DialogTemplate
          open={open}
          setOpen={setOpen}
          className={cn(isMobile ? "" : "w-auto max-w-[50vw]")}
          zIndex={100}
          onClose={onClose}
        >
          {/* 標題 */}
          <h2 className="text-2xl lg:text-3xl text-glow text-[#C1BCFA] mb-4">{t("r2.map.mission.title")}</h2>
          <p>{t("r2.map.mission.sub_title")}</p>

          {/* 表格內容 */}
          <div className="mt-6 border-[#C1BCFA] shadow-[0_0_12px_4px_rgba(193,170,250,0.6)]">
            {missionList.map((mission, index) => (
              <div key={mission.id} className={cn(
                "flex gap-2 justify-between items-center my-2 border-b-4 border-[rgba(193,170,250,0.6)] last:border-none",
                isMobile && "relative overflow-hidden flex-row-reverse py-2",
              )}> 
                {/* 圖片 */}
                <img src={mission.img} alt="test" className={cn(
                  "p-2",
                  isMobile ? "absolute top-1/2 right-0 -translate-y-1/2 p-0 opacity-40" : "",
                )} />
                
                {/* 文字區 */}
                <div className="flex-1 flex gap-2 items-center">
                  { !isMobile && <p className="text-2xl px-4">{index + 1}</p>}
                  <div>
                    <h3 className="text-glow text-[#C1BCFA]">
                      {isMobile && <span>{index + 1}. </span>}
                      {t(mission.title)}
                    </h3>
                    <p>{t(mission.description)}</p>
                  </div>
                </div>

                {/* 假 Check box */}
                <div className="flex flex-col items-center mx-4">
                  {mission.id === "secretMission" && <p>
                    {missions.get(mission.ruleIds[0])?.progress ?? 0} / 3
                  </p>}
                  {getCurrentState(mission.ruleIds, missions)
                    ? <img src="./elements/r2/mission/checked.png" alt="checked" className={cn("w-14 h-14", isMobile && "w-10 h-10")} />
                    : <img src="./elements/r2/mission/uncheck.png" alt="uncheck" className={cn("w-14 h-14", isMobile && "w-10 h-10")} />}
                </div>
              </div>
            ))}
          </div>

          {/* 按鈕 */}
          <Button
            size="lg"
            className="botton-background-gradient text-black cursor-pointer w-full mt-12"
            onClick={() => {
              setOpen(false);

              onClose && onClose();
            }}
          >
            {t("r2.map.mission.close_button")}
          </Button>

        </DialogTemplate>,
        parentNode && typeof parentNode !== "string" && parentNode.current
          ? parentNode.current
          : document.body
      )}
    </div>
  );
}

export default Mission;