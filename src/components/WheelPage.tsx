import { motion } from "motion/react";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { Dot, Loader2, Search } from "lucide-react";
import Story from "./Wheel/Story";
import StoryForm from "./Wheel/StoryForm";
import SelectEditStory from "./Wheel/SelectEditStory";
import { t } from "i18next";
import { useSupportsHEVCAlpha } from "@/hooks/useSupportsHEVCAlpha";
import { authService } from "@/services/authService";
import ReactPlayer from "react-player";
import VideoDialog from "./Wheel/VideoDialog";
import VideoFinishedDialog from "./Wheel/VideoFinishedDialog";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { Map } from "lucide-react";
import KolVideo from "@/utils/KOLVideo.json";

type WheelPageProps = {
  onClose: () => void;
};
const WheelPage: React.FC<WheelPageProps> = ({ onClose }) => {
  const { isMobile } = useMobile();
  const editStoryPortalRef = useRef<HTMLDivElement>(null);

  const [showStory, setShowStory] = useState<boolean>(false);
  const supportsHEVCAlpha = useSupportsHEVCAlpha();
  const [videoOpen, setVideoOpen] = useState<boolean>(false);
  const [videoFinishedOpen, setVideoFinishedOpen] = useState<boolean>(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { userData, refreshAuth } = useAuth();

  // 隨機選擇一個影片
  const [selectedVideo] = useState(() => {
    const randomIndex = Math.floor(Math.random() * KolVideo.length);
    return KolVideo[randomIndex];
  });
  const handleVideoClickAndAddPoint = (ruleId: number) => {
    setVideoOpen(true);
    // 從 AuthContext 獲取用戶 ID
    const userId = userData?.userId; // 暫時使用固定值，實際應該從 context 獲取
    const videotag = selectedVideo.videotag; // 使用影片標題作為 videotag

    authService
      .addPointKOL(userId!, ruleId, videotag)
      .then((data: any) => {
        console.log("KOL影片積分添加成功:", data);
        if (data.status === "Success") {
          refreshAuth();
          setVideoFinishedOpen(true); // 顯示影片完成對話框
        } else {
          setVideoFinishedOpen(false);
        }
      })
      .catch((error: any) => {
        console.error("執行積分失敗:", error);
      });
  };

  // let sampleArticle = {
  //   articleId: 1,
  //   name: "ROG Omni",
  //   email: "rogomni123@asus.com",
  //   gpu: "ROG Astral GeForce RTX 5090",
  //   title: "My New Love",
  //   section: "Huge ASUS Fans",
  //   content:
  //     "I bought the latest ROG Astral GeForce RTX 5090 this year! My dream is to collect all the graphics card series from ASUS!",
  //   imageId: 999999999,
  //   image: {
  //     url: "./images/0707/sample.jpg",
  //   },
  //   postlink: "",
  //   isActive: true,
  //   userId: 1,
  // };

  const handleSearch = () => {
    console.log("執行搜尋，搜尋詞:", searchTerm);

    if (searchTerm.length > 0) {
      authService
        .searchArticle(searchTerm)
        .then((data: any) => {
          console.log("搜尋結果:", data);
          if (data.data && Array.isArray(data.data)) {
            setArticles(data.data);
          } else {
            console.warn("搜尋結果格式不正確:", data);
            setArticles([]);
          }
        })
        .catch((error: any) => {
          console.error("搜尋失敗:", error);
          setArticles([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      // 如果搜尋詞為空，顯示隨機文章
      authService
        .getArticles()
        .then((data: any) => {
          console.log("獲取所有文章:", data);
          if (data.data && Array.isArray(data.data)) {
            const randomArticles = data.data
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
            setArticles(randomArticles);
          } else {
            console.warn("文章資料格式不正確:", data);
            setArticles([]);
          }
        })
        .catch((error: any) => {
          console.error("獲取文章失敗:", error);
          setArticles([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }
  };
  useEffect(() => {
    authService.getArticles().then((data: any) => {
      // 隨機三個
      const randomArticles = data.data
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setArticles(randomArticles);
    });
  }, []); // 移除 articles 依賴，只在組件掛載時執行一次

  useEffect(() => {
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
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "text-white absolute top-0 left-0 w-full h-screen z-40 flex flex-col items-center justify-start overflow-auto"
      )}
      style={{
        backgroundImage: `url(./images/wheel_bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Portal 掛載點 */}
      <div ref={editStoryPortalRef} />
      <div className="absolute top-[4%] right-4 text-white z-30 flex items-center gap-4">
        <Button onClick={onClose} className="cursor-pointer"><Map /></Button>
      </div>

      {/* 左下角摩天輪，只有 PC 版顯示 */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 0.6, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className=" hidden text-white absolute bottom-0 left-0  w-[24vw] z-[-1]  flex-col items-center justify-center "
        >
          {/* 背景影片 */}

          <video
            className={`w-full `}
            autoPlay
            loop
            muted
            playsInline
            style={{
              pointerEvents: "none",
            }}
          >
            {supportsHEVCAlpha ? (
              <source
                src="./elements/wheel_corner/output-1.mov"
                type="video/mp4"
              />
            ) : (
              <source
                src="./elements/wheel_corner/output.webm"
                type="video/webm"
              />
            )}
          </video>
        </motion.div>
      )}

      {/* 內容 */}
      <div
        className={cn(
          "w-full md:w-10/12",
          isMobile ? "px-8 py-24" : "flex gap-16"
        )}
      >
        {/* PC: 左側 */}
        <div
          className={cn(
            "flex-1 flex flex-col gap-4  pb-10",
            isMobile ? "items-center" : "pt-10"
          )}
        >
          <h2
            className={cn(
              "text-2xl md:text-4xl text-glow",
              isMobile ? "text-center" : "text-start mb-4"
            )}
          >
            {t("r1.wheel.title")}
          </h2>
          <p className="text-lg md:text-base">{t("r1.wheel.card_title")}</p>
          <p className="text-lg md:text-base ">{t("r1.wheel.card_subtitle")}</p>

          {/* Submit your story */}
          <div>
            {/* <h2
              className={cn(
                "text-2xl md:text-4xl mb-4 text-glow",
                isMobile && "text-center"
              )}
            >
              Submit your story
            </h2> */}
            <p className="text-lg md:text-base mt-12">
              Not quite sure what to share? Here are some ideas to get you
              started:
            </p>
            <ul className="mb-4 mt-4 text-lg md:text-base">
              <li className="flex items-center gap-2">
                <Dot size={24} />
                {t("r1.wheel.HugeASUSFans")}：
                {t("r1.wheel.HugeASUSFans_content")}
              </li>
              <li className="flex items-center gap-2">
                <Dot size={24} />
                {t("r1.wheel.FavoriteMoment")}：
                {t("r1.wheel.FavoriteMoment_content")}
              </li>
              <li className="flex items-center gap-2">
                <Dot size={24} />
                {t("r1.wheel.SpecialFeatures")}：
                {t("r1.wheel.SpecialFeatures_content")}
              </li>
              <li className="flex items-center gap-2">
                <Dot size={24} />
                {t("r1.wheel.TheGamer")}：{t("r1.wheel.TheGamer_content")}
              </li>
              <li className="flex items-center gap-2">
                <Dot size={24} />
                {t("r1.wheel.MyOwnStory")}：{t("r1.wheel.MyOwnStory_content")}
              </li>
            </ul>

            {/* Buttons */}
            <div className={cn("flex gap-4 mt-12", isMobile && "flex-col")}>
              <StoryForm
                parentNode={
                  editStoryPortalRef as React.RefObject<HTMLDivElement>
                }
                onCloseToMap={onClose}
              />
              <SelectEditStory
                parentNode={
                  editStoryPortalRef as React.RefObject<HTMLDivElement>
                }
                onCloseToMap={onClose}
              />
            </div>
          </div>
        </div>

        {/* PC: 右側 */}
        <div
          className={cn(
            "z-0 relative",
            isMobile
              ? "mt-8"
              : "flex-1 flex flex-col gap-4 h-[100vh]  pt-10 pb-10"
          )}
        >
          {/* 有邊框的區域 */}
          <div className={cn("p-2 gradient-box ", isMobile && "mb-12")}>
            <ScrollArea className="h-[90vh] p-4">
              {/* 標題 & 搜尋 */}
              <div
                className={cn(
                  "flex gap-3 mb-4 md:mb-8 flex-wrap items-start",
                  isMobile && "flex-col items-center"
                )}
              >
                <h3 className="text-2xl md:text-3xl flex-shrink-0">
                  {t("r1.wheel.memory_title")}
                </h3>

                {/* Input */}
                <div
                  className={cn(
                    "relative min-w-[150px]",
                    isMobile ? "w-full" : "flex-1"
                  )}
                >
                  <Input
                    type="text"
                    className="rounded-full pl-10"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                      console.log("click");
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <button
                    className="absolute top-0 left-0 translate-x-[30%] translate-y-[25%]  hover:bg-gray-200/20 rounded-full transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSearch();
                    }}
                  >
                    {isSearching ? (
                      <Loader2 className=" animate-spin" size={22} />
                    ) : (
                      <Search size={24} />
                    )}
                  </button>
                </div>
              </div>

              {/* Video Wall */}
              <div
                className={cn(
                  isMobile
                    ? "flex flex-col gap-2 md:gap-8"
                    : "grid grid-cols-2 grid-rows-2 gap-5 w-full"
                )}
              >
                <button
                  className="bg-black w-full aspect-[1/1] rounded-2xl cursor-pointer relative overflow-hidden"
                  onClick={() =>
                    handleVideoClickAndAddPoint(selectedVideo.ruleId)
                  }
                >
                  {/* 隨機選擇一個影片 */}
                  <ReactPlayer
                    url={selectedVideo.url}
                    width="100%"
                    height="100%"
                    disablePictureInPicture
                    disableRemotePlayback
                    controls={false}
                    light={true}
                    style={{ pointerEvents: "none" }}
                  />

                  {/* <div
              key={"sampleArticle"}
                className="bg-black w-full aspect-[1/1] rounded-2xl cursor-pointer overflow-hidden"
                onClick={() => {
                  setShowStory(true);
                  setSelectedArticle(sampleArticle);
                }}
                style={{
                  backgroundImage: `url(${
                    sampleArticle.image?.url || "/images/wheel/default.png"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute top-0 right-0  flex items-center justify-center text-white text-xs  bg-black/90 rounded-lg  px-2 py-1">
                  Example
                </div>
              </div> */}
                </button>

                {articles.map((article) => {
                  // if ytlink is not empty, show the video else show the image
                  if (article.ytlink) {
                    return (
                      <button
                        key={article.articleId}
                        className="bg-black w-full aspect-[1/1] rounded-2xl cursor-pointer overflow-hidden"
                        onClick={() => {
                          setShowStory(true);
                          setSelectedArticle(article);
                        }}
                      >
                        <ReactPlayer
                          url={article.ytlink}
                          width="100%"
                          height="100%"
                          disablePictureInPicture
                          disableRemotePlayback
                          controls={false}
                          light={true}
                          style={{ pointerEvents: "none" }}
                        />
                      </button>
                    );
                  } else {
                    return (
                      <div
                        key={article.articleId}
                        className="bg-black w-full aspect-[1/1] rounded-2xl cursor-pointer overflow-hidden"
                        onClick={() => {
                          setShowStory(true);
                          setSelectedArticle(article);
                        }}
                        style={{
                          backgroundImage: `url(${
                            article.image?.url || "/images/wheel/default.png"
                          })`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    );
                  }
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {showStory && (
        <Story
          open={showStory}
          setOpen={setShowStory}
          article={selectedArticle}
          vote={false}
        />
      )}
      <VideoDialog
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        url={selectedVideo.url}
      />
      <VideoFinishedDialog
        open={videoFinishedOpen}
        setOpen={setVideoFinishedOpen}
      />
    </motion.div>
  );
};

export default WheelPage;
