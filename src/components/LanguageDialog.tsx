import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { useState, useEffect } from "react";

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

export default function LanguageDialog() {
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
  }, [i18n]);

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

  return (
    <div className=" absolute md:absolute top-[3%] md:top-[0.5%] right-0 md:right-4 z-40 font-RobotoRegular">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            aria-label="Select Language"
            className=" cursor-pointer aspect-square bg-black/80 hover:bg-black/70 text-white p-3 rounded-xl transition-all duration-300 backdrop-blur-sm"
          >
            <Languages className="!size-6 md:!size-10" />
          </button>
        </DialogTrigger>
        <DialogContent
          className=" sm:max-w-[425px] backdrop-blur-sm bg-black/50 text-white border border-white/20"
          style={{
            background:
              "linear-gradient(27deg,rgba(20, 156, 255, .7) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .7) 100%)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold font-TTNormsProMedium">
              Select Language
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="grid grid-cols-1 gap-2 mt-4">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                className="bg-black/30 text-xl border border-white/20 text-zinc-300 hover:bg-black/50 hover:text-white  cursor-pointer  font-RobotoRegular"
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.label}
              </Button>
            ))}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
