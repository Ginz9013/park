// @ts-ignore
import { motion } from "motion/react";
// import { useSupportsHEVCAlpha, useIsIOS } from "@/hooks/useSupportsHEVCAlpha";
import { X } from "lucide-react";
// import AsusLogin from "./AsusLogin";
// import { playSound } from "@/utils/sound";
import { useState, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import useMobile from "@/hooks/useMobile";
import { createPortal } from "react-dom";

interface TalkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | string[];
  videoSrc: string;
  style?: React.CSSProperties;
  onAction: () => void;
  boxStyle?: React.CSSProperties;
  isAuthenticated: boolean;
  setShowTerms: (show: boolean) => void;
  loginInfo: boolean;
  notOpen: boolean;
  parentNode?: React.RefObject<HTMLDivElement | null>;
}

const TalkDialog: React.FC<TalkDialogProps> = ({
  isOpen,
  onClose,
  // title,
  content,
  videoSrc,
  style,
  onAction,
  boxStyle,
  isAuthenticated,
  setShowTerms,
  loginInfo,
  notOpen,
  parentNode,
}) => {
  // const supportsHEVCAlpha = useSupportsHEVCAlpha();
  // const isIOS = useIsIOS();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  // const { t } = useTranslation();
  // const { isMobile } = useMobile();

  // 使用 useRef 來確保隨機選擇只在首次渲染時執行
  const selectedContentRef = useRef<string>("");

  // 只在首次渲染時選擇隨機文字
  if (selectedContentRef.current === "") {
    if (Array.isArray(content)) {
      const randomIndex = Math.floor(Math.random() * content.length);
      selectedContentRef.current = content[randomIndex];
    } else {
      selectedContentRef.current = content;
    }
  }

  if (!isOpen) return null;

  // 彈跳視窗內容，單獨拉出來
  const dialogContent = <>
    {isAuthenticated ? (
      <>
        <div className="text-left text-white/80">
          <h1 className="text-glow my-5 text-xl text-[#00FFFF] border-b border-[#00FFFF] pb-2">
            asdfdasfasf
          </h1>
          <p className="text-gray-200 hover:text-gray-100">
            asdfsafa
          </p>

          {!notOpen && (
            <div
              className="mt-6 text-center w-full bg-gradient-to-r border border-white/60  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition"
              onClick={(e) => {
                // window.dataLayer = window.dataLayer || [];
                // window.dataLayer.push({
                //   event: "data_layer_event",
                //   event_name_ga4: `click_go ${title}`,
                //   event_category_DL: "buttons",
                //   event_action_DL: "clicked",
                //   event_label_DL: `${title}_go`,
                //   event_value_DL: "",
                // });
                // playSound("./sound/click_unit.wav");
                // 阻止事件往父層冒泡
                e.stopPropagation();
                onAction();
              }}
            >
              GO
            </div>
          )}
        </div>
      </>
    ) : (
      <div className="text- text-white/80">
        <h1 className="text-glow my-3 sm:my-5 text-lg sm:text-xl text-[#00FFFF] border-b border-[#00FFFF] pb-2 font-TTNormsProMedium">
          sadfasdf
        </h1>

        <p className="text-gray-200 hover:text-gray-100 text-sm sm:text-base">
          adfsaf
        </p>
        {loginInfo && (
          <>
            <div className="flex items-start gap-2 mt-4 sm:mt-6">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer mt-1"
                checked={isPolicyAccepted}
                onChange={(e) => setIsPolicyAccepted(e.target.checked)}
              />
              <p
                className="text-gray-200 hover:text-gray-100 cursor-pointer text-xs sm:text-sm leading-relaxed"
                onClick={() => setIsPolicyAccepted(!isPolicyAccepted)}
              >
                <a
                  className="text-blue-300 cursor-pointer hover:text-blue-400"
                  href="https://www.asus.com/terms_of_use_notice_privacy_policy/privacy_policy"
                >
                  asdfasdf
                </a>
              </p>
            </div>
            {/* I have read and accept the terms and conditions. */}
            <div className="flex items-start gap-2 mt-4 sm:mt-6">
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer mt-1"
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
              />
              <p
                className="text-gray-200 hover:text-gray-100 cursor-pointer text-xs sm:text-sm leading-relaxed"
                onClick={() => setIsTermsAccepted(!isTermsAccepted)}
              >
                <span
                  className="text-blue-300 cursor-pointer hover:text-blue-400"
                  onClick={() => setShowTerms(true)}
                >
                  asdfasdffdsaf
                </span>
              </p>
            </div>
            {/* <AsusLogin
              className={`mt-4 sm:mt-6 w-full border border-white/60 px-6 sm:px-10 py-2 sm:py-3 rounded-lg shadow-lg mb-2 transition ${
                isTermsAccepted && isPolicyAccepted
                  ? "bg-gradient-to-r from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black hover:from-[#39ACFF] hover:to-[#FF70C3] cursor-pointer"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
              }`}
              disabled={!isTermsAccepted || !isPolicyAccepted}
            >
              Log-in
            </AsusLogin> */}
          </>
        )}
      </div>
    )}
    <div className="absolute top-[4px] right-[2px]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="px-2 py-1 text-xs  text-white  transition cursor-pointer"
      >
        <X />
      </button>
    </div>
  </>;

  return (
    <div className="absolute" style={style}>
      {/* 如果是 Mobile 版，把對話視窗的內容透過 Portal 綁定到外層，並做到畫面置中的效果 */}
      {false ? createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center p-6"
        >
          <div className="relative btn-glow2 max-w-[450px] bg-gradient-to-r from-[#00000050] via-[#000000] to-[#00000080] text-white border border-white/0 rounded-xl p-4 max-h-[80vh] overflow-y-auto pointer-events-auto">
            {dialogContent}
          </div>
        </motion.div>,
        parentNode?.current ?? document.body
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.8, ease: "easeInOut" },
          }}
          exit={{
            opacity: 0,
            y: 10,
            transition: { duration: 0.2, delay: 0, ease: "easeInOut" },
          }}
          className="btn-glow2 sm:max-w-[450px] translate-x-1/2  bg-gradient-to-r from-[#00000050] via-[#000000] to-[#00000080] text-white border border-white/0 rounded-xl p-4 max-h-[80vh] overflow-y-auto pointer-events-auto"
          style={boxStyle}
        >
          {dialogContent}
        </motion.div> 
      )}
      
      {/* Omni 影片 */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.2 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.2, delay: 0.5, ease: "easeInOut" },
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.2,
          transition: { duration: 0.2, delay: 0, ease: "easeInOut" },
        }}
        className="w-[46%] mx-auto"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="max-w-full"
          style={{ pointerEvents: "none" }}
        >
           <source
              src={`${videoSrc.replace(".webm", "-1.mp4")}`}
              type="video/mp4"
            />
          {/* {supportsHEVCAlpha || isIOS ? (
            <source
              src={`${videoSrc.replace(".webm", "-1.mp4")}`}
              type="video/mp4"
            />
          ) : (
            <source src={videoSrc} type="video/webm" />
          )} */}
        </video>
      </motion.div>
    </div>
  );
};

export default TalkDialog;
