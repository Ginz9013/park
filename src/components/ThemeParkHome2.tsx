import { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import AsusLogin from "./AsusLogin";
// import { useAuth } from "../contexts/AuthContext";

// import CustomLanguageDialog from "./CustomLanguageDialog";

// import TermDialog from "./TermDialog";
// import ParkDialog from "./ParkDialog";
// import { useAutoShow } from "@/hooks/useAutoShow";



// 在組件頂部添加一個常數來定義斷點
const TABLET_BREAKPOINT = 1280; // 平板尺寸的斷點，可以根據需求調整


const ThemeParkHome2 = () => {
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [activePage, _setActivePage] = useState<
    "game" | "shop" | null 
  >(null);
  // const [_, setWalk1ZIndex] = useState(9);
  // const [_, setIsWalk1Visible] = useState(true);
  const walk1VideoRef = useRef<HTMLVideoElement>(null);
  const wheelVideoRef = useRef<HTMLVideoElement>(null);

  // 抽卡機


  // 藏顯卡
  // const { r2CardPositions } = useCardPosition();


  // const [isOpeningOK, setIsOpeningOK] = useState(false);
  const [_showTerms] = useState(false);
  // const [showPark, setShowPark] = useState(false);

  // const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  // const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  // const [isLoginLoading, setIsLoginLoading] = useState(false);
  // const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  // const [selectedVideo, setSelectedVideo] = useState<string | null>(null);


  // park dialog auto open after 10 seconds refresh
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // 在手機上使用額外的延遲確保滾動正常執行
  //     const scrollToTop = () => {
  //       window.scrollTo({ top: 84, behavior: "smooth" });
  //     };

  //     if (window.innerWidth < 780) {
  //       setTimeout(scrollToTop, 100);
  //     } else {
  //       scrollToTop();
  //     }

  //     setShowPark(true);
  //     pauseAllVideos();
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

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
  // // walk1 影片暫停並隱藏
  // const pauseWalk1Video = () => {
  //   if (walk1VideoRef.current) {
  //     walk1VideoRef.current.pause();
  //   }
  //   setIsWalk1Visible(false);
  // };
  // // walk1 影片顯示並繼續
  // const playWalk1Video = () => {
  //   if (walk1VideoRef.current) {
  //     walk1VideoRef.current.play();
  //   }
  //   setIsWalk1Visible(true);
  // };

  // 處理 walk1 影片播放
  // const handleWalk1VideoTimeUpdate = () => {
  //   if (walk1VideoRef.current) {
  //     const video = walk1VideoRef.current;
  //     const currentTime = video.currentTime;

  //     // 根據播放秒數設定不同的 z-index
  //     if (currentTime > 12 && currentTime < 22) {
  //       setWalk1ZIndex(8); // 2-4秒：z-index = 15
  //     } else {
  //       setWalk1ZIndex(12); // 2-4秒：z-index = 15
  //     }

  //     // 檢查是否接近影片結尾（例如最後 0.1 秒）
  //     if (video.duration - currentTime < 0.1) {
  //       // 每次播放完成後都跳轉到指定秒數
  //       video.currentTime = 17.5;
  //     }
  //   }
  // };

  // const handleWalk1VideoEnded = () => {
  //   if (walk1VideoRef.current) {
  //     // 每次播放結束後都跳轉到指定秒數並繼續播放
  //     walk1VideoRef.current.currentTime = 17.5;
  //     walk1VideoRef.current.play().catch((error) => {
  //       console.log("Video play failed:", error);
  //     });
  //   }
  // };

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
  // const pages = [
  //   {
  //     title: "r1.ticket.title",
  //     subtitle: ["r1.map.after_login_ticket1", "r1.map.after_login_ticket2"],
  //     link: "/",
  //     buttonAction: "ticket",
  //   },
  //   {
  //     title: "r1.roller.title",
  //     subtitle: "r1.map.after_login_roller",
  //     link: "/",
  //     buttonAction: "roller",
  //   },
  //   {
  //     title: "r1.wheel.title",
  //     subtitle: "r1.map.after_login_wheel",
  //     link: "/",
  //     buttonAction: "ferris",
  //   },
  //   {
  //     title: "r1.vote.title",
  //     subtitle_notOpen: "r1.map.after_login_vote_notOpen",
  //     subtitle: "r1.map.after_login_vote_Open",
  //     link: "/",
  //     buttonAction: "vote",
  //   },
  //   {
  //     title: "r1.cable.title",
  //     subtitle_notOpen: "r1.map.after_login_cable_notOpen",
  //     subtitle: "r1.map.after_login_cable_Open",
  //     link: "/",
  //     buttonAction: "cablecar",
  //   },
  //   {},
  // ];

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

      {/* 背景相關 */}
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
        {/* 底圖 */}
        <div className={`relative w-full h-full `}>

          {/* 前景圖層 */}
          <div
            className="absolute top-0 left-0 z-7 w-full h-full pointer-events-none"
          >
            <img src="./elements/r2/map/front.png" alt="front-layer" />
          </div>


          {/* 背景影片 */}
          <video
            ref={videoRef}
            className={`w-full h-full ${
              isMobileView ? "object-cover" : "object-cover"
            } z-0 ${true ? "opacity-100" : "opacity-50"}`}
            autoPlay
            loop
            muted
            playsInline
            style={{
              pointerEvents: "none",
              width: imageSize.width,
              height: imageSize.height,
            }}
            onCanPlay={() => videoRef.current?.play().catch(()=>{})}
            onError={(e) => console.error('video error', e)}
          >
            <source
              src="./elements/r2/map/output.mov"
              type="video/quicktime"
            />
            {/* <source
                src="./elements/r2/map/output.webm"
                type="video/webm"
              /> */}
          </video>

      
        </div>
      </div>
    </div>
  );
}

export default ThemeParkHome2;
