import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useSupportsHEVCAlpha } from "@/hooks/useSupportsHEVCAlpha";
import { Button } from "./ui/button";
import { Info, Play, Pause, CirclePlus } from "lucide-react";
import questionsData from "@/utils/Questions.json";
import QuestionDialog from "./QuestionDialog";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { Map } from "lucide-react";


type RollerPageProps = {
  onClose: () => void;
};

interface QuestionResult {
  questionName: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer?: string;
}

const RollerPage = ({ onClose }: RollerPageProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const supportsHEVCAlpha = useSupportsHEVCAlpha();
  const [showHint, setShowHint] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [allowCardClick, setAllowCardClick] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [isFrameOver260, setIsFrameOver260] = useState(false);
  const [hasTriggeredQuestion, setHasTriggeredQuestion] = useState(false);
  const [hasEarnedFirstTest, setHasEarnedFirstTest] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [flipDirection, setFlipDirection] = useState<{
    [key: number]: "left" | "right";
  }>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isProcessingPlayback, setIsProcessingPlayback] =
    useState<boolean>(false);
  const { userData } = useAuth();
  const userId = userData?.userId;
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackListenerRef = useRef<(() => void) | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { t } = useTranslation();

  // dev=12 , prod=14
  useEffect(() => {
    if (userId) {
      authService.hasEarned(userId, 13).then((data: any) => {
        console.log(data);
        setHasEarnedFirstTest(data.hasEarned);
      });
    }
  }, []);

  let addSec1 = 0;
  const content = [
    // card1
    {
      startSec: 0,
      endSec: 0.43 + addSec1,
      layer1: {
        years: t("r1.roller.card.card1.layer1.years"),
        model: t("r1.roller.card.card1.layer1.model"),
        Milestones: t("r1.roller.card.card1.layer1.Milestones"),
        title: t("r1.roller.card.card1.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card1.layer2"),
        model_img: "1996.png",
        award: [],
      },
      position: { top: "15%", left: "5%" },
    },
    // card2
    {
      startSec: 1.08,
      endSec: 1.48 + addSec1,
      layer1: {
        years: t("r1.roller.card.card2.layer1.years"),
        model: t("r1.roller.card.card2.layer1.model"),
        Milestones: t("r1.roller.card.card2.layer1.Milestones"),
        title: t("r1.roller.card.card2.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card2.layer2"),
        model_img: "1998.png",
        award: [],
      },
      position: { bottom: "15%", left: "10%" },
    },
    // card3
    {
      startSec: 1.5,
      endSec: 1.9 + addSec1,
      layer1: {
        years: t("r1.roller.card.card3.layer1.years"),
        model: t("r1.roller.card.card3.layer1.model"),
        Milestones: t("r1.roller.card.card3.layer1.Milestones"),
        title: t("r1.roller.card.card3.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card3.layer2"),
        model_img: "2002.png",
        award: [],
      },
      position: { top: "15%", left: "25%" },
    },
    // card4
    {
      startSec: 1.92,
      endSec: 2.32 + addSec1,
      layer1: {
        years: t("r1.roller.card.card4.layer1.years"),
        model: t("r1.roller.card.card4.layer1.model"),
        Milestones: t("r1.roller.card.card4.layer1.Milestones"),
        title: t("r1.roller.card.card4.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card4.layer2"),
        model_img: "2005.png",
        award: [],
      },
      position: { top: "27%", left: "25%" },
    },
    // card5
    {
      startSec: 2.33,
      endSec: 2.73 + addSec1,
      layer1: {
        years: t("r1.roller.card.card5.layer1.years"),
        model: t("r1.roller.card.card5.layer1.model"),
        Milestones: t("r1.roller.card.card5.layer1.Milestones"),
        title: t("r1.roller.card.card5.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card5.layer2"),
        model_img: "2007.png",
        award: [],
      },
      position: { top: "20%", left: "21%" },
    },
    // card6
    {
      startSec: 2.75,
      endSec: 3.15 + addSec1,
      layer1: {
        years: t("r1.roller.card.card6.layer1.years"),
        model: t("r1.roller.card.card6.layer1.model"),
        Milestones: t("r1.roller.card.card6.layer1.Milestones"),
        title: t("r1.roller.card.card6.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card6.layer2"),
        model_img: "2007-2.png",
        award: [],
      },
      position: { bottom: "16%", left: "25%" },
    },
    // card7
    {
      startSec: 3.17,
      endSec: 3.57 + addSec1,
      layer1: {
        years: t("r1.roller.card.card7.layer1.years"),
        model: t("r1.roller.card.card7.layer1.model"),
        Milestones: t("r1.roller.card.card7.layer1.Milestones"),
        title: t("r1.roller.card.card7.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card7.layer2"),
        model_img: "2008.png",
        award: [],
      },
      position: { top: "20%", left: "21%" },
    },
    // card8
    {
      startSec: 3.58,
      endSec: 3.98 + addSec1,
      layer1: {
        years: t("r1.roller.card.card8.layer1.years"),
        model: t("r1.roller.card.card8.layer1.model"),
        Milestones: t("r1.roller.card.card8.layer1.Milestones"),
        title: t("r1.roller.card.card8.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card8.layer2"),
        model_img: "2008-2.png",
        award: [],
      },
      position: { top: "22%", left: "30%" },
    },
    // card9
    {
      startSec: 4.0,
      endSec: 4.4 + addSec1,
      layer1: {
        years: t("r1.roller.card.card9.layer1.years"),
        model: t("r1.roller.card.card9.layer1.model"),
        Milestones: t("r1.roller.card.card9.layer1.Milestones"),
        title: t("r1.roller.card.card9.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card9.layer2"),
        model_img: "2009.png",
        award: [],
      },
      position: { top: "10%", left: "20%" },
    },
    // card10
    {
      startSec: 4.42,
      endSec: 4.82 + addSec1,
      layer1: {
        years: t("r1.roller.card.card10.layer1.years"),
        model: t("r1.roller.card.card10.layer1.model"),
        Milestones: t("r1.roller.card.card10.layer1.Milestones"),
        title: t("r1.roller.card.card10.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card10.layer2"),
        model_img: "2009-2.png",
        award: [],
      },
      position: { top: "20%", left: "25%" },
    },
    // card11
    {
      startSec: 4.83,
      endSec: 5.23 + addSec1,
      layer1: {
        years: t("r1.roller.card.card11.layer1.years"),
        model: t("r1.roller.card.card11.layer1.model"),
        Milestones: t("r1.roller.card.card11.layer1.Milestones"),
        title: t("r1.roller.card.card11.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card11.layer2"),
        model_img: "2010.png",
        award: [],
      },
      position: { top: "6%", left: "22%" },
    },
    // card12
    {
      startSec: 5.25,
      endSec: 5.65 + addSec1,
      layer1: {
        years: t("r1.roller.card.card12.layer1.years"),
        model: t("r1.roller.card.card12.layer1.model"),
        Milestones: t("r1.roller.card.card12.layer1.Milestones"),
        title: t("r1.roller.card.card12.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card12.layer2"),
        model_img: "2010-2.png",
        award: [],
      },
      position: { top: "14%", left: "24%" },
    },
    // card13
    {
      startSec: 5.67,
      endSec: 6.07 + addSec1,
      layer1: {
        years: t("r1.roller.card.card13.layer1.years"),
        model: t("r1.roller.card.card13.layer1.model"),
        Milestones: t("r1.roller.card.card13.layer1.Milestones"),
        title: t("r1.roller.card.card13.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card13.layer2"),
        model_img: "2013.png",
        award: [],
      },
      position: { bottom: "20%", left: "23%" },
    },
    // card14
    {
      startSec: 6.08,
      endSec: 6.48 + addSec1,
      layer1: {
        years: t("r1.roller.card.card14.layer1.years"),
        model: t("r1.roller.card.card14.layer1.model"),
        Milestones: t("r1.roller.card.card14.layer1.Milestones"),
        title: t("r1.roller.card.card14.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card14.layer2"),
        model_img: "2013-2.png",
        award: ["2013-2award01.png"],
      },
      position: { top: "6%", left: "26%" },
    },
    // card15
    {
      startSec: 6.5,
      endSec: 6.9 + addSec1,
      layer1: {
        years: t("r1.roller.card.card15.layer1.years"),
        model: t("r1.roller.card.card15.layer1.model"),
        Milestones: t("r1.roller.card.card15.layer1.Milestones"),
        title: t("r1.roller.card.card15.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card15.layer2"),
        model_img: "2014.png",
        award: [],
      },
      position: { top: "12%", left: "23%" },
    },
    // card16
    {
      startSec: 6.92,
      endSec: 7.32 + addSec1,
      layer1: {
        years: t("r1.roller.card.card16.layer1.years"),
        model: t("r1.roller.card.card16.layer1.model"),
        Milestones: t("r1.roller.card.card16.layer1.Milestones"),
        title: t("r1.roller.card.card16.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card16.layer2"),
        model_img: "2014-2.png",
        award: [],
      },
      position: { top: "6%", left: "23%" },
    },
    // card17
    {
      startSec: 7.33,
      endSec: 7.73 + addSec1,
      layer1: {
        years: t("r1.roller.card.card17.layer1.years"),
        model: t("r1.roller.card.card17.layer1.model"),
        Milestones: t("r1.roller.card.card17.layer1.Milestones"),
        title: t("r1.roller.card.card17.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card17.layer2"),
        model_img: "2015.png",
        award_title: "Total of 4368 awards winning in 2015",
        award: [],
      },
      position: { top: "23%", left: "23%" },
    },
    // card18
    {
      startSec: 7.75,
      endSec: 8.15 + addSec1,
      layer1: {
        years: t("r1.roller.card.card18.layer1.years"),
        model: t("r1.roller.card.card18.layer1.model"),
        Milestones: t("r1.roller.card.card18.layer1.Milestones"),
        title: t("r1.roller.card.card18.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card18.layer2"),
        model_img: "2016.png",
        award: [],
      },
      position: { top: "7%", left: "25%" },
    },
    // card19
    {
      startSec: 8.17,
      endSec: 8.57 + addSec1,
      layer1: {
        years: t("r1.roller.card.card19.layer1.years"),
        model: t("r1.roller.card.card19.layer1.model"),
        Milestones: t("r1.roller.card.card19.layer1.Milestones"),
        title: t("r1.roller.card.card19.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card19.layer2"),
        model_img: "2018.png",
        award: ["reddotwinner2018.jpg"],
      },
      position: { top: "23%", left: "23%" },
    },
    // card20
    {
      startSec: 8.58,
      endSec: 8.98 + addSec1,
      layer1: {
        years: t("r1.roller.card.card20.layer1.years"),
        model: t("r1.roller.card.card20.layer1.model"),
        Milestones: t("r1.roller.card.card20.layer1.Milestones"),
        title: t("r1.roller.card.card20.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card20.layer2"),
        model_img: "2019.png",
        award: "",
      },
      position: { bottom: "22%", left: "25%" },
    },
    // card21
    {
      startSec: 9.0,
      endSec: 9.4 + addSec1,
      layer1: {
        years: t("r1.roller.card.card21.layer1.years"),
        model: t("r1.roller.card.card21.layer1.model"),
        Milestones: t("r1.roller.card.card21.layer1.Milestones"),
        title: t("r1.roller.card.card21.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card21.layer2"),
        model_img: "2020.png",
        award: [],
      },
      position: { top: "6%", left: "29%" },
    },
    // card22
    {
      startSec: 9.42,
      endSec: 9.82 + addSec1,
      layer1: {
        years: t("r1.roller.card.card22.layer1.years"),
        model: t("r1.roller.card.card22.layer1.model"),
        Milestones: t("r1.roller.card.card22.layer1.Milestones"),
        title: t("r1.roller.card.card22.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card22.layer2"),
        model_img: "2021.png",
        award: [],
      },
      position: { top: "20%", left: "29%" },
    },
    // card23
    {
      startSec: 9.83,
      endSec: 10.23 + addSec1,
      layer1: {
        years: t("r1.roller.card.card23.layer1.years"),
        model: t("r1.roller.card.card23.layer1.model"),
        Milestones: t("r1.roller.card.card23.layer1.Milestones"),
        title: t("r1.roller.card.card23.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card23.layer2"),
        model_img: "2023.png",
        award: [
          "2023award01.jpg",
          "2023award01.jpg",
          "2023award02.png",
          "2023award03.png",
          "2023award04.png",
        ],
      },
      position: { top: "10%", left: "25%" },
    },
    // card24
    {
      startSec: 10.25,
      endSec: 10.65 + addSec1,
      layer1: {
        years: t("r1.roller.card.card24.layer1.years"),
        model: t("r1.roller.card.card24.layer1.model"),
        Milestones: t("r1.roller.card.card24.layer1.Milestones"),
        title: t("r1.roller.card.card24.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card24.layer2"),
        model_img: "2023-2.png",
        award: ["2023-2award01.png"],
      },
      position: { top: "6%", left: "23%" },
    },
    // card25
    {
      startSec: 10.67,
      endSec: 11.07 + addSec1,
      layer1: {
        years: t("r1.roller.card.card25.layer1.years"),
        model: t("r1.roller.card.card25.layer1.model"),
        Milestones: t("r1.roller.card.card25.layer1.Milestones"),
        title: t("r1.roller.card.card25.layer1.title"),
      },
      layer2: {
        title: t("r1.roller.card.card25.layer2"),
        model_img: "2025.png",
        award: ["2025award01.png"],
      },
      position: { top: "22%", left: "25%" },
    },
  ];
  // const [touchStartY, setTouchStartY] = useState<number | null>(null);
  // const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  // const [lastWheelTime, setLastWheelTime] = useState<number>(0);
  // const [isWheelProcessing, setIsWheelProcessing] = useState<boolean>(false);
  // const [lastTouchTime, setLastTouchTime] = useState<number>(0);

  // const handleTouchStart = (e: React.TouchEvent) => {
  //   setTouchStartY(e.touches[0].clientY);
  //   setTouchStartTime(Date.now());
  // };

  const handleHintToggle = () => {
    if (showHint) setShowHint(false);
    else setShowHint(true);
  };

  // const handleTouchEnd = (e: React.TouchEvent) => {
  //   if (touchStartY === null || touchStartTime === null) return;

  //   const currentY = e.changedTouches[0].clientY;
  //   const deltaY = touchStartY - currentY;
  //   const deltaTime = Date.now() - touchStartTime;

  //   // 如果滑動距離足夠大且時間合理，才觸發滾動
  //   if (Math.abs(deltaY) > 50 && deltaTime > 100) {
  //     // 防止重複觸發
  //     e.preventDefault();

  //     // 防抖機制：如果距離上次觸控時間太短，直接返回
  //     const now = Date.now();
  //     if (now - lastTouchTime < 800) {
  //       return;
  //     }
  //     setLastTouchTime(now);

  //     // 如果正在處理滾動，直接返回
  //     if (isWheelProcessing) {
  //       return;
  //     }

  //     // 滾動時暫時禁用卡片點擊
  //     setAllowCardClick(false);
  //     setIsWheelProcessing(true);

  //     if (videoRef.current) {
  //       const dir = deltaY > 0 ? 1 : -1; // 向上滑動 = 向前，向下滑動 = 向後

  //       // 直接根據滑動方向決定播放
  //       if (dir > 0) {
  //         // 向下滑動：播放下一張卡片
  //         const nextCardIndex = Math.min(content.length - 1, 1); // 簡單地播放第二張卡片
  //         const targetCard = content[nextCardIndex];
  //         const targetStartSec = targetCard.startSec;
  //         const startTime = content[0].startSec; // 從第一張卡片開始

  //         console.log(`觸控滑動: 播放下一張卡片 ${nextCardIndex}`);
  //         console.log(`目標開始時間: ${targetStartSec}s`);

  //         // 從當前位置播放到目標位置
  //         videoRef.current.currentTime = startTime;
  //         videoRef.current.play();

  //         // 監聽播放進度，當到達目標時間時停止
  //         const checkTargetTime = () => {
  //           if (videoRef.current) {
  //             const currentTime = videoRef.current.currentTime;

  //             if (currentTime >= targetStartSec) {
  //               console.log(
  //                 `從 ${startTime}s 播放到 ${targetStartSec}s，停止播放`
  //               );
  //               videoRef.current.pause();
  //               setCurrentFrame(Math.round(targetStartSec * 60)); // 轉換為幀數
  //               setIsWheelProcessing(false);
  //               setAllowCardClick(true);
  //               videoRef.current.removeEventListener(
  //                 "timeupdate",
  //                 checkTargetTime
  //               );
  //             }
  //           }
  //         };
  //         videoRef.current.addEventListener("timeupdate", checkTargetTime);
  //       } else {
  //         // 向上滑動：播放上一張卡片
  //         const prevCardIndex = Math.max(0, 0); // 簡單地播放第一張卡片
  //         const targetCard = content[prevCardIndex];
  //         const targetStartSec = targetCard.startSec;
  //         // const startTime = content[1].startSec; // 從第二張卡片開始

  //         console.log(`觸控滑動: 播放上一張卡片 ${prevCardIndex}`);
  //         console.log(`目標開始時間: ${targetStartSec}s`);

  //         // 倒播放到目標位置
  //         const currentTime = videoRef.current.currentTime;

  //         console.log(
  //           `開始倒播放: 從時間 ${currentTime}s 到時間 ${targetStartSec}s`
  //         );

  //         // 使用 setInterval 模擬倒播放
  //         const reverseInterval = setInterval(() => {
  //           if (videoRef.current) {
  //             const currentTime = videoRef.current.currentTime;

  //             console.log(
  //               `倒播放中: 當前時間 ${currentTime}s, 目標時間 ${targetStartSec}s`
  //             );

  //             // 每次減少 0.016 秒（約 1 幀）
  //             const newTime = Math.max(0, currentTime - 0.016);
  //             videoRef.current.currentTime = newTime;

  //             if (newTime <= 0 || currentTime <= targetStartSec) {
  //               console.log(`倒播放到達目標時間 ${targetStartSec}s，停止播放`);
  //               videoRef.current.pause();
  //               setCurrentFrame(Math.round(targetStartSec * 60)); // 轉換為幀數
  //               setIsWheelProcessing(false);
  //               setAllowCardClick(true);
  //               clearInterval(reverseInterval);
  //             }
  //           }
  //         }, 16); // 約 60fps 的更新頻率

  //         // 安全機制：如果 3 秒後還沒完成倒播放，強制停止
  //         setTimeout(() => {
  //           clearInterval(reverseInterval);
  //           if (videoRef.current) {
  //             videoRef.current.pause();
  //             setCurrentFrame(Math.round(targetStartSec * 60)); // 轉換為幀數
  //             setIsWheelProcessing(false);
  //             setAllowCardClick(true);
  //           }
  //         }, 3000);
  //       }
  //     }

  //     // 重置觸控狀態
  //     setTouchStartY(null);
  //     setTouchStartTime(null);
  //   }
  // };
  // const handleWheel = (e: React.WheelEvent) => {
  //   e.preventDefault();
  //   if (isWheelProcessing) return;

  //   const now = Date.now();
  //   if (now - lastWheelTime < 500) return;
  //   setLastWheelTime(now);
  //   setIsWheelProcessing(true);
  //   setAllowCardClick(false);

  //   if (videoRef.current) {
  //     // const fps = 60; // 統一使用 60fps
  //     const dir = e.deltaY > 0 ? 1 : -1;

  //     // 找出當前卡片索引
  //     let currentCardIndex = -1;
  //     for (let i = 0; i < content.length; i++) {
  //       const card = content[i];
  //       const nextCard = content[i + 1];
  //       if (
  //         videoRef.current.currentTime >= card.startSec &&
  //         (!nextCard || videoRef.current.currentTime < nextCard.startSec)
  //       ) {
  //         currentCardIndex = i;
  //         break;
  //       }
  //     }
  //     if (currentCardIndex === -1) {
  //       if (videoRef.current.currentTime < content[0].startSec)
  //         currentCardIndex = 0;
  //       else if (
  //         videoRef.current.currentTime >= content[content.length - 1].startSec
  //       )
  //         currentCardIndex = content.length - 1;
  //       else {
  //         for (let i = 0; i < content.length; i++) {
  //           if (videoRef.current.currentTime >= content[i].startSec)
  //             currentCardIndex = i;
  //           else break;
  //         }
  //       }
  //     }

  //     // 計算目標卡片索引
  //     let targetCardIndex;
  //     if (dir > 0) {
  //       targetCardIndex = Math.min(currentCardIndex + 1, content.length - 1);
  //     } else {
  //       targetCardIndex = Math.max(currentCardIndex - 1, 0);
  //     }

  //     const targetCard = content[targetCardIndex];
  //     const targetStartSec = targetCard.startSec;
  //     const targetEndSec = targetCard.endSec;

  //     console.log(
  //       `滾輪事件: 從卡片 ${currentCardIndex} 到卡片 ${targetCardIndex}`
  //     );
  //     console.log(
  //       `目標開始時間: ${targetStartSec}s, 目標結束時間: ${targetEndSec}s`
  //     );

  //     // 根據滾動方向決定播放方式
  //     if (dir > 0) {
  //       // 向下滾動：從當前位置播放到目標位置
  //       const startTime = content[currentCardIndex].startSec; // 出發點
  //       const endTime = targetStartSec; // 目標點（停止位置）

  //       videoRef.current.currentTime = startTime;
  //       videoRef.current.play();

  //       // 監聽播放進度，當到達目標時間時停止
  //       const checkTargetTime = () => {
  //         if (videoRef.current) {
  //           const currentTime = videoRef.current.currentTime;

  //           if (currentTime >= endTime) {
  //             console.log(`從 ${startTime}s 播放到 ${endTime}s，停止播放`);
  //             videoRef.current.pause();
  //             setCurrentFrame(Math.round(endTime * 60)); // 轉換為幀數
  //             setIsWheelProcessing(false);
  //             setAllowCardClick(true);
  //             videoRef.current.removeEventListener(
  //               "timeupdate",
  //               checkTargetTime
  //             );
  //           }
  //         }
  //       };
  //       videoRef.current.addEventListener("timeupdate", checkTargetTime);
  //     } else {
  //       // 向上滾動：倒播放到目標位置
  //       const currentTime = videoRef.current.currentTime;

  //       console.log(
  //         `開始倒播放: 從時間 ${currentTime}s 到時間 ${targetStartSec}s`
  //       );

  //       // 使用 setInterval 模擬倒播放
  //       const reverseInterval = setInterval(() => {
  //         if (videoRef.current) {
  //           const currentTime = videoRef.current.currentTime;

  //           console.log(
  //             `倒播放中: 當前時間 ${currentTime}s, 目標時間 ${targetStartSec}s`
  //           );

  //           // 每次減少 0.016 秒（約 1 幀）
  //           const newTime = Math.max(0, currentTime - 0.016);
  //           videoRef.current.currentTime = newTime;

  //           if (newTime <= 0 || currentTime <= targetStartSec) {
  //             console.log(`倒播放到達目標時間 ${targetStartSec}s，停止播放`);
  //             videoRef.current.pause();
  //             setCurrentFrame(Math.round(targetStartSec * 60)); // 轉換為幀數
  //             setIsWheelProcessing(false);
  //             setAllowCardClick(true);
  //             clearInterval(reverseInterval);
  //           }
  //         }
  //       }, 16); // 約 60fps 的更新頻率

  //       // 安全機制：如果 3 秒後還沒完成倒播放，強制停止
  //       setTimeout(() => {
  //         clearInterval(reverseInterval);
  //         if (videoRef.current) {
  //           videoRef.current.pause();
  //           setCurrentFrame(Math.round(targetStartSec * 60)); // 轉換為幀數
  //           setIsWheelProcessing(false);
  //           setAllowCardClick(true);
  //         }
  //       }, 3000);
  //     }
  //   }
  // };

  // 找出目前應該顯示到第幾張卡片

  useEffect(() => {
    if (currentFrame >= 640 && !hasTriggeredQuestion) {
      setIsFrameOver260(true);
      setHasTriggeredQuestion(true);
      setShowQuestion(true);
    } else if (currentFrame >= 640) {
      setIsFrameOver260(true);
    } else if (currentFrame < 640) {
      setIsFrameOver260(false);
    }
  }, [currentFrame, hasTriggeredQuestion]);

  // 計算每張卡片的顯示狀態
  const cardStates = content.map((item) => {
    const currentTime = currentFrame / 60; // 將幀數轉換為時間（秒）

    // 還沒到出現時間
    if (currentTime < item.startSec) {
      return { show: false, fade: 0 };
    }

    // 有 endSec 且已經超過消失時間
    if (item.endSec && currentTime >= item.endSec) {
      return { show: false, fade: 0 };
    }

    // 在時間範圍內，顯示卡片
    // 確保卡片有足夠的顯示時間，即使滑動很快
    const displayDuration = item.endSec - item.startSec;
    const minDisplayTime = 0.167; // 最少顯示 10 幀（10/60 秒）

    if (displayDuration < minDisplayTime) {
      // 如果原本顯示時間太短，延長顯示時間
      const extendedEndSec = item.startSec + minDisplayTime;
      if (currentTime <= extendedEndSec) {
        return { show: true, fade: 1 };
      }
    }

    return { show: true, fade: 1 };
  });

  const fps = 60; // 統一使用 60fps

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      // 使用更精確的計算方式，避免捨入誤差
      const newFrame = Math.round(video.currentTime * fps);
      console.log(
        "影片時間更新:",
        video.currentTime,
        "新幀數:",
        newFrame,
        "舊幀數:",
        currentFrame
      );
      setCurrentFrame(newFrame);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [fps]);

  // 隨機抽取三個題目
  useEffect(() => {
    const shuffleArray = (array: any[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // 分離 A 和 B 題目
    const aQuestions = questionsData.filter((q) => q.name.startsWith("A"));
    const bQuestions = questionsData.filter((q) => q.name.startsWith("B"));

    // 隨機抽取兩題 A 題目
    const shuffledAQuestions = shuffleArray(aQuestions);
    const selectedAQuestions = shuffledAQuestions
      .slice(0, 2)
      .map((q) => q.name);

    // 隨機抽取一題 B 題目
    const shuffledBQuestions = shuffleArray(bQuestions);
    const selectedBQuestions = shuffledBQuestions
      .slice(0, 1)
      .map((q) => q.name);

    // 合併並再次隨機排序
    const allSelectedQuestions = [...selectedAQuestions, ...selectedBQuestions];
    const finalQuestions = shuffleArray(allSelectedQuestions);

    if (finalQuestions.length === 3) {
      setSelectedQuestions(finalQuestions);
      console.log("抽取的題目:", finalQuestions);
      console.log("A 題目:", selectedAQuestions);
      console.log("B 題目:", selectedBQuestions);
    } else {
      console.error("抽取的題目數量不足:", finalQuestions);
    }
  }, []);

  // 處理題目完成
  const handleQuestionComplete = (results: QuestionResult[]) => {
    console.log("題目完成結果:", results);

    // 計算正確答案數量
    // const correctCount = results.filter((result) => result.isCorrect).length;
    // const totalQuestions = results.length;

    // 顯示結果摘要
    // TODO: 這裡可以發送結果到後端 API 進行積分計算
    // 例如：submitResults(results);
  };

  // 重新抽取題目
  const handleRetryQuestions = () => {
    const shuffleArray = (array: any[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // 分離 A 和 B 題目
    const aQuestions = questionsData.filter((q) => q.name.startsWith("A"));
    const bQuestions = questionsData.filter((q) => q.name.startsWith("B"));

    // 隨機抽取兩題 A 題目
    const shuffledAQuestions = shuffleArray(aQuestions);
    const selectedAQuestions = shuffledAQuestions
      .slice(0, 2)
      .map((q) => q.name);

    // 隨機抽取一題 B 題目
    const shuffledBQuestions = shuffleArray(bQuestions);
    const selectedBQuestions = shuffledBQuestions
      .slice(0, 1)
      .map((q) => q.name);

    // 合併並再次隨機排序
    const allSelectedQuestions = [...selectedAQuestions, ...selectedBQuestions];
    const finalQuestions = shuffleArray(allSelectedQuestions);

    if (finalQuestions.length === 3) {
      setSelectedQuestions(finalQuestions);
      console.log("重新抽取的題目:", finalQuestions);
      console.log("A 題目:", selectedAQuestions);
      console.log("B 題目:", selectedBQuestions);
    } else {
      console.error("重新抽取的題目數量不足:", finalQuestions);
    }
  };
  useEffect(() => {
    // 彈窗開啟時禁止 body 滾動 先向下滾 smooth 84px
    // 在手機上使用 setTimeout 確保滾動正常執行
    const scrollToTop = () => {
      window.scrollTo({ top: 84, behavior: "smooth" });
    };

    // 在手機上延遲執行滾動，確保頁面完全載入
    if (window.innerWidth < 780) {
      setTimeout(scrollToTop, 100);
    } else {
      scrollToTop();
    }

    document.body.style.overflow = "hidden";
    return () => {
      // 彈窗關閉時恢復
      document.body.style.overflow = "";
    };
  }, []);

  function clearAllPlayback() {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }
    if (videoRef.current && playbackListenerRef.current) {
      videoRef.current.removeEventListener(
        "timeupdate",
        playbackListenerRef.current
      );
      playbackListenerRef.current = null;
    }
    setIsProcessingPlayback(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className="bg-black/70 text-white absolute top-0 left-0 w-full h-[100dvh] z-50 flex flex-col items-center justify-center"
      // 暫時取消觸控和滾輪播放功能
      // onWheel={handleWheel}
      // onTouchStart={handleTouchStart}
      // onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-[4%] right-4    text-white z-50 flex items-center gap-4">
        {isFrameOver260 && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Button onClick={() => setShowQuestion(true)}>
              Answer Questions
            </Button>
          </motion.div>
        )}
        <button onClick={handleHintToggle} className=" cursor-pointer">
          <Info size={20} />
        </button>
        <Button onClick={onClose} className="cursor-pointer"><Map /></Button>
      </div>

      {/* 題目回答對話框 */}
      <QuestionDialog
        isOpen={showQuestion}
        onClose={() => setShowQuestion(false)}
        selectedQuestions={selectedQuestions}
        onComplete={handleQuestionComplete}
        onRetry={handleRetryQuestions}
        hasEarnedFirstTest={hasEarnedFirstTest}
      />

      {showHint && (
        <div className="absolute inset-0 bg-black/60 z-50 flex  items-center justify-center">
          <div
            className="px-6 py-12 flex flex-col items-center justify-center relative w-full max-w-3xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            style={{
              background:
                "linear-gradient(65deg,rgba(20, 156, 255, .5) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .5) 100%)",
            }}
          >
            <div className="text-[#C1BCFA] drop-shadow-[0_0_15px_#C1BCFA] text-4xl font-bold mb-4 font-TTNormsProMedium">
              {t("r1.roller.title")}
            </div>
            <div className="text-white text-base text-center">
              <Trans i18nKey="r1.roller.card_title" components={{ br: <br /> }} />
              <br />
              <br />
              {t("r1.roller.remark")}
            </div>
            <Button
              className="px-12 py-2 bg-gradient-to-r   from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black mt-4 cursor-pointer "
              onClick={handleHintToggle}
            >
              {t("r1.roller.start_button")}
            </Button>
          </div>
        </div>
      )}

      {/* layer card */}
      <AnimatePresence mode="wait">
        {cardStates.map(
          (state, index) =>
            state.show && (
              <motion.div
                key={`card-${index}`}
                className="gradient-box !absolute p-6 bg-black/50 z-20 max-w-[250px]  cursor-pointer rounded-3xl "
                style={{
                  ...content[index].position,
                  pointerEvents: allowCardClick ? "auto" : "none",
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  position: "relative",
                  width: "100%",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: state.fade,
                  y: state.fade * 20,
                  rotateY: flippedCards.has(index)
                    ? flipDirection[index] === "left"
                      ? 180
                      : -180
                    : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  rotateY: {
                    duration: 0.8,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (allowCardClick) {
                    // 隨機決定翻轉方向
                    const direction = Math.random() > 0.5 ? "left" : "right";
                    setFlipDirection((prev) => ({
                      ...prev,
                      [index]: direction,
                    }));

                    // 翻轉卡片
                    setFlippedCards((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(index)) {
                        newSet.delete(index);
                      } else {
                        newSet.add(index);
                      }
                      return newSet;
                    });
                  }
                }}
              >
                {/* 正面內容 */}
                {!flippedCards.has(index) ? (
                  <motion.div
                    key={`card-${index}-front`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full   inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="w-full text-[#F59EFF] font-TTNormsProMedium text-4xl border-b border-[#F59EFF] pb-1 drop-shadow-[0_0_9px_#F59EFF]">
                      {content[index].layer1.years}
                    </div>
                    <div className="w-full text-white text-lg mt-2 pb-2">
                      {content[index].layer1.model}
                    </div>
                    <div className="w-full text-lg mb-1 text-[#F59EFF] ">
                      {content[index].layer1.Milestones}
                    </div>
                    <div className="w-full text-base">
                      {content[index].layer1.title}
                    </div>
                    <div className="w-full flex justify-center mt-4">
                      <img
                        src={`./images/0702/rollercard/${content[index].layer2.model_img}`}
                        alt="model_img"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end">
                      <CirclePlus className=" text-white" size={20} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`card-${index}-back`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, rotateY: 180 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-center justify-center"
                    style={{}}
                  >
                    <div className="w-full text-white text-base ">
                      {content[index].layer2.title}
                    </div>
                    {content[index].layer2.award_title && (
                      <div className="w-full t text-lg mt-3  rounded-lg">
                        {content[index].layer2.award_title}
                      </div>
                    )}
                    {Array.isArray(content[index].layer2.award) && (
                      <div className="w-full flex flex-wrap gap-2 mt-2">
                        {content[index].layer2.award.map(
                          (a: string, i: number) => (
                            <img
                              key={i}
                              src={`./images/0702/rollercard/${a}`}
                              alt="award"
                              className={`${
                                content[index].layer2.award.length > 3
                                  ? "max-w-[33%]"
                                  : "max-w-[80%]"
                              } object-contain`}
                            />
                          )
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )
        )}
      </AnimatePresence>

      <div
        className="max-w-md w-full h-full flex flex-col items-center justify-center"
        style={{ pointerEvents: "auto" }}
        // 暫時取消滾輪播放功能
        // onWheel={handleWheel}
      >
        {/* a halfblack background full screnn and start caption say wheel to scroll to broswer content  */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0"></div>

        <video
          ref={videoRef}
          className={`w-full h-full absolute top-0 left-0 object-cover z-0`}
          muted
          playsInline
        >
          {supportsHEVCAlpha ? (
            <source
              src="./elements/rollerpage2/output-1.mov"
              type="video/mp4"
            />
          ) : (
            <source
              src="./elements/rollerpage2/output.webm"
              type="video/webm"
            />
          )}
        </video>
      </div>

      <div className="absolute bottom-[9%] z-20 flex  items-center justify-center w-full gap-3 ">
        {/* 播放/暫停按鈕 */}
        <button
          className="bg-black/70 rounded-full p-3 shadow-lg hover:bg-black/90 transition hidden "
          onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
              } else {
                videoRef.current.pause();
                setIsPlaying(false);
              }
            }
          }}
          title={isPlaying ? "暫停" : "播放"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
        {/* 重置按鈕 */}

        <div className="flex items-center gap-5 w-[100%] justify-center   ">
          <button
            className="   transition cursor-pointer animate-pulse"
            onClick={() => {
              clearAllPlayback();
              if (videoRef.current && !isProcessingPlayback) {
                setIsProcessingPlayback(true);
                // 找出當前時間對應的卡片索引
                const currentTime = videoRef.current.currentTime;
                let currentCardIndex = -1;
                for (let i = 0; i < content.length; i++) {
                  const card = content[i];
                  const nextCard = content[i + 1];
                  if (
                    currentTime >= card.startSec &&
                    (!nextCard || currentTime < nextCard.startSec)
                  ) {
                    currentCardIndex = i;
                    break;
                  }
                }
                if (currentCardIndex === -1) {
                  if (currentTime < content[0].startSec) {
                    currentCardIndex = 0;
                  } else if (
                    currentTime >= content[content.length - 1].startSec
                  ) {
                    currentCardIndex = content.length - 1;
                  } else {
                    for (let i = 0; i < content.length; i++) {
                      if (currentTime >= content[i].startSec) {
                        currentCardIndex = i;
                      } else {
                        break;
                      }
                    }
                  }
                }
                // 倒播放到上一張卡片
                const prevCardIndex = Math.max(0, currentCardIndex - 1);
                const targetCard = content[prevCardIndex];
                const targetStartSec = targetCard.startSec;
                const reverseInterval = setInterval(() => {
                  if (videoRef.current) {
                    const currentTime = videoRef.current.currentTime;
                    const timeToSubtract = Math.min(
                      0.016,
                      currentTime - targetStartSec
                    );
                    const newTime = Math.max(
                      targetStartSec,
                      currentTime - timeToSubtract
                    );
                    videoRef.current.currentTime = newTime;
                    if (newTime <= targetStartSec) {
                      videoRef.current.pause();
                      setCurrentFrame(Math.round(targetStartSec * 60));
                      clearInterval(reverseInterval);
                      playbackIntervalRef.current = null;
                      setIsProcessingPlayback(false);
                    }
                  }
                }, 16);
                playbackIntervalRef.current = reverseInterval;
                playbackTimeoutRef.current = setTimeout(() => {
                  // 檢查 interval 是否仍有效（避免被新的播放控制覆蓋）
                  if (playbackIntervalRef.current === reverseInterval) {
                    clearInterval(reverseInterval);
                    playbackIntervalRef.current = null;
                    if (videoRef.current) {
                      videoRef.current.pause();
                      if (
                        Math.abs(
                          videoRef.current.currentTime - targetStartSec
                        ) > 0.1
                      ) {
                        videoRef.current.currentTime = targetStartSec;
                      }
                      setCurrentFrame(Math.round(targetStartSec * 60));
                    }
                    setIsProcessingPlayback(false);
                  }
                }, 3000);
              }
            }}
            title="播放上一張卡片"
          >
            <img
              src="./images/0707/L.png"
              alt="play"
              className="max-w-full w-[75px]"
            />
          </button>
          <button
            className="  transition cursor-pointer animate-pulse"
            onClick={() => {
              clearAllPlayback();
              setAllowCardClick(true);
              if (videoRef.current && !isProcessingPlayback) {
                setIsProcessingPlayback(true);

                // 找出當前時間對應的卡片索引
                const currentTime = videoRef.current.currentTime;
                let currentCardIndex = -1;
                for (let i = 0; i < content.length; i++) {
                  const card = content[i];
                  const nextCard = content[i + 1];
                  if (
                    currentTime >= card.startSec &&
                    (!nextCard || currentTime < nextCard.startSec)
                  ) {
                    currentCardIndex = i;
                    break;
                  }
                }
                if (currentCardIndex === -1) {
                  if (currentTime < content[0].startSec) {
                    currentCardIndex = 0;
                  } else if (
                    currentTime >= content[content.length - 1].startSec
                  ) {
                    currentCardIndex = content.length - 1;
                  } else {
                    for (let i = 0; i < content.length; i++) {
                      if (currentTime >= content[i].startSec) {
                        currentCardIndex = i;
                      } else {
                        break;
                      }
                    }
                  }
                }
                // 播放到下一張卡片
                const nextCardIndex = Math.min(
                  content.length - 1,
                  currentCardIndex + 1
                );
                const targetCard = content[nextCardIndex];
                const targetStartSec = targetCard.startSec;
                videoRef.current.play();
                const checkTargetTime = () => {
                  if (videoRef.current) {
                    const currentTime = videoRef.current.currentTime;
                    if (currentTime >= targetStartSec) {
                      videoRef.current.pause();
                      setCurrentFrame(Math.round(targetStartSec * 60));
                      videoRef.current.removeEventListener(
                        "timeupdate",
                        checkTargetTime
                      );
                      playbackListenerRef.current = null;
                      setIsProcessingPlayback(false);
                    }
                  }
                };
                videoRef.current.addEventListener(
                  "timeupdate",
                  checkTargetTime
                );
                playbackListenerRef.current = checkTargetTime;
              }
            }}
            title="播放下一張卡片"
          >
            <img
              src="./images/0707/R.png"
              alt="play"
              className="max-w-full w-[75px]"
            />
          </button>
        </div>
        <button
          className="  transition ml-auto cursor-pointer  absolute right-0  "
          onClick={() => {
            if (videoRef.current) {
              // 跳到第一張卡片的開始時間
              const firstCardStartSec = content[0].startSec;
              videoRef.current.currentTime = firstCardStartSec;
              videoRef.current.pause();
              setCurrentFrame(Math.round(firstCardStartSec * 60));
              console.log(`重置到第一張卡片，時間: ${firstCardStartSec}s`);
            }
          }}
          title="重置到第一張卡片"
        >
          <img
            src="./images/0707/RE.png"
            alt="reset"
            className="max-w-full  w-[75px]"
          />
        </button>
      </div>
    </motion.div>
  );
};

export default RollerPage;
