import React from "react";
import DialogTemplate from "../DialogTemplate";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { refetch } from "@/store/mission";
import { WHEEL_VOTE_POINT_RULE_ID } from "@/types/pointRule";
import { Map } from "lucide-react";


type VotedProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const Voted: React.FC<VotedProps> = ({ open, setOpen }) => {
  const { isMobile } = useMobile();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  // 使用外部傳入的狀態，如果沒有則使用內部狀態
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = setOpen || setInternalOpen;
  const { userData, refreshAuth } = useAuth();
  const [addPoint, setAddPoint] = useState<boolean>(false);

  // 當對話框開啟時執行加點
  React.useEffect(() => {
    if (isOpen) {
      handleAddPoint();
    }
  }, [isOpen]);

  // addPointWheelVote
  const handleAddPoint = async () => {
    if (userData?.userId) {
      const result = await authService.addPointWheelVote(userData.userId);
      if (result.status === "Success") {
        // ------ 投票成功 ------
        // 建立任務紀錄
        await authService.createMissionRecord(WHEEL_VOTE_POINT_RULE_ID);
        // 更新任務清單
        refetch();
        
        setAddPoint(true);
        refreshAuth();
      }
    }
  };

  return (
    <>
      {/* 彈跳視窗內容 */}
      <DialogTemplate
        open={isOpen}
        setOpen={setIsOpen}
        className={cn("gap-4 text-center", isMobile ? "" : "w-auto")}
      >
        {/* Icon */}
        <img src="./images/wheel/video-finished.png" alt="Video Finished" />

        {/* 文字 */}
        <h2 className="text-4xl font-TTNormsProMedium">
          Submitted Successfully
        </h2>
        <p className="text-white text-2xl">
          Come Back tomorrow and get more points!
        </p>
        {addPoint && (
          <p className="text-white text-2xl">
            <span className="">+1 point</span>
          </p>
        )}

        {/* 按鈕群 */}
        <div className={cn("w-full flex gap-4 mt-4", isMobile && "flex-col")}>
          <Button className="buttonn-border-gradient flex-1 cursor-pointer">
            <Map />
          </Button>
          <Button className="botton-background-gradient flex-1 text-black cursor-pointer">
            Vote for another one
          </Button>
        </div>
      </DialogTemplate>
    </>
  );
};

export default Voted;
