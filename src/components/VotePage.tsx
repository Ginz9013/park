import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import Tab from "./vote/Tab";
import Story from "./Wheel/Story";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, SlidersHorizontal, Check } from "lucide-react";
import { authService } from "@/services/authService";
import { StoryType } from "./vote/Tab";
import { useTranslation } from "react-i18next";
import { Map } from "lucide-react";

// 文章資料類型
type Article = {
  articleId: number;
  title: string;
  content: string;
  section: string;
  gpu: string;
  name: string;
  email: string;
  ytlink: string;
  postlink: string;
  isActive: boolean;
  userId: number;
  imageId: number;
  createdAt: string;
  updatedAt: string;
  image: {
    id: number;
    url: string;
  };
  voteCount: number;
  userVote: number;
};

type VotePageProps = {
  onClose: () => void;
};

const VotePage: React.FC<VotePageProps> = ({ onClose }) => {
  const { isMobile } = useMobile();
  const [openStory, setOpenStory] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortby, setSortBy] = useState<"latest" | "popularity">("latest");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<StoryType | null>(
    null
  );
  const { t } = useTranslation(); 

  // 獲取文章列表
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getArticles();
      if (response.success && response.data) {
        setArticles(response.data);
      } else {
        setError("無法獲取文章列表");
      }
    } catch (err) {
      console.error("獲取文章失敗:", err);
      setError("獲取文章失敗");
    } finally {
      setLoading(false);
    }
  };

  // 組件掛載時獲取文章
  useEffect(() => {
    fetchArticles();
  }, []);

  // 過濾和排序文章
  const filteredAndSortedArticles = articles
    .filter((article) => {
      // 搜尋過濾
      const matchesSearch =
        !searchTerm ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase());

      // section 過濾
      const matchesSection =
        !selectedSection || article.section === selectedSection;

      return matchesSearch && matchesSection;
    })
    .sort((a, b) => {
      if (sortby === "latest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return b.voteCount - a.voteCount;
      }
    });

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setOpenStory(true);
  };

  const handleTabChange = (section: StoryType | null) => {
    setSelectedSection(section);
  };

  useEffect(() => {
    // 彈窗開啟時禁止 body 滾動
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-white absolute top-0 left-0 w-full h-full z-50 flex overflow-auto"
    >
      <div
        className="w-full h-[55%] bg-amber-50/0 relative py-8"
        style={{
          backgroundImage: `url(./images/vote_bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full  absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="w-10/12 md:w-8/12 mx-auto flex  items-center justify-center relative bg-amber-70/0">
          <div className="w-full ">
            <p className="font-semibold mb-2 text-[#C1BCFA] text-3xl  text-shadow-[0_0_15px_#CFAFFF]">
              {t("r1.vote.title")}
            </p>
            <p className="text-white text-lg mb-4">
              {t("r1.vote.card_title")}
            </p>
            <p className="text-white text-sm mt-4">
              {t("r1.vote.card_subtitle")}
            </p>
          </div>
          <div className=" w-1/3 ">
            <img src="./images/p02.png" alt="" className="" />
          </div>
        </div>

        {/* 分類跟內容 */}
        <div className="w-10/12 md:w-8/12 mx-auto flex flex-col items-center justify-center relative bg-amber-70/0">
          {/* 切換 TAB */}
          <Tab onTabChange={handleTabChange} />

          {/* 搜尋框 */}
          <div className={cn("flex justify-end gap-4 w-full mb-8")}>
            {/* Input */}
            <div className={cn("relative", isMobile ? "w-full" : "w-48")}>
              <Input
                type="text"
                className="rounded-full pl-10"
                placeholder="搜尋文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute top-0 left-0 translate-x-[30%] translate-y-[25%]" />
            </div>
            {/* 排序 */}
            <Popover>
              <PopoverTrigger>
                <SlidersHorizontal />
              </PopoverTrigger>
              <PopoverContent className="bg-black text-white w-auto grid grid-cols-[24px_auto] gap-2 place-items-center">
                {sortby === "latest" ? <Check /> : <div />}
                <Button
                  variant="ghost"
                  className="flex justify-start w-ful cursor-pointerl"
                  onClick={() => setSortBy("latest")}
                >
                  <p>Latest</p>
                </Button>
                {sortby === "popularity" ? <Check /> : <div />}
                <Button
                  variant="ghost"
                  className="flex justify-start w-ful cursor-pointerl"
                  onClick={() => setSortBy("popularity")}
                >
                  <p>Popularity</p>
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          {/* Gird 搜尋結果 */}
          <div
            className={cn(
              "grid gap-6 w-full mb-16",
              isMobile ? "grid-cols-1" : "grid-cols-3 "
            )}
          >
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p>載入中...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchArticles} className="mt-4">
                  重試
                </Button>
              </div>
            ) : filteredAndSortedArticles.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p>沒有找到文章</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredAndSortedArticles.map((article, index) => (
                  <motion.div
                    key={article.articleId}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="relative w-full aspect-square rounded-3xl cursor-pointer overflow-hidden"
                    style={{
                      backgroundImage: article.image?.url
                        ? `url(${article.image.url})`
                        : "url('./images/wheel/wheel-background.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => handleArticleClick(article)}
                  >
                    {/* 資訊區 */}
                    <div className="absolute bottom-0 left-0 w-3/4 h-1/4 rounded-tr-4xl rounded-bl-2xl overflow-hidden p-3">
                      {/* 文字內容 */}
                      <div className="relative z-10 h-full flex flex-col justify-center">
                        <p className="mb-1">{article.name}</p>
                        <div className="flex justify-between">
                          <h3 className="text-sm truncate">{article.title}</h3>
                          <p>{article.voteCount}</p>
                        </div>
                      </div>

                      {/* 底圖 + 模糊 */}
                      <div className="absolute z-0 inset-0 backdrop-blur-md bg-gradient-to-b from-black/60 to-[#6E00FF]/40" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4    text-white z-50 flex items-center gap-4">
        <Button onClick={onClose} className="cursor-pointer"><Map /></Button>
      </div>

      {/* Story 視窗 */}
      {selectedArticle && (
        <Story
          open={openStory}
          setOpen={setOpenStory}
          article={selectedArticle}
          vote
        />
      )}
    </motion.div>
  );
};

export default VotePage;
