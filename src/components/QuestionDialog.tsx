import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { authService } from "../services/authService";
import { playSound } from "../utils/sound";
import { useAuth } from "@/contexts/AuthContext";
import { refetch } from "@/store/mission";
import { FIRST_ROLLER_TEST_POINT_RULE_ID, DAILY_ROLLER_TEST_POINT_RULE_ID } from "@/types/pointRule";


interface QuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestions: string[];
  onComplete: (results: QuestionResult[]) => void;
  onRetry: () => void;
  hasEarnedFirstTest: boolean;
}

interface QuestionResult {
  questionName: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuestionContent {
  title: string;
  options: Record<string, string>;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  isOpen,
  onClose,
  selectedQuestions,
  onComplete,
  onRetry,
  hasEarnedFirstTest,
}) => {
  const { t } = useTranslation();
  const { refreshAuth } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  // const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResultPage, setShowResultPage] = useState(false);
  const [showIntroPage, setShowIntroPage] = useState(true);
  const [apiStats, setApiStats] = useState<{
    correctCount: number;
    wrongCount: number;
    score: number;
  } | null>(null);
  const [pointAdded, setPointAdded] = useState(false);
  const [pointMsg, setPointMsg] = useState<string>("");

  // 使用 useMemo 緩存所有題目內容
  const questionContents = useMemo(() => {
    const contents: Record<string, QuestionContent> = {};

    selectedQuestions.forEach((questionName) => {
      if (!questionName || questionName.length < 2) {
        console.error("無效的題目名稱:", questionName);
        return;
      }

      const category = questionName.charAt(0); // A 或 B
      const number = questionName.slice(1); // 01, 02, 03...

      try {
        const questionData = t(`question.${category}.${number}`, {
          returnObjects: true,
        }) as QuestionContent;
        contents[questionName] = questionData;
        console.log(`緩存題目 ${questionName}:`, questionData);
      } catch (error) {
        console.error(`無法取得題目 ${questionName}:`, error);
      }
    });

    return contents;
  }, [selectedQuestions, t]);

  // 取得題目內容的輔助函數（現在從緩存中取得）
  const getQuestionContent = (questionName: string): QuestionContent | null => {
    return questionContents[questionName] || null;
  };

  // 重置狀態
  useEffect(() => {
    if (isOpen) {
      console.log("QuestionDialog 開啟，selectedQuestions:", selectedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setIsSubmitting(false);
      setResults([]);
      setUserAnswers({});
      setShowResultPage(false);
      setShowIntroPage(true);
      setApiStats(null);
      setPointAdded(false);
    }
  }, [isOpen, selectedQuestions]);

  // 計算結果統計 - 優先使用 API 提供的資料
  const correctCount =
    apiStats?.correctCount ??
    results.filter((result) => result.isCorrect).length;
  const totalQuestions = results.length;
  const isAllCorrect = correctCount === totalQuestions && totalQuestions > 0;

  // 加點邏輯 - 當全對且結果頁面顯示時執行
  useEffect(() => {
    const addPoints = async () => {
      if (showResultPage && isAllCorrect && !pointAdded) {
        try {
          // 先獲取用戶資訊
          const userInfo = await authService.getUserMe();
          const userId = userInfo.data?.userId;
          setPointMsg("");

          if (userId) {
            if (!hasEarnedFirstTest) {
              const result = await authService.addPointFirstTest(userId);
              if (result && result.status === "Failed") {
                if (result.message === "不符合得分條件") {
                  // 已經加過點了，標記為已加點但不顯示錯誤
                  setPointAdded(false);
                  setPointMsg("");
                  console.log("已經加過點了");
                } else {
                  setPointMsg("");
                }
              } else {
                // ------ 初次答題成功 ------
                // 建立任務紀錄
                await authService.createMissionRecord(FIRST_ROLLER_TEST_POINT_RULE_ID);
                // 更新任務清單
                refetch();

                // 成功加點
                setPointAdded(true);
                setPointMsg("+3 Points");
                refreshAuth();
                console.log("積分加點成功！");
              }
            } else {
              const result = await authService.addPointTest(userId);
              if (result && result.status === "Failed") {
                if (result.message === "不符合得分條件") {
                  // 已經加過點了，標記為已加點但不顯示錯誤
                  setPointAdded(false);
                  setPointMsg("");
                  console.log("已經加過點了");
                } else {
                  setPointMsg("");
                }
              } else {
                // ------ 每日答題成功 ------
                // 建立任務紀錄
                await authService.createMissionRecord(DAILY_ROLLER_TEST_POINT_RULE_ID);
                // 更新任務清單
                refetch();

                // 成功加點
                setPointAdded(true);
                setPointMsg("+1 Point");
                refreshAuth();
                console.log("積分加點成功！");
              }
            }
          }
        } catch (error) {
          console.error("加點失敗:", error);
        }
      }
    };

    addPoints();
  }, [showResultPage, isAllCorrect, hasEarnedFirstTest, pointAdded]);

  // 處理答案選擇
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);

    // 保存用戶答案
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));

    // 如果不是最後一題，自動進入下一題
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer("");
      }, 500); // 0.5秒延遲，讓用戶看到選擇效果
    }
  };

  // 回上一題
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || "");
    }
  };

  // 提交所有答案到 API
  const submitAllAnswers = async () => {
    setIsSubmitting(true);

    try {
      // 準備提交的數據
      const answers = selectedQuestions.map((questionName, index) => ({
        questionName,
        userAnswer: userAnswers[index] || "",
      }));

      console.log("準備提交的答案:", answers);

      // 使用 authService.submitAnswer
      const response = await authService.submitAnswer(answers);
      console.log("API 回應:", response);

      // 儲存 API 統計資料
      if (response.data) {
        setApiStats({
          correctCount: response.data.correctCount,
          wrongCount: response.data.wrongCount,
          score: response.data.score,
        });
      }

      // 處理結果 - 根據實際 API 回應格式
      const questionResults: QuestionResult[] = selectedQuestions.map(
        (questionName, index) => {
          // 從 API 回應的 details 中找到對應的題目結果
          const detail = response.data?.details?.find(
            (d: any) => d.questionName === questionName
          );

          return {
            questionName,
            userAnswer: userAnswers[index] || "",
            isCorrect: detail?.isCorrect || false,
          };
        }
      );

      setResults(questionResults);
      setShowResultPage(true);
      onComplete(questionResults);
      // 播放結果音效
      const isAllCorrect = questionResults.every((result) => result.isCorrect);
      if (isAllCorrect) {
        playSound("./sound/test_success.wav");
      } else {
        playSound("./sound/test_fail.wav");
      }
    } catch (error) {
      console.error("提交答案失敗:", error);
      // 暫時使用模擬結果
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重新回答
  const handleRetry = () => {
    setShowResultPage(false);
    setShowIntroPage(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setUserAnswers({});
    setResults([]);
    setApiStats(null);
    setPointAdded(false);
    onRetry();
  };

  const currentQuestionName = selectedQuestions[currentQuestionIndex];
  const currentQuestionContent = getQuestionContent(currentQuestionName);

  const isLastQuestion = currentQuestionIndex === selectedQuestions.length - 1;
  const allQuestionsAnswered =
    Object.keys(userAnswers).length === selectedQuestions.length;

  // 防護檢查：確保有有效的題目陣列
  if (!isOpen || !selectedQuestions || selectedQuestions.length === 0)
    return null;

  // 防護檢查：確保當前題目索引有效
  if (currentQuestionIndex >= selectedQuestions.length) return null;

  // 防護檢查：確保當前題目內容有效
  if (!currentQuestionContent || !currentQuestionName) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative rounded-2xl pt-14 p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
            style={{
              background:
                "linear-gradient(65deg,rgba(20, 156, 255, .5) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .5) 100%)",
            }}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* 前言頁面 */}
            {showIntroPage ? (
              <div className="text-white text-center">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-6 font-TTNormsProMedium">
                    Ready for answering the question？
                  </h1>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg shadow-lg mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowIntroPage(false)}
                    className="bg-gradient-to-r from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg shadow-lg mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : showResultPage ? (
              <div className="text-white">
                {/* 結果標題 */}
                <div className="text-center mb-8">
                  {isAllCorrect ? (
                    <>
                      <div className="flex justify-center mb-4">
                        <img
                          src="./images/wheel/video-finished.png"
                          alt=""
                          className="w-[20%]"
                        />
                      </div>
                      <h1 className="text-4xl  mb-4 font-TTNormsProMedium">
                        You Got It!
                      </h1>

                      {/* 全對提示 */}

                      <div className="text-2xl  mb-4 ">
                        {t("r1.roller.question.answer_Correct")}
                      </div>
                      {pointMsg && pointMsg !== "" && (
                        <div className=" text-2xl  mb-4 e">{pointMsg}</div>
                      )}
                    </>
                  ) : (
                    <h1 className="text-3xl  mb-4">{t("r1.roller.question.answer_Incorrect")}</h1>
                  )}
                </div>

                {/* 操作按鈕 */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={onClose}
                    className=" bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition cursor-pointer"
                  >
                    {t("r1.roller.question.close_button")}
                  </Button>
                  <Button
                    onClick={handleRetry}
                    className="  bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition cursor-pointer"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    {t("r1.roller.question.retry_button")}
                  </Button>
                </div>
              </div>
            ) : (
              /* 答題頁面 */
              <>
                {/* 進度條 */}
                <div className="mb-6">
                  <div className="flex justify-between text-white/80 text-xl mb-2">
                    <span className="font-bold ">{t("r1.roller.question.title")}</span>
                    <span>
                      {currentQuestionIndex + 1} / {selectedQuestions.length}
                    </span>
                  </div>
                </div>

                {/* 題目內容 */}
                <div className="mb-6">
                  <h2 className="text-white text-xl text-center font-bold mb-4">
                    {currentQuestionContent.title}
                  </h2>

                  {/* 選項 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(currentQuestionContent.options).map(
                      ([key, value]) => (
                        <button
                          key={key}
                          onClick={() => handleAnswerSelect(key)}
                          disabled={isSubmitting}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            selectedAnswer === key
                              ? "btn-glow  bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition"
                              : " bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition"
                          } ${
                            isSubmitting
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <span className="font-bold mr-3">{key}.</span>
                          {value}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="flex gap-3 justify-between">
                  {/* 回上一題按鈕 */}
                  {currentQuestionIndex > 0 && (
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={isSubmitting}
                      variant="outline"
                      className="border-white/20 text-black hover:bg-white/80 cursor-pointer"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Back
                    </Button>
                  )}

                  {/* 提交答案按鈕 - 只在最後一題且所有題目都回答過時顯示 */}
                  {isLastQuestion && allQuestionsAnswered && (
                    <Button
                      onClick={() => {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                          event: "data_layer_event",
                          event_name_ga4: "click_Quiz_send_answers",
                          event_category_DL: "buttons",
                          event_action_DL: "clicked",
                          event_label_DL: "Quiz_send_answers",
                          event_value_DL: "",
                        });
                        submitAllAnswers();
                      }}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r cursor-pointer from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 ml-auto"
                    >
                      {isSubmitting ? "Submiting..." : t("r1.roller.question.submit")}
                    </Button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestionDialog;
