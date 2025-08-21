import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { Map } from "lucide-react";

type TicketPageProps = {
  onClose: () => void;
};

const TicketPage: React.FC<TicketPageProps> = ({ onClose }) => {
  const { userData, refreshAuth } = useAuth();
  const [isAddingPoint, setIsAddingPoint] = useState<boolean>(false);
  const [pointAdded, setPointAdded] = useState<boolean>(false);
  // const [pointError, setPointError] = useState<string | null>(null);
  const hasAttemptedAddPoint = useRef<boolean>(false);

  // 組件載入時自動加點
  useEffect(() => {
    console.log("useEffect 觸發:", {
      userId: userData?.userId,
      pointAdded,
      isAddingPoint,
      hasAttempted: hasAttemptedAddPoint.current,
    });

    if (
      userData?.userId &&
      !pointAdded &&
      !isAddingPoint &&
      !hasAttemptedAddPoint.current
    ) {
      console.log("開始執行加點");
      handleAddPoint();
    }
  }, [userData]); // 只依賴 userData，避免無限循環

  const handleAddPoint = async () => {
    // 多重檢查防止重複執行
    if (
      !userData?.userId ||
      pointAdded ||
      isAddingPoint ||
      hasAttemptedAddPoint.current
    ) {
      console.log("加點被阻止:", {
        noUserId: !userData?.userId,
        pointAdded,
        isAddingPoint,
        hasAttempted: hasAttemptedAddPoint.current,
      });
      return;
    }

    // 立即標記為已嘗試，防止重複調用
    hasAttemptedAddPoint.current = true;
    setIsAddingPoint(true);
    // setPointError(null);

    console.log("handleAddPoint 開始執行，userId:", userData.userId);

    try {
      const result = await authService.addPointFirstClick(userData.userId);

      // 檢查 API 回應
      if (result && result.status === "Failed") {
        if (result.message === "不符合得分條件") {
          // 已經加過點了，標記為已加點但不顯示錯誤
          setPointAdded(true);
          console.log("已經加過點了");
        } else {
          // setPointError(result.message || "積分加點失敗");
        }
      } else {
        // 成功加點
        setPointAdded(true);
        refreshAuth();
        console.log("積分加點成功！");
      }
    } catch (error) {
      console.error("積分加點錯誤:", error);
      // setPointError("積分加點失敗，請稍後再試");
    } finally {
      setIsAddingPoint(false);
    }
  };

  const handleDownload = () => {
    // 創建一個隱藏的 a 標籤來下載圖片
    const link = document.createElement("a");
    link.href = "./images/theticket.png";
    link.download = "ASUS_Theme_Park_Ticket.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/70 text-white absolute top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="w-11/12 md:w-10/12 sm:max-w-[625px] backdrop-blur-sm bg-black/50 text-white border border-white/20 py-8 px-4 rounded-3xl"
        style={{
          background:
            "linear-gradient(27deg,rgba(20, 156, 255, .7) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .7) 100%)",
        }}
      >
        <button
          className="absolute top-4 right-4 text-xl text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <div>
          {/* if first login get 5 point else normal msg */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-1/5">
              <motion.img
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                src="./images/getCheck01.png"
                alt="ticket"
                className="w-full h-full"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="text-white text-2xl font-semibold text-center"
            >
              Your ticket is ready
              <br />
              <span className="text-white text-sm font-semibold">
                {isAddingPoint
                  ? "Adding points..."
                  : pointAdded
                  ? ""
                  : "+3 points"}
              </span>
              {/* {pointAdded && (
                <div className="text-green-400 text-xs mt-1">
                  Points added successfully!
                </div>
              )} */}
            </motion.div>
            <div className="w-11/12 my-5">
              <img
                src="./images/theticket.png"
                alt="ticket"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mt-5 w-10/12 mx-auto">
          <button
            className="buttonn-border-gradient  text-black px-10 py-4 rounded-lg w-full   md:w-1/2  hover:brightness-150 transition-all duration-300 "
            onClick={onClose}
          >
            <span className="text-white cursor-pointer"><Map /></span>
          </button>
          <button
            className="w-full md:w-1/2 bg-gradient-to-r from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF]  cursor-pointer   text-black px-10 py-4 rounded-lg  shadow-lg  hover:from-[#39ACFF] hover:to-[#FF70C3] transition"
            onClick={handleDownload}
          >
            <span className="">Download Ticket</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketPage;
