import { useState } from "react";
import useMobile from "@/hooks/useMobile";
import DialogTemplate from "../DialogTemplate";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import FullScreenVideo from "./FullScreenVideo";
import CheckToVote from "../vote/CheckToVote";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useTranslation } from "react-i18next";

type StoryProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  article: any;
  vote?: boolean;
};
const Story: React.FC<StoryProps> = ({ open, setOpen, article, vote }) => {
  const { t } = useTranslation();
  const { isMobile } = useMobile();
  const [shareMsg, _setShareMsg] = useState<string>("");
  // const [articleData, setArticleData] = useState<any>(null);
  const [carouselApi, setCarouselApi] = useState<any>();
  // const getImageAsBlob = async (imageUrl: string): Promise<Blob | null> => {
  //   try {
  //     const response = await fetch(imageUrl);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     return await response.blob();
  //   } catch (error) {
  //     console.error("獲取圖片失敗:", error);
  //     return null;
  //   }
  // };
  // 使用 Web Share API 分享
  // const handleShare = async (platform: string) => {
  //   if (!article) return;

  //   const { title, content, imageUrl } = article;
  //   const shareText = `${title}\n\n${content}`;

  //   try {
  //     // 檢查是否為桌面版
  //     const isDesktop = window.innerWidth > 768;

  //     if (navigator.share && !isDesktop) {
  //       // 移動版：使用 Web Share API
  //       let shareData: any = {
  //         title: title,
  //         text: content,
  //       };

  //       // 如果有圖片，轉換為 blob
  //       if (imageUrl) {
  //         const imageBlob = await getImageAsBlob(imageUrl);
  //         if (imageBlob) {
  //           shareData.files = [
  //             new File([imageBlob], "article-image.jpg", {
  //               type: imageBlob.type,
  //             }),
  //           ];
  //         }
  //       }

  //       await navigator.share(shareData);
  //     } else {
  //       // 桌面版：使用平台網址分享內文
  //       const shareUrl = generateFallbackUrl(platform, shareText);
  //       window.open(shareUrl, "_blank", "width=600,height=400");
  //     }
  //   } catch (error) {
  //     console.error("分享失敗:", error);
  //   }
  // };
  // Instagram 專用分享函數，只分享圖檔
  // const handleIGshare = async () => {
  //   if (!article) return;

  //   const { imageUrl } = article;

  //   try {
  //     // 檢查是否支援 Web Share API
  //     if (navigator.share) {
  //       // 只分享圖片，不包含文字
  //       if (imageUrl) {
  //         const imageBlob = await getImageAsBlob(imageUrl);
  //         if (imageBlob) {
  //           const shareData = {
  //             files: [
  //               new File([imageBlob], "article-image.jpg", {
  //                 type: imageBlob.type,
  //               }),
  //             ],
  //           };

  //           // 使用 Web Share API 分享圖片到 Instagram
  //           await navigator.share(shareData);
  //           setShareMsg("Share Successfully to Instagram");
  //         } else {
  //           setShareMsg("Failed to load image, please try again later");
  //         }
  //       } else {
  //         setShareMsg("No image to share");
  //       }
  //     } else {
  //       // 降級處理：提示用戶手動分享
  //       setShareMsg("Please share the image manually to Instagram");
  //     }
  //   } catch (error) {
  //     console.error("Instagram 圖片分享失敗:", error);
  //     setShareMsg("Failed to share image to Instagram");
  //   }
  // };
  // const handleCopyContent = () => {
  //   if (article) {
  //     const { title, content } = article;
  //     const shareText = `${title}\n\n${content}`;
  //     navigator.clipboard.writeText(shareText);
  //     setShareMsg("Copied to clipboard");
  //   }
  // };

  // 降級處理的 URL 生成
  // const generateFallbackUrl = (platform: string, shareText: string) => {
  //   const encodedText = encodeURIComponent(shareText);
  //   const encodedUrl = encodeURIComponent(window.location.href);

  //   switch (platform) {
  //     case "facebook":
  //       return `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(
  //         encodedText
  //       )}`;
  //     case "X":
  //       return `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  //     case "Instagram":
  //       return;
  //     default:
  //       return "#";
  //   }
  // };

  return (
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      className={cn(
        "z-[70]",
        isMobile ? "block px-8" : "flex flex-row gap-6 items-start"
      )}
    >
      {/* 左：顯示照片 */}
      <div className={cn(isMobile ? "mb-12" : "flex-1")}>
        {/* 輪播 */}
        <Carousel
          setApi={setCarouselApi}
          className="w-full aspect-[1/1] rounded-2xl overflow-hidden"
        >
          <CarouselContent>
            {article.ytlink && (
              <CarouselItem className="w-full aspect-[1/1] bg-gray-600">
                <FullScreenVideo videoUrl={article.ytlink} />
              </CarouselItem>
            )}
            {article.imageId && article.image && (
              <CarouselItem className="w-full aspect-[1/1] bg-gray-800">
                <img
                  src={article.image.url}
                  alt="story-image"
                  className="w-full h-full object-contain "
                />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>

        {/* 前後頁按鈕 */}
        {article.ytlink && (
          <div
            className={cn(
              "flex mt-4",
              isMobile ? "justify-between" : "justify-center gap-4"
            )}
          >
            <button
              className="cursor-pointer"
              onClick={() => carouselApi?.scrollPrev()}
            >
              <img src="./images/wheel/arrow-left.png" alt="left-button" />
            </button>
            <button
              className="cursor-pointer"
              onClick={() => carouselApi?.scrollNext()}
            >
              <img src="./images/wheel/arrow-right.png" alt="right-button" />
            </button>
          </div>
        )}
      </div>

      {/* 右：故事資訊 */}
      <div className="flex-1 w-full md:w-1/2 ">
        <div className="flex justify-between">
          <h2 className="text-2xl">{article.title}</h2>
        </div>
        <ScrollArea className="text-lg mt-1 h-[420px] overflow-auto">
          <div className="flex items-center justify-between gap-2">
            <p>{article.name}</p>
            <p className="text-gray-400 hidden">
              {article.userVote ? article.userVote : 0} {t("r1.wheel.vote")}
            </p>
          </div>

          <br />
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-bold">Section:</span> {article.section}
            </p>
            <p>
              <span className="font-bold">ASUS Graphics Model:</span>{" "}
              {article.gpu}
            </p>
            <p>
              <span className="font-bold">Youtube URL:</span> {article.ytlink}
            </p>
            <br />
            <p>
              <span className="font-bold">Story Content:</span>{" "}
              {article.content}
            </p>
          </div>
        </ScrollArea>

        {/* 社交按鈕群 */}
        <div
          className={cn(
            "flex items-start gap-4 mt-8 flex-wrap",
            isMobile ? "justify-center" : ""
          )}
        >
          {vote && <CheckToVote articleId={article.articleId} />}
        </div>
        {shareMsg && (
          <p className="text-sm text-gray-500 text-center">{shareMsg}</p>
        )}
      </div>
    </DialogTemplate>
  );
};

export default Story;
