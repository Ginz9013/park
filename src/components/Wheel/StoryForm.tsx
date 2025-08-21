import { createPortal } from "react-dom";
import { motion } from "motion/react";
import useMobile from "@/hooks/useMobile";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUp, Info } from "lucide-react";
import { Label } from "../ui/label";
import StorySubmitted from "./StorySubmitted";
import { useTranslation } from "react-i18next";
import { authService } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { playSound } from "@/utils/sound";
import { useMission } from "@/hooks/useMission";
import { WHEEL_POST_POINT_RULE_ID } from "@/types/pointRule";


// Story 的 Submit, Edit, Preview 三種狀態都包含在這個元件中
// 如果有帶入預設表單資料跟，就是 Edit
// 如果沒有帶入預設表單資料，就會是 Submit
// 上面兩種狀態在送出表單時都會先進入 Preview, 再次點擊才會送出表單
export enum StoryType {
  HugeASUSFans = "HugeASUSFans",
  SpecialFeatures = "SpecialFeatures",
  FavoriteMoment = "FavoriteMoment",
  TheGamer = "TheGamer",
  MyOwnStory = "MyOwnStory",
}

// 表單輸入類型（包含 File）
type FormInputData = {
  section: StoryType;
  name: string;
  email: string;
  gpu: string;
  title: string;
  content: string;
  ytlink: string;
  postlink: string;
  image?: File; // 編輯模式下可選
  createdAt?: string;
};

// API 提交類型（包含 imageId）
// type ArticleSubmitData = {
//   section: StoryType;
//   name: string;
//   email: string;
//   gpu: string;
//   title: string;
//   content: string;
//   ytlink: string;
//   postlink: string;
//   imageId: number; // API 提交時是 number
// };

// 修改 schema
const formSchema = z
  .object({
    section: z.nativeEnum(StoryType),
    name: z.string().min(2).max(50),
    email: z.string().email(),
    gpu: z.string().nonempty(),
    title: z.string().nonempty(),
    content: z.string(),
    ytlink: z.string(),
    postlink: z.string(),
    image: z.instanceof(File).optional(),
  })
  .refine(
    (data) => {
      return data.content || data.ytlink;
    },
    {
      message: "Either story content or video URL is required.",
      path: ["storyContent"], // 錯誤會標在哪個欄位上
    }
  );

// 如果是 Edit 模式，請把 defaultValues 跟 closeSelectDialog 一起帶入
type StoryFormProps = {
  defaultValues?: {
    id?: string; // 編輯時需要的文章ID
    section: StoryType;
    name: string;
    email: string;
    gpu: string;
    title: string;
    content?: string;
    ytlink?: string;
    imageId?: number;
    postlink?: string;
    createdAt?: string;
  };
  closeSelectDialog?: () => void;
  onStorySubmitted?: () => void; // 文章提交成功後的回調
  parentNode?: React.RefObject<HTMLDivElement> | "body";
  onCloseToMap?: () => void;
};

const StoryForm: React.FC<StoryFormProps> = ({
  defaultValues,
  closeSelectDialog,
  onStorySubmitted,
  parentNode = "body",
  onCloseToMap,
}) => {
  const { refetch } = useMission();

  const { isMobile } = useMobile();
  const [open, setOpen] = useState<boolean>(false);
  // edit mode 表示編輯模式，包含 Submit 跟 Edit 頁面
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  // 控制表單送出成功的彈跳視窗
  const [showStorySubmitted, setShowStorySubmitted] = useState<boolean>(false);
  const [uploadedImageData, setUploadedImageData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [hasCheckedLimit, setHasCheckedLimit] = useState(false);
  const [pointAdded, setPointAdded] = useState(false);
  const [pointMsg, setPointMsg] = useState<string>("");
  const [submittedArticleId, setSubmittedArticleId] = useState<number | null>(
    null
  );
  const [submittedArticleData, setSubmittedArticleData] = useState<{
    title: string;
    content: string;
    imageUrl?: string;
  } | null>(null);
  const { t } = useTranslation();

  const { userData } = useAuth();
  const form = useForm<FormInputData>({
    resolver: zodResolver(formSchema),
    defaultValues:
      defaultValues ||
      ({
        section: StoryType.HugeASUSFans,
        name: "",
        email: "",
        gpu: "",
        title: "",
        content: "",
        ytlink: "",
        postlink: "",
        createdAt: "",
      } as FormInputData),
  });

  const image = form.watch("image");

  async function checkToPreview(values: FormInputData) {
    try {
      // 如果有新圖片，先上傳
      if (values.image) {
        const formData = new FormData();
        formData.append("file", values.image);
        const imageResponse = await authService.uploadImage(formData);
        console.log("圖片上傳成功:", imageResponse);

        setUploadedImageData(imageResponse.data);
      }

      // 切換到預覽模式
      setMode("preview");
    } catch (error) {
      console.error("圖片上傳失敗:", error);
      // 顯示錯誤訊息
    }
  }

  async function handleFinalSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 新增模式需要上傳圖片
    if (!defaultValues && !uploadedImageData) return;

    // 編輯模式必須有 imageId（原有的或新上傳的）
    if (defaultValues && !uploadedImageData && !defaultValues.imageId) return;

    try {
      const formData = form.getValues();

      if (defaultValues) {
        // 編輯模式：使用 PATCH
        const editData = {
          section: formData.section,
          name: formData.name,
          gpu: formData.gpu,
          title: formData.title,
          content: formData.content,
          ytlink: formData.ytlink,
          postlink: formData.postlink,
          email: formData.email,
          // 如果有新上傳的圖片，使用新的 imageId；否則保持原有的 imageId
          imageId: uploadedImageData
            ? uploadedImageData.imageId
            : defaultValues.imageId,
        };

        const editResult = await authService.editArticle(
          editData,
          parseInt(defaultValues.id || "0")
        );

        // 編輯模式成功後設置必要狀態
        setSubmittedArticleId(parseInt(defaultValues.id || "0"));
        playSound("./sound/post_success.wav");
        setSubmittedArticleData({
          title: formData.title,
          content: formData.content,
          imageUrl: editResult?.imageId ? editResult.image.url : undefined,
        });
      } else {
        // 新增模式：使用 POST
        const articleData = {
          section: formData.section,
          name: formData.name,
          gpu: formData.gpu,
          title: formData.title,
          content: formData.content,
          ytlink: formData.ytlink,
          postlink: formData.postlink,
          email: formData.email,
          // 注意：API 目前不支援 imageId，需要後端修改
          imageId: uploadedImageData.imageId,
        };

        const submitResult = await authService.submitArticle(articleData);

        // 保存提交成功的文章 ID 和資料
        if (submitResult && submitResult.data && submitResult.data.articleId) {
          setSubmittedArticleId(submitResult.data.articleId);
          console.log("id", submitResult.data.articleId);
          playSound("./sound/post_success.wav");
          // 保存文章資料用於分享
          const formData = form.getValues();
          setSubmittedArticleData({
            title: formData.title,
            content: formData.content,
            imageUrl: submitResult?.imageId
              ? submitResult.image.url
              : undefined,
          });
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "data_layer_event",
          event_name_ga4: "click_wheel_submit_story",
          event_category_DL: "buttons",
          event_action_DL: "clicked",
          event_label_DL: "wheel_submit_story",
          event_value_DL: "",
        });

        // 新增模式下成功提交文章後加點
        try {
          const userId = userData?.userId;

          if (userId) {
            const result = await authService.addPointWheel(userId);
            if (result && result.status === "Failed") {
              if (result.message === "不符合得分條件") {
                // 已經加過點了，標記為已加點但不顯示錯誤
                setPointAdded(false);
                console.log(pointAdded);
                setPointMsg("");
                console.log("摩天輪投稿已經加過點了");
              } else {
                setPointMsg("");
                console.error("摩天輪投稿加點失敗:", result.message);
              }
            } else {
              // 新增任務紀錄
              await authService.createMissionRecord(WHEEL_POST_POINT_RULE_ID);
              // 更新任務清單
              refetch();
              // 成功加點
              setPointAdded(true);
              console.log(pointAdded);
              setPointMsg("+3 Points");
              console.log("摩天輪投稿積分加點成功！");
            }
          }
        } catch (error) {
          console.error("摩天輪投稿加點失敗:", error);
        }
      }

      console.log("準備設置 showStorySubmitted 為 true");
      setShowStorySubmitted(true);
      console.log(
        "showStorySubmitted 已設置為 true，當前值:",
        showStorySubmitted
      );
      console.log("submittedArticleId:", submittedArticleId);
      console.log("submittedArticleData:", submittedArticleData);
      // 移除立即回調函數調用，避免對話框立即關閉
      // onStorySubmitted?.();
    } catch (error) {
      console.error("文章提交失敗:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function checkLimit() {
    const response = await authService.checkLimit();
    console.log("檢查投稿限制:", response);
    if (response.success && response.data) {
      setCurrentCount(response.data.currentCount);
    }
  }

  useEffect(() => {
    // 只在新增模式下檢查投稿限制

    if (!defaultValues && !hasCheckedLimit) {
      checkLimit();
      setHasCheckedLimit(true);
    }
  }, [defaultValues, hasCheckedLimit]);
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

  return (
    <>
      {/* 開啟按鈕 */}
      {defaultValues ? (
        <button
          className="w-full hover:bg-gray-500/50  rounded-lg px-4 py-2 my-2 cursor-pointer flex justify-start font-RobotoRegular text-lg md:text-lg whitespace-pre-wrap text-left"
          onClick={() => setOpen(true)}
        >
          <p className="w-[20%]">Story Title：</p>
          <div className="w-3/4 text-left">
            {defaultValues.title}
            <p className="text-sm text-gray-500">
              {defaultValues.createdAt &&
                new Date(defaultValues.createdAt).toLocaleString()}
            </p>
          </div>
        </button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="botton-background-gradient text-black cursor-pointer text-lg md:text-xl"
        >
          {t("r1.wheel.create_button")}
        </Button>
      )}

      {/* 開啟的頁面 */}
      {open &&
        createPortal(
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "text-white fixed top-0 left-0 w-full h-full z-[60] flex flex-col items-center justify-start p-24 overflow-auto",
              isMobile ? "p-8" : ""
            )}
            style={{
              backgroundImage: `url(./images/wheel/story-background.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* 右上角關閉按鈕 */}
            <div className="absolute top-[4%] right-4 text-white z-50 flex items-center gap-4">
              <Button
                onClick={() => {
                  setOpen(false);
                  closeSelectDialog?.();
                }}
                className="cursor-pointer"
              >
                Back to Ferris Wheel
              </Button>
            </div>

            {/* 開頭內容 */}
            <div className="w-full md:w-8/12 mx-auto mb-22">
              <h2 className="text-3xl md:text-5xl text-glow mb-6 ">
                {mode === "preview"
                  ? t("r1.wheel.post.preview_title")
                  : defaultValues
                    ? t("r1.wheel.post.edit_title")
                    : t("r1.wheel.post.post_title")}
              </h2>

              <p>
                {t("r1.wheel.post.description1")}
              </p>
              <br />
              <p>{t("r1.wheel.post.description2")}​</p>
              <br />
              <p>
                {t("r1.wheel.post.description3")}
              </p>
            </div>

            {/* 主要內容: 根據 mode 切換顯示 */}
            {/* 切換到 preview 是在 onSubmit 方法中，已經會先透過 schema 檢查表單，所以切換過來時可以確保表單一定有資料 */}
            {mode === "edit" ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(checkToPreview)}
                  className={cn("space-y-8", isMobile ? "w-full" : "w-8/12")}
                >
                  {/* 投稿限制 */}
                  {currentCount > 4 && (
                    <div className="w-full rounded-xl bg-red-500 text-white/80 p-4 text-lg">
                      <p className="flex items-center gap-1">
                        <Info size={20} /> You have reached the maximum allowed
                        number of submissions: 5 articles.
                      </p>
                      <p className="text-sm text-white">
                        Please do not submit again. To edit your story, visit
                        the Edit page.
                      </p>
                    </div>
                  )}

                  {/* Type */}
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">
                          {t("r1.wheel.post.story_type.title")}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={cn("flex gap-6", isMobile && "flex-col")}
                          >
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem
                                  value={StoryType.HugeASUSFans}
                                />
                              </FormControl>
                              <FormLabel>
                                {t("r1.wheel.post.story_type.option1")}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem
                                  value={StoryType.FavoriteMoment}
                                />
                              </FormControl>
                              <FormLabel>
                                {t("r1.wheel.post.story_type.option2")}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem
                                  value={StoryType.SpecialFeatures}
                                />
                              </FormControl>
                              <FormLabel>
                                {t("r1.wheel.post.story_type.option3")}
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem value={StoryType.TheGamer} />
                              </FormControl>
                              <FormLabel>{t("r1.wheel.post.story_type.option4")}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center">
                              <FormControl>
                                <RadioGroupItem value={StoryType.MyOwnStory} />
                              </FormControl>
                              <FormLabel>{t("r1.wheel.post.story_type.option5")}</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">
                          {t("r1.wheel.post.name.title")}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={t("r1.wheel.post.name.placeholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">{t("r1.wheel.post.email.title")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("r1.wheel.post.email.placeholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Graphic Card Name */}
                  <FormField
                    control={form.control}
                    name="gpu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">
                          {t("r1.wheel.post.graphic_card.title")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("r1.wheel.post.graphic_card.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Story Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">{t("r1.wheel.post.story.title")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("r1.wheel.post.story.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-lg mb-0">{t("r1.wheel.post.story_content.title")}</p>
                  <p className="text-sm mb-4">
                    Choose one to answer or you may answer both!
                  </p>

                  {/* Story Content Text */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("r1.wheel.post.story_content.text")}</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Video Url */}
                  <FormField
                    control={form.control}
                    name="ytlink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("r1.wheel.post.story_content.link")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("r1.wheel.post.story_content.link_placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>
                          <p>{t("r1.wheel.post.picture.title")}</p>
                          <ImageUp className="w-5 h-5" />
                          <small>{t("r1.wheel.post.picture.sub_title")}</small>
                        </FormLabel>
                        <small>{t("r1.wheel.post.picture.remark")}</small>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files?.[0]); // ✅ 取第一張圖
                            }}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 預覽圖片 */}
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded"
                    />
                  ) : defaultValues?.imageId ? (
                    <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                      <p className="text-sm text-gray-500">{t("r1.wheel.post.picture.sub_title")}</p>
                    </div>
                  ) : null}

                  {/* 按鈕 */}
                  <div
                    className={cn(
                      "w-full flex gap-4 my-16",
                      isMobile && "flex-col gap-8"
                    )}
                  >
                    <Button
                      onClick={() => {
                        setOpen(false);
                        closeSelectDialog?.();
                      }}
                      className="buttonn-border-gradient flex-1"
                    >
                      {t("r1.wheel.post.cancel_button")}
                    </Button>
                    <Button
                      className="botton-background-gradient text-black cursor-pointer flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : t("r1.wheel.post.submit_button")}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div
                className={cn(
                  "flex flex-col gap-12",
                  isMobile ? "w-full" : "max-w-[720px]"
                )}
              >
                {/* Type 選項 */}
                <RadioGroup
                  value={form.getValues("section")}
                  className={cn("flex gap-6", isMobile && "flex-col")}
                  disabled
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={StoryType.HugeASUSFans}
                      id="HugeASUSFans"
                    />
                    <Label htmlFor="HugeASUSFans">
                      {t("r1.wheel.post.story_type.option1")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={StoryType.SpecialFeatures}
                      id="SpecialFeatures"
                    />
                    <Label htmlFor="SpecialFeatures">
                      {t("r1.wheel.post.story_type.option2")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={StoryType.FavoriteMoment}
                      id="FavoriteMoment"
                    />
                    <Label htmlFor="FavoriteMoment">
                      {t("r1.wheel.post.story_type.option3")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={StoryType.TheGamer} id="TheGamer" />
                    <Label htmlFor="TheGamer">
                      {t("r1.wheel.post.story_type.option4")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={StoryType.MyOwnStory}
                      id="MyOwnStory"
                    />
                    <Label htmlFor="MyOwnStory">
                      {t("r1.wheel.post.story_type.option5")}
                    </Label>
                  </div>
                </RadioGroup>

                {/* Name */}
                <div>
                  <p>{t("r1.wheel.post.name.title")}</p>
                  <p className="text-2xl mt-2">{form.getValues("name")}</p>
                </div>

                {/* Email */}
                <div>
                  <p>{t("r1.wheel.post.email.title")}</p>
                  <p className="text-2xl mt-2">{form.getValues("email")}</p>
                </div>

                {/* Graphic Card Model Name */}
                <div>
                  <p>{t("r1.wheel.post.graphic_card.title")}</p>
                  <p className="text-2xl mt-2">{form.getValues("gpu")}</p>
                </div>

                {/* Story Title */}
                <div>
                  <p>{t("r1.wheel.post.story.title")}</p>
                  <p className="text-2xl mt-2">{form.getValues("title")}</p>
                </div>

                {/* Story Content & Video Link */}
                <div>
                  <p className="text-xl mb-0">{t("r1.wheel.post.story_content.title")}</p>
                  <p className="text-sm mb-4">
                    Choose one to answer or you may answer both!
                  </p>
                  {form.getValues("content") && (
                    <>
                      <p>{t("r1.wheel.post.story_content.text")}</p>
                      <p className="text-2xl mt-2">
                        {form.getValues("content")}
                      </p>
                    </>
                  )}
                  {form.getValues("ytlink") && (
                    <>
                      <p>{t("r1.wheel.post.story_content.link")}</p>
                      <p className="text-2xl mt-2">
                        {form.getValues("ytlink")}
                      </p>
                    </>
                  )}
                </div>

                {/* Image */}
                <div>
                  <div className="flex gap-2">
                    <p>{t("r1.wheel.post.picture.title")}</p>
                    <ImageUp className="w-5 h-5" />
                    <small>{t("r1.wheel.post.picture.sub_title")}</small>
                  </div>
                  <small>{t("r1.wheel.post.picture.remark")}</small>
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded"
                    />
                  ) : defaultValues?.imageId ? (
                    <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                      <p className="text-sm text-gray-500">{t("r1.wheel.post.picture.sub_title")}</p>
                    </div>
                  ) : null}
                </div>

                {/* 按鈕 */}
                <div
                  className={cn(
                    "w-full flex gap-4 my-16",
                    isMobile && "flex-col gap-8"
                  )}
                >
                  <Button
                    className="buttonn-border-gradient flex-1"
                    type="button"
                    onClick={() => setMode("edit")}
                  >
                    Back to Edit
                  </Button>
                  <Button
                    type="button"
                    className="botton-background-gradient text-black cursor-pointer flex-1"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            )}

            {/* 表單送出成功的視窗 - 移到外層 Portal */}
            {showStorySubmitted &&
              createPortal(
                <StorySubmitted
                  open={showStorySubmitted}
                  setOpen={(value) => {
                    console.log("StorySubmitted setOpen 被調用，value:", value);
                    setShowStorySubmitted(value);
                    if (!value) {
                      // 當成功視窗關閉時，也關閉編輯視窗
                      setOpen(false);
                      closeSelectDialog?.();
                      // 重置加點狀態
                      setPointAdded(false);
                      setPointMsg("");
                      setSubmittedArticleId(null);
                      setSubmittedArticleData(null);
                      // 重置表單資料，避免 preview 還看到舊內容
                      form.reset();
                      // 重置上傳的圖片資料
                      setUploadedImageData(null);
                      // 重置模式回到編輯狀態
                      setMode("edit");
                      // 在對話框關閉時調用回調函數
                      onStorySubmitted?.();
                    }
                  }}
                  pointMsg={pointMsg}
                  articleId={submittedArticleId}
                  userId={userData?.userId}
                  articleData={submittedArticleData}
                  onCloseToMap={onCloseToMap}
                />,
                parentNode &&
                  typeof parentNode !== "string" &&
                  parentNode.current
                  ? parentNode.current
                  : document.body
              )}
          </motion.div>,
          parentNode && typeof parentNode !== "string" && parentNode.current
            ? parentNode.current
            : document.body
        )}
    </>
  );
};

export default StoryForm;
