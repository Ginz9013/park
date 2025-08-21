import { useState } from "react";
import useMobile from "@/hooks/useMobile";
import DialogTemplate from "../DialogTemplate";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { authService } from "@/services/authService";
import { motion } from "motion/react";
import { playSound } from "@/utils/sound";
import { Copy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

type StorySubmittedProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  pointMsg?: string;
  articleId?: number | null;
  userId?: number | null;
  articleData?: {
    title: string;
    content: string;
    imageUrl?: string;
  } | null;
  onCloseToMap?: () => void;
};

const StorySubmitted: React.FC<StorySubmittedProps> = ({
  open,
  setOpen,
  pointMsg,
  articleId,
  userId,
  articleData,
  onCloseToMap,
}) => {
  const { isMobile } = useMobile();
  const { refreshAuth } = useAuth();
  const [url, setUrl] = useState<string>("");
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [addPoint, setAddPoint] = useState<boolean>(false);
  const [shareMsg, setShareMsg] = useState<string>("");
  const { t } = useTranslation();

  // 獲取圖片並轉換為 blob
  const getImageAsBlob = async (imageUrl: string): Promise<Blob | null> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.error("獲取圖片失敗:", error);
      return null;
    }
  };

  // 使用 Web Share API 分享
  const handleShare = async (platform: string) => {
    if (!articleData) return;

    const { title, content, imageUrl } = articleData;
    const shareText = `${title}\n\n${content}`;

    try {
      // 檢查是否為桌面版
      const isDesktop = window.innerWidth > 768;

      if (navigator.share && !isDesktop) {
        // 移動版：使用 Web Share API
        let shareData: any = {
          title: title,
          text: content,
        };

        // 如果有圖片，轉換為 blob
        if (imageUrl) {
          const imageBlob = await getImageAsBlob(imageUrl);
          if (imageBlob) {
            shareData.files = [
              new File([imageBlob], "article-image.jpg", {
                type: imageBlob.type,
              }),
            ];
          }
        }

        await navigator.share(shareData);
      } else {
        // 桌面版：使用平台網址分享內文
        const shareUrl = generateFallbackUrl(platform, shareText);
        window.open(shareUrl, "_blank", "width=600,height=400");
      }
    } catch (error) {
      console.error("分享失敗:", error);
    }
  };

  // Instagram 專用分享函數，只分享圖檔
  const handleIGshare = async () => {
    if (!articleData) return;

    const { imageUrl } = articleData;

    try {
      // 檢查是否支援 Web Share API
      if (navigator.share) {
        // 只分享圖片，不包含文字
        if (imageUrl) {
          const imageBlob = await getImageAsBlob(imageUrl);
          if (imageBlob) {
            const shareData = {
              files: [
                new File([imageBlob], "article-image.jpg", {
                  type: imageBlob.type,
                }),
              ],
            };

            // 使用 Web Share API 分享圖片到 Instagram
            await navigator.share(shareData);
            setShareMsg("Share Successfully to Instagram");
          } else {
            setShareMsg("Failed to load image, please try again later");
          }
        } else {
          setShareMsg("No image to share");
        }
      } else {
        // 降級處理：提示用戶手動分享
        setShareMsg("Please share the image manually to Instagram");
      }
    } catch (error) {
      console.error("Instagram 圖片分享失敗:", error);
      setShareMsg("Failed to share image to Instagram");
    }
  };

  // 降級處理的 URL 生成
  const generateFallbackUrl = (platform: string, shareText: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(window.location.href);

    switch (platform) {
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(
          articleData?.title || ""
        )}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case "instagram":
        return;
      default:
        return "#";
    }
  };

  const handleCopyContent = () => {
    if (articleData) {
      const { title, content } = articleData;
      const shareText = `${title}\n\n${content}`;
      navigator.clipboard.writeText(shareText);
      setShareMsg("Copied to clipboard");
    }
  };

  const handlePostLink = async () => {
    let post = {
      postlink: url,
    };
    if (articleId) {
      const response = await authService.editArticle(post, articleId);

      if (response.success === true) {
        setShareSuccess(true);
        playSound("./sound/share_success.wav");
        const result = await authService.addPointWheelShare(userId!);
        if (result.status === "Success") {
          setAddPoint(true);
          refreshAuth();
        }
      }
    }
  };

  return (
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      className={cn("gap-4 z-[70]", isMobile && "w-full")}
      zIndex={100}
    >
      {shareSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 w-full h-full flex flex-col items-cente justify-center gap-4 bg-black/60 z-20"
        >
          <div className="dialog-background-gradient flex flex-col items-center rounded-3xl justify-center relative max-w-[65vw] p-5 mx-auto overflow-scroll">
            <img
              src="./images/wheel/video-finished.png"
              alt="Video Finished"
              className="max-w-full w-[25%]"
            />
            <h2 className="text-4xl font-TTNormsProMedium">{t("r1.wheel.shared.title")}</h2>
            <p className="text-2xl text-center">
              {t("r1.wheel.shared.sub_title")}
            </p>
            {addPoint && <p className="font-bold text-2xl mt-2">{t("r1.wheel.shared.point")}</p>}
            <Button
              className="buttonn-border-gradient mt-5"
              onClick={() => setShareSuccess(false)}
            >
              {t("r1.wheel.shared.back_map_button")}
            </Button>
          </div>
        </motion.div>
      )}
      {/* Icon */}
      <img src="./images/wheel/video-finished.png" alt="Video Finished" />

      {/* 文字 */}
      <h2 className="text-4xl font-TTNormsProMedium">{t("r1.wheel.submitted.title")}</h2>
      <p className="text-2xl">{t("r1.wheel.submitted.sub_title")}</p>
      {pointMsg && pointMsg !== "" && (
        <p className="font-bold text-2xl">{pointMsg}</p>
      )}

      {/* 社交按鈕群 */}
      <div
        className={cn(
          "flex items-center gap-4 mb- flex-wrap",
          isMobile ? "justify-center" : ""
        )}
      >
        <button
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={() => {
            // 打開臉書網頁
            window.open("https://www.facebook.com/", "_blank");
          }}
          title="Share on Facebook"
        >
          <img
            src="./images/wheel/Facebook.png"
            alt="Facebook"
            className="w-10 aspect-square"
          />
        </button>

        {isMobile ? (
          <button
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={handleIGshare}
            title="Share on Instagram"
          >
            <img
              src="./images/wheel/Instagram.png"
              alt="Instagram"
              className="w-10 aspect-square"
            />
          </button>
        ) : (
          <button
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              // 打開IG網頁
              window.open("https://www.instagram.com/", "_blank");
            }}
            title="Share on Instagram"
          >
            <img
              src="./images/wheel/Instagram.png"
              alt="Instagram"
              className="w-10 aspect-square"
            />
          </button>
        )}

        <button
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={() => handleShare("twitter")}
          title="Share on X (Twitter)"
        >
          <img
            src="./images/wheel/X.png"
            alt="X"
            className="w-10 aspect-square"
          />
        </button>
        {/* copy button */}
        <button
          className="cursor-pointer hover:scale-105 transition-transform relative flex gap-2 items-center rounded-2xl px-4 py-2 border border-gray-300"
          onClick={() => handleCopyContent()}
          title="Copy Link"
        >
          <Copy />
          <p className="text-sm">Copy Your Post Content</p>
        </button>
      </div>
      {shareMsg && <p className="text-sm text-gray-500">{shareMsg}</p>}
      {/* 上傳 URL */}
      <p className="text-xl mt-4">
        {t("r1.wheel.submitted.text")}
      </p>
      <div className="flex flex-col items-center gap-4">
        <div className={cn("flex gap-2", isMobile && "flex-col gap-4")}>
          <div className="flex gap-2 items-center text-2xl">
            <p>URL</p>
            <Input
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button className="buttonn-border-gradient" onClick={handlePostLink}>
            {t("r1.wheel.submitted.url_button")}
          </Button>
        </div>

        <Button
          className={cn("buttonn-border-gradient", isMobile && "w-full")}
          onClick={() => {
            setOpen(false);
            onCloseToMap?.();
          }}
        >
          {t("r1.wheel.submitted.back_button")}
        </Button>
      </div>
    </DialogTemplate>
  );
};

export default StorySubmitted;
