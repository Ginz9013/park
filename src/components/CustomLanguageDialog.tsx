import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "繁體中文" },
  { code: "ae", label: "العربية" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "jp", label: "日本語" },
  { code: "kr", label: "한국어" },
];

const LANGUAGE_STORAGE_KEY = "asus-themepark-language";
const FIRST_VISIT_KEY = "asus-themepark-first-visit";
const LANGUAGE_EXPIRY_KEY = "asus-themepark-language-expiry";

// 設定語言選擇的有效期（例如 30 天）
const LANGUAGE_EXPIRY_DAYS = 30;

interface CustomLanguageDialogProps {
  // 是否為 ThemePark 頁面
  isThemePark?: boolean;
  positionStyle?: string;
}

export default function CustomLanguageDialog({
  isThemePark = false,
  positionStyle,
}: CustomLanguageDialogProps) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  // 檢查語言設定是否過期
  const isLanguageExpired = () => {
    const expiryTime = localStorage.getItem(LANGUAGE_EXPIRY_KEY);
    if (!expiryTime) return true;

    const now = new Date().getTime();
    const expiry = parseInt(expiryTime);
    return now > expiry;
  };

  // 檢查是否為首次訪問
  useEffect(() => {

    // LandingPage 頁面：正常的語言選擇邏輯
    const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const isExpired = isLanguageExpired();

    if (!hasVisited) {
      // 首次訪問，自動彈出語言選擇
      setOpen(true);
      localStorage.setItem(FIRST_VISIT_KEY, "true");
    } else if (!savedLanguage || isExpired) {
      // 不是首次訪問，但沒有保存的語言設定或已過期，也自動彈出
      setOpen(true);
      // 清除過期的語言設定
      if (isExpired) {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        localStorage.removeItem(LANGUAGE_EXPIRY_KEY);
      }
    }
  }, [i18n, isThemePark]);

  const handleLanguageChange = (languageCode: string) => {
    // 保存語言選擇到 localStorage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);

    // 設定過期時間（30天後）
    const expiryTime =
      new Date().getTime() + LANGUAGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(LANGUAGE_EXPIRY_KEY, expiryTime.toString());

    // 切換語言
    i18n.changeLanguage(languageCode);

    // 關閉對話框
    setOpen(false);
  };

  // 處理背景點擊關閉
  const handleBackdropClick = (e: React.MouseEvent) => {
    console.log("click");
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  // 處理 ESC 鍵關閉
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  return (
    <div className={cn(
      "absolute md:absolute top-[3%] md:top-[0.5%] right-0 md:right-4 z-60 font-RobotoRegular",
      positionStyle,
    )}>
      {/* 觸發按鈕 - 只在非 ThemePark 頁面顯示 */}
      {!isThemePark && (
        <button
          aria-label="Select Language"
          className="cursor-pointer aspect-square bg-black/80 hover:bg-black/70 text-white p-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
          onClick={() => setOpen(true)}
        >
          <Languages className="!size-6 md:!size-10" />
        </button>
      )}

      {/* 自定義 Dialog */}
      <AnimatePresence>
        {open && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleBackdropClick}
            />

            {/* Dialog 內容 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center "
              // onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-[45%] sm:max-w-[455px] backdrop-blur-sm bg-black/50 text-white border border-white/20 rounded-lg px-8 py-10 relative"
                style={{
                  background:
                    "linear-gradient(27deg,rgba(20, 156, 255, .7) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .7) 100%)",
                }}
              >
                {/* 關閉按鈕 */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                  aria-label="Close dialog"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                {/* Dialog 標題 */}
                <div className="mb-4 pr-8">
                  <h2 className="text-3xl font-bold font-TTNormsProMedium text-center">
                    Select Language
                  </h2>
                </div>

                {/* 語言選項 */}
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      className="bg-black/30 text-xl border border-white/20 text-zinc-300 hover:bg-black/50 hover:text-white cursor-pointer font-RobotoRegular"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
