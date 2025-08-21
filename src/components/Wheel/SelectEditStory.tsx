import { useState, useEffect } from "react";
import DialogTemplate from "../DialogTemplate";
import StoryForm, { StoryType } from "./StoryForm";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { authService } from "@/services/authService";
import { useTranslation } from "react-i18next";

// 文章資料類型
type Article = {
  articleId: number;
  title: string;
  content: string;
  section: StoryType;
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

const SelectEditStory = ({
  parentNode,
  onCloseToMap,
}: {
  parentNode: React.RefObject<HTMLDivElement> | "body";
  onCloseToMap?: () => void;
}) => {
  const { isMobile } = useMobile();
  const [open, setOpen] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasArticles, setHasArticles] = useState<boolean>(false);
  const { t } = useTranslation();

  const closeDialog = () => {
    setOpen(false);
  };

  // 獲取用戶的文章列表
  const fetchMyArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getMyArticles();
      if (response.success && response.articles && response.articles.list) {
        const articleList = response.articles.list;
        setArticles(articleList);
        setHasArticles(articleList.length > 0);
      } else {
        setError("Failed to fetch article list");
        setHasArticles(false);
      }
    } catch (err) {
      console.error("Failed to fetch article list:", err);
      setError("Failed to fetch article list");
      setHasArticles(false);
    } finally {
      setLoading(false);
    }
  };

  // 組件載入時就檢查用戶的文章
  useEffect(() => {
    fetchMyArticles();
  }, []);

  // 當對話框開啟時重新獲取文章
  useEffect(() => {
    if (open) {
      fetchMyArticles();
    }
  }, [open]);

  // 將 API 資料轉換為 StoryForm 需要的格式
  const convertToDefaultValues = (article: Article) => ({
    id: article.articleId.toString(),
    section: article.section,
    name: article.name,
    email: article.email,
    gpu: article.gpu,
    title: article.title,
    content: article.content,
    ytlink: article.ytlink,
    imageId: article.imageId,
    postlink: article.postlink,
    createdAt: article.createdAt,
  });

  // 文章編輯成功後的回調
  const handleStoryEdited = () => {
    // 重新載入文章列表
    fetchMyArticles();
  };

  // 如果用戶沒有文章，不顯示按鈕
  if (!hasArticles) {
    return null;
  }

  return (
    <>
      <Button
        className="buttonn-border-gradient text-lg md:text-xl"
        onClick={() => setOpen(true)}
      >
        {t("r1.wheel.edit_button")}
      </Button>

      <DialogTemplate
        open={open}
        setOpen={setOpen}
        className={cn("gap-6 z-[50]", isMobile ? "" : "w-[45vw]")}
      >
        <h2 className="text-3xl mb-6">
          {t("r1.wheel.edit_title")}
        </h2>

        {/* Story 選項 */}
        <div className="dialog-background-gradient rounded-lg w-full p-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button
                onClick={fetchMyArticles}
                className="mt-4 buttonn-border-gradient"
              >
                Try Again
              </Button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">
              <p>You have no articles</p>
            </div>
          ) : (
            articles.map((article, index) => (
              <div key={article.articleId}>
                <StoryForm
                  parentNode={parentNode}
                  defaultValues={convertToDefaultValues(article)}
                  closeSelectDialog={closeDialog}
                  onStorySubmitted={handleStoryEdited}
                  onCloseToMap={onCloseToMap}
                />
                {index < articles.length - 1 && <hr className="my-4" />}
              </div>
            ))
          )}
        </div>
      </DialogTemplate>
    </>
  );
};

export default SelectEditStory;
