import { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import AsusLogin from "./AsusLogin";
import { useAuth } from "../contexts/AuthContext";
import UserDropdown from "./UserDropdown";
import CustomLanguageDialog from "./CustomLanguageDialog";
import { useSupportsHEVCAlpha, useIsIOS } from "@/hooks/useSupportsHEVCAlpha";
import TicketPage from "./TicketPage";
import RollerPage from "./RollerPage";
import TalkDialog from "./TalkDialog";
import { AnimatePresence, motion } from "motion/react";
import AudioController from "./AudioController";
import { playSound } from "@/utils/sound";
import WheelPage from "./WheelPage";
import VotePage from "./VotePage";
import TermDialog from "./TermDialog";
// import ParkDialog from "./ParkDialog";
import { useAutoShow } from "@/hooks/useAutoShow";
import AsusLogin from "./AsusLogin";
import ParkVideoDialog from "./ParkVideoDialog";
import { t } from "i18next";
import Mission from "./R2/mission/Mission";
import FindCardModal from "./R2/findCard/FindCardModal";
import { useNavigate } from "react-router-dom";
import { randomKolUrl } from "@/utils/randomKolVideo";
import { useCardPosition } from "@/hooks/useCardPosition";
import FoundedCard from "./R2/findCard/FoundedCard";
import FindCardCompleted from "./R2/findCard/FindCardCompleted";
import { useMission } from "@/hooks/useMission";
import { FIND_CARD_POINT_RULE_ID } from "@/types/pointRule";
import BackToHome from "./R2/BackToHome";

// 在組件頂部添加一個常數來定義斷點
const TABLET_BREAKPOINT = 1280; // 平板尺寸的斷點，可以根據需求調整


export default function ThemeParkHome() {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [dialogType, setDialogType] = useState<
  //   null | "zone1" | "zone2" | "zone3" | "zone4" | "zone5"
  // >(null);
  const { isAuthenticated } = useAuth();
  const { missions } = useMission(isAuthenticated);
  const supportsHEVCAlpha = useSupportsHEVCAlpha();
  const isIOS = useIsIOS();
  const [isMobileView, setIsMobileView] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [activePage, setActivePage] = useState<
    null | "ticket" | "roller" | "wheel" | "vote" | "cablecar"
  >(null);
  const [walk1ZIndex, setWalk1ZIndex] = useState(9);
  const [isWalk1Visible, setIsWalk1Visible] = useState(true);
  const walk1VideoRef = useRef<HTMLVideoElement>(null);
  const wheelVideoRef = useRef<HTMLVideoElement>(null);

  // 藏顯卡相關
  const { r1CardPositions } = useCardPosition();
  const [zoneFindCard, setZoneFindCard] = useState<boolean>(false);
  const [showFindCardCompleted, setShowFindCardCompleted] = useState<boolean>(false);
  const isFindCardMissionCompleted = !!missions.get(FIND_CARD_POINT_RULE_ID)?.completedAt;

  const [zone1Talk, setZone1Talk] = useState(false);
  const [zone2Talk, setZone2Talk] = useState(false);
  const [zone3Talk, setZone3Talk] = useState(false);
  const [zone4Talk, setZone4Talk] = useState(false);
  const [zone5Talk, setZone5Talk] = useState(false);
  // const [isOpeningOK, setIsOpeningOK] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [_showPark, setShowPark] = useState(false);

  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // 指引狀態
  type GuideLines = {
    ferrisWheel: boolean,
    rollerCoaster: boolean,
  }
  const [isCheckGuidelines, setIsCheckGuidelines] = useState<GuideLines>({ferrisWheel: false, rollerCoaster: false});

  // 更新指引
  const updateGuideLines = (guidelines: Partial<GuideLines>) =>
    setIsCheckGuidelines((prev) => ({ ...prev, ...guidelines }));

  // park dialog auto open after 10 seconds refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在手機上使用額外的延遲確保滾動正常執行
      const scrollToTop = () => {
        window.scrollTo({ top: 84, behavior: "smooth" });
      };

      if (window.innerWidth < 780) {
        setTimeout(scrollToTop, 100);
      } else {
        scrollToTop();
      }

      setShowPark(true);
      pauseAllVideos();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 使用自動顯示 Hook
  useAutoShow({
    pageKey: "ticket",
    delay: 2000,
    onShow: () => setActivePage("ticket"),
  });

  // 修改 handleVideoLoad 函數
  const handleVideoLoad = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      let scale;
      if (screenWidth <= TABLET_BREAKPOINT) {
        // 在手機/平板時，確保完全覆蓋螢幕
        const scaleX = screenWidth / videoWidth;
        const scaleY = screenHeight / videoHeight;
        scale = Math.max(scaleX, scaleY);
      } else {
        // 桌面版保持原有邏輯，但確保完全覆蓋
        const scaleX = screenWidth / videoWidth;
        const scaleY = screenHeight / videoHeight;
        scale = Math.max(scaleX, scaleY);
      }

      // 計算縮放後的尺寸
      const scaledWidth = videoWidth * scale;
      const scaledHeight = videoHeight * scale;

      setImageSize({
        width: scaledWidth,
        height: scaledHeight,
      });
    }
  };

  // 修改 resize 處理函數
  const handleResize = () => {
    const isMobile = window.innerWidth <= TABLET_BREAKPOINT;
    setIsMobileView(isMobile);

    if (videoRef.current) {
      const video = videoRef.current;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      let scale;
      if (isMobile) {
        // 在手機/平板時，確保完全覆蓋螢幕
        const scaleX = screenWidth / videoWidth;
        const scaleY = screenHeight / videoHeight;
        scale = Math.max(scaleX, scaleY);
      } else {
        // 桌面版保持原有邏輯，但確保完全覆蓋
        const scaleX = screenWidth / videoWidth;
        const scaleY = screenHeight / videoHeight;
        scale = Math.max(scaleX, scaleY);
      }

      setImageSize({
        width: videoWidth * scale,
        height: videoHeight * scale,
      });
    }
  };
  // walk1 影片暫停並隱藏
  const pauseWalk1Video = () => {
    if (walk1VideoRef.current) {
      walk1VideoRef.current.pause();
    }
    setIsWalk1Visible(false);
  };
  // walk1 影片顯示並繼續
  const playWalk1Video = () => {
    if (walk1VideoRef.current) {
      walk1VideoRef.current.play();
    }
    setIsWalk1Visible(true);
  };

  // 處理 walk1 影片播放
  const handleWalk1VideoTimeUpdate = () => {
    if (walk1VideoRef.current) {
      const video = walk1VideoRef.current;
      const currentTime = video.currentTime;
      // console.log(currentTime);
      // 根據播放秒數設定不同的 z-index
      if (currentTime < 0) {
        setWalk1ZIndex(9); // 0-2秒：z-index = 5
      } else if (currentTime > 7 && currentTime < 22) {
        setWalk1ZIndex(8); // 2-4秒：z-index = 15
      } else {
        setWalk1ZIndex(12); // 2-4秒：z-index = 15
      }

      // 檢查是否接近影片結尾（例如最後 0.1 秒）
      if (video.duration - currentTime < 0.1) {
        // 每次播放完成後都跳轉到指定秒數
        video.currentTime = 6.3;
      }
    }
  };

  const handleWalk1VideoEnded = () => {
    if (walk1VideoRef.current) {
      // 每次播放結束後都跳轉到指定秒數並繼續播放
      walk1VideoRef.current.currentTime = 6.3;
      walk1VideoRef.current.play().catch((error) => {
        console.log("Video play failed:", error);
      });
    }
  };

  // 控制影片播放/暫停的函數
  const pauseAllVideos = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (walk1VideoRef.current) {
      walk1VideoRef.current.pause();
    }
    if (wheelVideoRef.current) {
      wheelVideoRef.current.pause();
    }
  };

  const playAllVideos = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Background video play failed:", error);
      });
    }
    if (walk1VideoRef.current) {
      walk1VideoRef.current.play().catch((error) => {
        console.log("Walk1 video play failed:", error);
      });
    }
    if (wheelVideoRef.current) {
      wheelVideoRef.current.play().catch((error) => {
        console.log("Wheel video play failed:", error);
      });
    }
  };

  // 當 activePage 改變時控制影片播放
  useEffect(() => {
    if (activePage) {
      pauseAllVideos();
    } else {
      playAllVideos();
    }
  }, [activePage]);

  // 合併重複的 useEffect
  useEffect(() => {
    // 監聽影片載入完成事件
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", handleVideoLoad);
    }

    // 監聽視窗大小改變
    window.addEventListener("resize", handleResize);

    // 清理事件監聽器
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleVideoLoad);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 手機版自動定位到畫面中間
  useEffect(() => {
    const isMobile = window.innerWidth <= TABLET_BREAKPOINT;
    if (isMobile && imageSize.width > 0 && imageSize.height > 0) {
      // 計算畫面中間位置
      const centerX = -(imageSize.width - window.innerWidth) / 2.65;
      const centerY = -(imageSize.height - window.innerHeight) / 2;

      setScrollPosition({
        x: centerX,
        y: centerY,
      });
    }
  }, [imageSize.width, imageSize.height]);

  // 取得實際要顯示的寬高，確保至少等於螢幕寬高
  const displayWidth = Math.max(imageSize.width, window.innerWidth);
  const displayHeight = Math.max(imageSize.height, window.innerHeight);

  // 處理滑鼠按下
  const handleMouseDown = (e: React.MouseEvent) => {
    // 如果有子頁面開啟，不啟用拖拽
    if (activePage) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - scrollPosition.x,
      y: e.clientY - scrollPosition.y,
    });
  };

  // 處理滑鼠移動
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;
    const maxX = 0;
    const minX = -(displayWidth - window.innerWidth);
    const maxY = 0;
    const minY = -(displayHeight - window.innerHeight);
    const boundedX = Math.min(maxX, Math.max(minX, newX));
    const boundedY = Math.min(maxY, Math.max(minY, newY));
    setScrollPosition({
      x: boundedX,
      y: boundedY,
    });
  };

  // 處理滑鼠放開
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 處理滑鼠離開
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // 處理觸控開始
  const handleTouchStart = (e: React.TouchEvent) => {
    // 如果有子頁面開啟，不啟用拖拽
    if (activePage) {
      return;
    }

    // 檢查是否點擊在按鈕或其他可點擊元素上
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest('[role="button"]')) {
      return; // 如果是連結或其他按鈕，不阻止預設行為
    }

    // 在手機上，檢查是否在對話框內容區域內
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const dialogContent = target.closest(".btn-glow2");
      if (dialogContent) {
        return; // 如果點擊在對話框內容上，不允許拖曳
      }
    }

    // 允許從任何地方開始拖曳，包括隱藏式設施選單區域
    if (e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX - scrollPosition.x,
        y: e.touches[0].clientY - scrollPosition.y,
      });
    }
  };

  // 處理觸控移動
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || e.touches.length !== 1) return;

    // 在手機上，檢查是否在對話框內容區域內
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const target = e.target as HTMLElement;
      const dialogContent = target.closest(".btn-glow2");
      if (dialogContent) {
        return; // 如果在對話框內容內，不允許拖曳
      }
    }

    // 計算拖曳距離
    const deltaX = e.touches[0].clientX - (touchStart.x + scrollPosition.x);
    const deltaY = e.touches[0].clientY - (touchStart.y + scrollPosition.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 如果拖曳距離小於 10px，認為是點擊，不進行拖曳
    if (distance < 10) {
      return;
    }

    // 一旦開始拖曳，就允許地圖拖曳，不管手指在哪個區域
    if (isMobile) {
      try {
        e.preventDefault(); // 防止瀏覽器預設的滾動行為
      } catch (error) {
        // 忽略被動事件監聽器的錯誤
      }
    } else {
      e.preventDefault(); // 桌面版正常阻止預設行為
    }
    e.stopPropagation(); // 防止事件冒泡

    const newX = e.touches[0].clientX - touchStart.x;
    const newY = e.touches[0].clientY - touchStart.y;
    const maxX = 0;
    const minX = -(displayWidth - window.innerWidth);
    const maxY = 0;
    const minY = -(displayHeight - window.innerHeight);
    const boundedX = Math.min(maxX, Math.max(minX, newX));
    const boundedY = Math.min(maxY, Math.max(minY, newY));
    setScrollPosition({
      x: boundedX,
      y: boundedY,
    });
  };

  // 處理觸控結束
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart) {
      // 計算拖曳距離
      const deltaX =
        e.changedTouches[0].clientX - (touchStart.x + scrollPosition.x);
      const deltaY =
        e.changedTouches[0].clientY - (touchStart.y + scrollPosition.y);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 如果拖曳距離小於 10px，認為是點擊
      if (distance < 10) {
        const target = e.target as HTMLElement;
        const buttonElement = target.closest("button");
        if (buttonElement) {
          // 觸發按鈕的點擊事件
          buttonElement.click();
        }
      }

      e.preventDefault();
      e.stopPropagation();
    }
    setTouchStart(null);
  };

  // const handleZoneClick = (
  //   zone: "zone1" | "zone2" | "zone3" | "zone4" | null
  // ) => {
  //   setDialogType(zone);
  //   setIsDialogOpen(true);
  // };
  // const zoneMap = {
  //   zone1: 0,
  //   zone2: 1,
  //   zone3: 2,
  //   zone4: 3,
  //   zone5: 4,
  // };
  const pages = [
    {
      title: "r1.ticket.title",
      subtitle: ["r1.map.after_login_ticket1", "r1.map.after_login_ticket2"],
      link: "/",
      buttonAction: "ticket",
    },
    {
      title: "r1.roller.title",
      subtitle: "r1.map.after_login_roller",
      link: "/",
      buttonAction: "roller",
    },
    {
      title: "r1.wheel.title",
      subtitle: "r1.map.after_login_wheel",
      link: "/",
      buttonAction: "ferris",
    },
    {
      title: "r1.vote.title",
      subtitle_notOpen: "r1.map.after_login_vote_notOpen",
      subtitle: "r1.map.after_login_vote_Open",
      link: "/",
      buttonAction: "vote",
    },
    {
      title: "r1.cable.title",
      subtitle_notOpen: "r1.map.after_login_cable_notOpen",
      subtitle: "r1.map.after_login_cable_Open",
      link: "/",
      buttonAction: "cablecar",
    },
    {},
  ];

  return (
    <div
      ref={containerRef}
      className={`h-screen w-screen overflow-hidden bg-[#232323] font-RobotoRegular ${
        isMobileView ? "" : "cursor-grab active:cursor-grabbing"
      }`}
      style={{
        overscrollBehavior: "none",
        WebkitOverflowScrolling: "touch",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 任務列表 */}
      <Mission
        parentNode={containerRef}
        onClose={() => {
          setShowPark(false);
          playAllVideos();
          
          // 如果登入了，進入遊樂園先點開摩天輪對話視窗，作為指引
          if (isAuthenticated) {
            setZone3Talk(true);
            pauseWalk1Video();
          }
        }}
        isAuth={isAuthenticated}
      />
      <UserDropdown />

      {/* 右上角 - UI 選單 */}
      <div className="absolute top-[1%] right-[6.5%] md:right-[4%] z-40 flex flex-col md:flex-row gap-2 md:gap-6">
        {/* 右上角 - 語言選單 */}
        <CustomLanguageDialog positionStyle="relative top-0 md:top-0 right-0 md:right-44 z-40"/>
        {/* 右上角 - 背景音樂 */}
        <AudioController
          src="./sound/map_bgm.wav"
          activePage={activePage}
          onPageChange={setActivePage}
          defaultMusic="./sound/map_bgm.wav"
        />
        {/* 右上角 - 返回首頁 */}
        <BackToHome />
      </div>

      {/* 藏顯卡 - 完成彈跳視窗 */}
      <FindCardCompleted
        url="https://www.youtube.com/watch?v=haHP5foz8KU"
        open={showFindCardCompleted}
        setOpen={setShowFindCardCompleted}
      />

            
      {/* <LanguageDialog /> */}
      {/* <ParkDialog
        isOpen={showPark}
        onClose={() => {
          setShowPark(false);
          playAllVideos();
          
          // 如果登入了，進入遊樂園先點開摩天輪對話視窗，作為指引
          if (isAuthenticated) {
            setZone3Talk(true);
            pauseWalk1Video();
          }
        }}
      /> */}
      {/* Video Dialog */}
      <ParkVideoDialog
        isOpen={isVideoDialogOpen}
        onClose={() => setIsVideoDialogOpen(false)}
        url={selectedVideo || ""}
      />
      <TermDialog
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => setShowTerms(false)}
      />

      <AnimatePresence mode="wait" initial={false}>
        {activePage === "ticket" && (
          <TicketPage key="ticket" onClose={() => setActivePage(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {activePage === "roller" && (
          <RollerPage key="roller" onClose={() => {
            setActivePage(null)
            // 關閉雲霄飛車自己的對話視窗
            setZone2Talk(false);
            if (!isCheckGuidelines.rollerCoaster) {
              // 開啟摩天輪的對話視窗
              setZone3Talk(true);
            } else {
              playWalk1Video();
            }
          }} />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {activePage === "wheel" && (
          <WheelPage key="wheel" onClose={() => {
            setActivePage(null)
            // 關閉摩天輪自己的對話視窗
            setZone3Talk(false);
            if (!isCheckGuidelines.rollerCoaster) {
              // 開啟雲霄飛車的對話視窗
              setZone2Talk(true);
            }
          }} />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {activePage === "vote" && (
          <VotePage key="vote" onClose={() => setActivePage(null)} />
        )}
      </AnimatePresence>
      <div
        className="relative"
        style={{
          transform: `translate(${scrollPosition.x}px, ${scrollPosition.y}px)`,
          width: displayWidth,
          height: displayHeight,
          minWidth: isMobileView ? undefined : "100vw",
          minHeight: isMobileView ? undefined : "100vh",
          margin: isMobileView ? undefined : "0",
          overflow: isMobileView ? "visible" : "hidden",
        }}
      >
        {/* 底圖 - 在這裡 */}
        <div className={`relative w-full h-full `}>

          {/* 前景圖層 */}
          <div
            className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none"
          >
            <img src="./elements/250612_map_bg/r1-front-layer.png" alt="front-layer" />
          </div>

          {/* 告示牌 */}
          <img
            src="./elements/web_map1_Sign.png"
            alt="graphic_card"
            className="absolute z-10 top-[40%] right-[5%] w-64 h-64"
          />

          {/* 捉迷藏顯卡 */}
          {!isFindCardMissionCompleted && r1CardPositions.map((position, index) => (
            <div
              key={index}
              className="absolute z-10 -rotate-6"
              // Style 動態控制位置
              style={{ top: `${position.top}%`, left: `${position.left}%`}}
            >
              <img
                src="./elements/graphic_card/graphic_card1.png"
                alt="graphic_card"
                className="w-14 h-14"
              />
            </div>
          ))}

          {/* 背景影片 */}
          <video
            ref={videoRef}
            className={`w-full h-full ${
              isMobileView ? "object-cover" : "object-cover"
            } -z-10 ${isAuthenticated ? "opacity-100" : "opacity-50"}`}
            autoPlay
            loop
            muted
            playsInline
            style={{
              pointerEvents: "none",
              width: imageSize.width,
              height: imageSize.height,
            }}
          >
            {supportsHEVCAlpha || isIOS ? (
              <source
                src="./elements/250612_map_bg/output-1.mov"
                type="video/mp4"
              />
            ) : (
              <source
                src="./elements/250612_map_bg/output.webm"
                type="video/webm"
              />
            )}
          </video>
          <video
            ref={wheelVideoRef}
            className={`w-full h-full absolute top-0 left-0  ${
              isMobileView ? "object-cover" : "object-cover"
            } z-10 ${isAuthenticated ? "opacity-100" : "opacity-50"}`}
            autoPlay
            loop
            muted
            playsInline
            style={{
              pointerEvents: "none",
              width: imageSize.width,
              height: imageSize.height,
            }}
          >
            {supportsHEVCAlpha || isIOS ? (
              <source
                src="./elements/250612_map_wheel/output-1.mp4"
                type="video/mp4"
              />
            ) : (
              <source
                src="./elements/250612_map_wheel/output.webm"
                type="video/webm"
              />
            )}
          </video>

          {/* Omni walk1 */}
          {!isAuthenticated && (
            <div
              className="absolute inset-0  z-[9999] "
              style={{
                width: imageSize.width,
                height: imageSize.height,
              }}
            >
              <div className="absolute bottom-[19%] left-[25%] w-[32%]   cursor-pointer bg-amber-500/0  transition-all duration-300 group flex flex-col items-center justify-center ">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.4,
                      delay: 0.8,
                      ease: "easeInOut",
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { duration: 0.2, delay: 0, ease: "easeInOut" },
                  }}
                  className="btn-glow2 w-[100%] bg-gradient-to-r from-[#00000050] via-[#000000] to-[#00000080] text-white border border-white/0 rounded-3xl px-6 py-2"
                >
                  <>
                    <p className=" my-3 text-base text-[#fff]  pb-2 leading-6">
                      {t("r1.map.card_content")}
                    </p>
                    <div className="flex items-start gap-2 mt-4 sm:mt-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer mt-1"
                        checked={isPolicyAccepted}
                        onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                        disabled={isLoginLoading}
                      />
                      <p
                        className={`text-gray-200 hover:text-gray-100 cursor-pointer text-xs sm:text-sm leading-relaxed ${
                          isLoginLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() =>
                          !isLoginLoading &&
                          setIsPolicyAccepted(!isPolicyAccepted)
                        }
                      >
                        <a
                          className={`text-blue-300 cursor-pointer hover:text-blue-400 ${
                            isLoginLoading ? "pointer-events-none" : ""
                          }`}
                          href="https://www.asus.com/terms_of_use_notice_privacy_policy/privacy_policy"
                        >
                          {t("r1.ticket.policy")}
                        </a>
                      </p>
                    </div>
                    {/* I have read and accept the terms and conditions. */}
                    <div className="flex items-start gap-2 mt-4 sm:mt-6">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer mt-1"
                        checked={isTermsAccepted}
                        onChange={(e) => setIsTermsAccepted(e.target.checked)}
                        disabled={isLoginLoading}
                      />
                      <p
                        className={`text-gray-200 hover:text-gray-100 cursor-pointer text-xs sm:text-sm leading-relaxed ${
                          isLoginLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() =>
                          !isLoginLoading &&
                          setIsTermsAccepted(!isTermsAccepted)
                        }
                      >
                        <span
                          className={`text-blue-300 cursor-pointer hover:text-blue-400 ${
                            isLoginLoading ? "pointer-events-none" : ""
                          }`}
                          onClick={() => !isLoginLoading && setShowTerms(true)}
                        >
                          {t("r1.ticket.agree_term")}
                        </span>
                      </p>
                    </div>
                    <AsusLogin
                      className={`mt-4 sm:mt-6 w-full border border-white/60 px-6 sm:px-10 py-2 sm:py-3 rounded-lg shadow-lg mb-2 transition ${
                        isTermsAccepted && isPolicyAccepted && !isLoginLoading
                          ? "bg-gradient-to-r from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black hover:from-[#39ACFF] hover:to-[#FF70C3] cursor-pointer"
                          : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                      }`}
                      disabled={
                        !isTermsAccepted || !isPolicyAccepted || isLoginLoading
                      }
                      onLoginStart={() => setIsLoginLoading(true)}
                    >
                      {isLoginLoading ? "Loading..." : "Log-in"}
                    </AsusLogin>
                  </>
                  {/* <div className="absolute top-[4px] right-[2px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // onClose();
                    }}
                    className="px-2 py-1 text-xs  text-white  transition cursor-pointer"
                  >
                    <X />
                  </button>
                </div> */}
                </motion.div>
                <motion.video
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.4,
                      delay: 0,
                      ease: "easeInOut",
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                    transition: { duration: 0.1, delay: 0, ease: "easeInOut" },
                  }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={` w-[36%]   cursor-pointer bg-amber-500/0  transition-all duration-300 group `}
                >
                  {supportsHEVCAlpha || isIOS ? (
                    <source
                      src={`./elements/omni/talk/output-1.mp4`}
                      type="video/mp4"
                    />
                  ) : (
                    <source
                      src="./elements/omni/talk/output.webm"
                      type="video/webm"
                    />
                  )}
                </motion.video>
              </div>
            </div>
          )}
          {isAuthenticated && (
            <motion.video
              ref={walk1VideoRef}
              className={`w-full h-full absolute top-0 left-0 ${
                isMobileView ? "object-cover" : "object-cover"
              } `}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleWalk1VideoTimeUpdate}
              onEnded={handleWalk1VideoEnded}
              style={{
                pointerEvents: "none",
                width: imageSize.width,
                height: imageSize.height,
                zIndex: walk1ZIndex,
              }}
              initial={{ opacity: 1 }}
              animate={{
                opacity: isWalk1Visible ? (isAuthenticated ? 1 : 0.5) : 0,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {supportsHEVCAlpha || isIOS ? (
                <source
                  src="./elements/omni/walk1/output-1.mov"
                  type="video/mp4"
                />
              ) : (
                <source
                  src="./elements/omni/walk1/output.webm"
                  type="video/webm"
                />
              )}
            </motion.video>
          )}

          {/* 隱藏式設施選單 many block Menu  */}
          <div
            className="absolute inset-0  z-50 "
            style={{
              width: imageSize.width,
              height: imageSize.height,
            }}
          >
            {/* 藏顯卡 - 地標(大門前) */}
            <div
              className={`absolute top-[67%] left-[20%] w-[7%] h-[10%] cursor-pointer z-10  transition-all duration-300 group ${
                zoneFindCard ? "z-20" : "z-0"
              }`}
              onClick={() => {
                if (!zoneFindCard) {
                  playSound("./sound/click_unit.wav");
                }
                setZoneFindCard(true);
              }}
              onTouchStart={() => {
                if (!zoneFindCard) {
                  playSound("./sound/click_unit.wav");
                }
                setZoneFindCard(true);
              }}
            >
              {/* 懸浮指標 */}
              <div
                className={`absolute -top-[60%] left-1/2 -translate-x-1/2 w-[60px]  opacity-0 transition-all duration-1200 float ${
                  zoneFindCard ? " " : "opacity-100"
                }`}
              >
                <img
                  src="./images/maker_yellow.png"
                  alt=""
                  className="max-w-full"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div>
              <FindCardModal open={zoneFindCard} setOpen={setZoneFindCard} parentNode={containerRef} />
            </div>

            {/* 捉迷藏顯卡 - 點擊區塊 */}
            {!isFindCardMissionCompleted && r1CardPositions.map(position => (
              <FoundedCard
                key={position.id}
                id={position.id}
                top={position.top}
                left={position.left}
                openCompletedModal={() => setShowFindCardCompleted(true)}
                parentNode={containerRef}
              />
            ))}

            {/* KOL - 噴水池 */}
            <div
              className={`absolute bottom-[30%] left-[3%] w-[7%] h-[9%] cursor-pointer transition-all duration-300 group z-0`}
              onClick={() => {
                setIsVideoDialogOpen(true);
                setSelectedVideo(randomKolUrl());
              }}
              onTouchStart={() => {
                setIsVideoDialogOpen(true);
                setSelectedVideo(randomKolUrl());
              }}
            >
              <div
                className={`absolute bottom-[10%] left-[80%]  w-[60px]  opacity-0 transition-all duration-1200 ${
                  zone4Talk ? " " : "group-hover:opacity-100 "
                }`}
              >
                <img
                  src="./images/maker_yellow.png"
                  alt=""
                  className="max-w-full float"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div>
            </div>

            {/* 滑水道 */}
            <div
              className={`absolute bottom-[15%] left-[51.6%] w-[15%] h-[18%] cursor-pointer bg-zinc-500/0  transition-all duration-300 group z-0`}
              onClick={() => {
                setIsVideoDialogOpen(true);
                setSelectedVideo(randomKolUrl());
              }}
              onTouchStart={() => {
                setIsVideoDialogOpen(true);
                setSelectedVideo(randomKolUrl());
              }}
            >
              <div
                className={`absolute bottom-[10%] left-[80%] w-[60px]  opacity-0 transition-all duration-1200 ${
                  zone4Talk ? " " : "group-hover:opacity-100 "
                }`}
              >
                <img
                  src="./images/maker_yellow.png"
                  alt=""
                  className="max-w-full float"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div>
            </div>

            {/* 旋轉飛車 */}
            <div
              className={`absolute bottom-[48%] left-[61.6%] w-[10%] h-[18%] cursor-pointer bg-zinc-500/0  transition-all duration-300 group z-0`}
              onClick={() => {
                setIsVideoDialogOpen(true);
                setSelectedVideo(randomKolUrl());
              }}
              onTouchStart={() => {
                setIsVideoDialogOpen(true);
                setSelectedVideo(randomKolUrl());
              }}
            >
              <div
                className={`absolute bottom-[10%] left-[80%]  w-[60px]  opacity-0 transition-all duration-1200 ${
                  zone4Talk ? " " : "group-hover:opacity-100 "
                }`}
              >
                <img
                  src="./images/maker_yellow.png"
                  alt=""
                  className="max-w-full float"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div>
            </div>

            {/* 售票亭 */}
            <button
              className={`absolute bottom-[10%] left-[25.6%] w-[15%] h-[15%] cursor-pointer transition-all duration-300 group ${
                zone1Talk ? "z-20" : "z-0"
              }`}
              onClick={() => {
                if (!zone1Talk) {
                  playSound("./sound/click_unit.wav");
                }
                setZone1Talk(true);
                pauseWalk1Video();
              }}
            >
              {/* <div
                className={`absolute -top-[40%] left-1/2 -translate-x-1/2  w-[45px] opacity-0 transition-all duration-1200 ${
                  zone1Talk ? " " : "group-hover:opacity-100"
                }`}
              >
                <img
                  src="./images/maker.png"
                  alt=""
                  className="max-w-full float "
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div> */}

              {/* 懸浮指標 */}
              <div
                className={`absolute -top-[40%] left-1/2 -translate-x-1/2 w-[60px]  opacity-0 transition-all duration-1200  ${
                  zone3Talk ? " " : "group-hover:opacity-100 "
                }`}
              >
                <img
                  src="./images/maker_yellow.png"
                  alt=""
                  className="max-w-full"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div>
              {zone1Talk && (
                <div className="fixed top-[0%] left-[0%] w-[100%] h-[100%] cursor-pointer bg-amber-500/0 z-10 pointer-events-none sm:pointer-events-auto"></div>
              )}

              <AnimatePresence mode="wait" initial={false}>
                {zone1Talk && (
                  <TalkDialog
                    isOpen={zone1Talk}
                    onClose={() => {
                      setZone1Talk(false);

                      playWalk1Video();
                    }}
                    onAction={() => {
                      setActivePage("ticket");
                    }}
                    title={pages[0].title || ""}
                    // pages[0].subtitle  is array return random one
                    content={pages[0].subtitle || ""}
                    videoSrc="./elements/omni/talk/output.webm"
                    style={{
                      bottom: "50%",
                      left: "56%",
                      transform: "translateX(-50%)",
                      transformOrigin: "bottom",
                      width: "400px",
                      rotate: "0deg",
                      zIndex: 1000,
                    }}
                    boxStyle={{
                      position: "absolute",
                      bottom: "100%",
                    }}
                    isAuthenticated={isAuthenticated}
                    setShowTerms={setShowTerms}
                    loginInfo={false}
                    notOpen={false}
                    parentNode={containerRef}
                  />
                )}
              </AnimatePresence>
            </button>

            {/* 雲霄飛車 */}
            <button
              className={`absolute top-[10%] left-[0%] w-[50%] h-[33%] cursor-pointer z-0 transition-all duration-300 group ${
                zone2Talk ? "z-20" : "z-0"
              }`}
              onClick={() => {
                if (!zone2Talk) {
                  playSound("./sound/click_unit.wav");
                }
                setZone2Talk(true);
                pauseWalk1Video();
              }}
            >
              <div
                className={`absolute bottom-[23%] right-[34%]   w-[60px]  opacity-0 transition-all duration-1200 float ${
                  zone2Talk ? " " : "opacity-100"
                }`}
              >
                <img
                  src="./images/maker_yellow_number.png"
                  alt=""
                  className="max-w-full"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
                <p className="text-2xl text-gray-500 relative -top-[62px] left-[2px]">2</p>
              </div>
              {zone2Talk && (
                <div className="fixed top-[0%] left-[0%] w-[100%] h-[100%] cursor-pointer bg-amber-500/0 z-10 pointer-events-none sm:pointer-events-auto"></div>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {zone2Talk && (
                  <TalkDialog
                    isOpen={zone2Talk}
                    onClose={() => {
                      setZone2Talk(false);
                      playWalk1Video();
                    }}
                    onAction={() => {
                      setActivePage("roller");
                      // 更新雲霄飛車的指引
                      updateGuideLines({ rollerCoaster: true})
                    }}
                    title={pages[1].title || ""}
                    content={pages[1].subtitle || ""}
                    videoSrc="./elements/omni/talk/output.webm"
                    style={{
                      top: "36%",
                      left: "70%",
                      transform: "translateX(-50%)",
                      transformOrigin: "bottom",
                      width: "400px",
                      rotate: "0deg",
                      zIndex: 1000,
                    }}
                    boxStyle={{
                      position: "absolute",
                      top: "80%",
                    }}
                    isAuthenticated={isAuthenticated}
                    setShowTerms={setShowTerms}
                    loginInfo={false}
                    notOpen={false}
                    parentNode={containerRef}
                  />
                )}
              </AnimatePresence>
            </button>

            {/* 摩天輪 */}
            <button
              className={`absolute top-[22%] left-[40%] w-[14%] h-[37%] cursor-pointer z-10  transition-all duration-300 group ${
                zone3Talk ? "z-20" : "z-0"
              }`}
              onClick={() => {
                if (!zone3Talk) {
                  playSound("./sound/click_unit.wav");
                }
                setZone3Talk(true);
                pauseWalk1Video();
              }}
            >
              {/* 懸浮指標 */}
              <div
                className={`absolute bottom-[4%] left-[30%]  w-[60px]  opacity-0 transition-all duration-1200 float ${
                  zone3Talk ? " " : "opacity-100"
                }`}
              >
                <img
                  src="./images/maker_yellow_number.png"
                  alt=""
                  className="max-w-full"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
                <p className="text-2xl text-gray-500 relative -top-[62px] left-[2px]">1</p>
              </div>

              {/* 防止點擊其他互動物件的遮罩 */}
              {zone3Talk && (
                <div className="fixed top-[0%] left-[0%] w-[100%] h-[100%] cursor-pointer bg-amber-500/0 z-10 pointer-events-none sm:pointer-events-auto"></div>
              )}

              {/* 互動視窗 & OMNI */}
              <AnimatePresence mode="wait" initial={false}>
                {zone3Talk && (
                  <TalkDialog
                    isOpen={zone3Talk}
                    onClose={() => {
                      setZone3Talk(false);
                      playWalk1Video();
                    }}
                    onAction={() => {
                      setActivePage("wheel");
                      // 更新摩天輪的指引
                      updateGuideLines({ ferrisWheel: true })
                    }}
                    title={pages[2].title || ""}
                    content={pages[2].subtitle || ""}
                    videoSrc="./elements/omni/talk/output.webm"
                    style={{
                      top: "55%",
                      left: "-9%",
                      transform: "translateX(-50%)",
                      transformOrigin: "bottom",
                      width: "400px",
                      rotate: "0deg",
                      zIndex: 1000,
                    }}
                    boxStyle={{
                      position: "absolute",
                      bottom: "100%",
                    }}
                    isAuthenticated={isAuthenticated}
                    setShowTerms={setShowTerms}
                    loginInfo={false}
                    notOpen={false}
                    parentNode={containerRef}
                  />
                )}
              </AnimatePresence>
            </button>

            {/* 投票所 */}
            <button
              className={`absolute top-[48%] left-[54%] w-[5%] h-[15%] cursor-pointer transition-all duration-300 group ${
                zone4Talk ? "z-20" : "z-10"
              }`}
              onClick={() => {
                if (!zone4Talk) {
                  playSound("./sound/click_unit.wav");
                }
                setZone4Talk(true);
                pauseWalk1Video();
              }}
            >
              <div
                className={`absolute bottom-[10%] left-[80%]  w-[60px]  opacity-0 transition-all duration-1200 ${
                  zone4Talk ? " " : "group-hover:opacity-100 "
                }`}
              >
                <img
                  src="./images/maker_yellow_number.png"
                  alt=""
                  className="max-w-full float"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div>
              {zone4Talk && (
                <div className="fixed top-[0%] left-[0%] w-[100%] h-[100%] cursor-pointer bg-amber-500/0 z-10 pointer-events-none sm:pointer-events-auto"></div>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {zone4Talk && (
                  <TalkDialog
                    isOpen={zone4Talk}
                    onClose={() => {
                      setZone4Talk(false);
                      playWalk1Video();
                    }}
                    onAction={() => {
                      setActivePage("vote");
                    }}
                    title={pages[3].title || ""}
                    content={pages[3].subtitle_notOpen || ""}
                    videoSrc="./elements/omni/talk/output.webm"
                    style={{
                      top: "20%",
                      left: "120%",
                      transform: "translateX(-50%)",
                      transformOrigin: "bottom",
                      width: "400px",
                      rotate: "0deg",
                      zIndex: 1000,
                    }}
                    boxStyle={{
                      position: "absolute",
                      bottom: "100%",
                    }}
                    isAuthenticated={isAuthenticated}
                    setShowTerms={setShowTerms}
                    loginInfo={false}
                    notOpen={true}
                    parentNode={containerRef}
                  />
                )}
              </AnimatePresence>
            </button>

            {/* 纜車 */}
            <button
              className={`absolute top-[0%] right-[0%] w-[43%] h-[34%] cursor-pointer z-10  transition-all duration-300 group ${
                zone5Talk ? "z-20" : "z-0"
              }`}
              onClick={() => {
                setZone5Talk(true);
                pauseWalk1Video();
              }}
            >
              <div
                className={`absolute bottom-[10%] left-[80%] w-[60px]  opacity-0 transition-all duration-1200 float ${
                  zone2Talk ? " " : "opacity-100"
                }`}
              >
                <img
                  src="./images/maker_yellow_number.png"
                  alt=""
                  className="max-w-full"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
                <p className="text-2xl text-gray-500 relative -top-[62px] left-[2px]">3</p>
              </div>
              {zone5Talk && (
                <div className="fixed top-[0%] left-[0%] w-[100%] h-[100%] cursor-pointer bg-amber-500/0 z-10 pointer-events-none sm:pointer-events-auto"></div>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {zone5Talk && (
                  <TalkDialog
                    isOpen={zone5Talk}
                    onClose={() => {
                      setZone5Talk(false);
                      playWalk1Video();
                    }}
                    onAction={() => {
                      navigate("/cutscene?to=themepark2");
                    }}
                    title={pages[4].title || ""}
                    content={pages[4].subtitle || ""}
                    videoSrc="./elements/omni/talk/output.webm"
                    style={{
                      top: "40%",
                      left: "-0%",
                      transform: "translateX(-50%)",
                      transformOrigin: "bottom",
                      width: "400px",
                      rotate: "0deg",
                      zIndex: 1000,
                    }}
                    boxStyle={{
                      position: "absolute",
                      top: "-20%",
                      left: "40%",
                    }}
                    isAuthenticated={isAuthenticated}
                    setShowTerms={setShowTerms}
                    loginInfo={false}
                    notOpen={false}
                    parentNode={containerRef}
                  />
                )}
              </AnimatePresence>
            </button>
            
            {/* 告示牌(功能同纜車) */}
            <button
              className={`absolute top-[43%] right-[7.5%] w-[9%] h-[15%] cursor-pointer z-10  transition-all duration-300 group ${
                zone5Talk ? "z-20" : "z-0"
              }`}
              onClick={() => {
                setZone5Talk(true);
                pauseWalk1Video();
              }}
            >
              <div
                className={`absolute bottom-[80%] left-[40%]  w-[60px]  opacity-0 transition-all duration-1200 ${
                  zone5Talk ? " " : "group-hover:opacity-100 "
                }`}
              >
                <img
                  src="./images/maker_yellow.png"
                  alt=""
                  className="max-w-full float"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))",
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
