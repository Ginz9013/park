import { useState, useEffect } from "react";
import { motion } from "motion/react";
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import CustomLanguageDialog from "./CustomLanguageDialog";
import useMobile from "../hooks/useMobile";

// 為 dataLayer 添加類型定義
declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface CountdownTimerProps {
  onCountdownEnd: () => void;
  targetDate?: Date;
  initialTime?: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  onCountdownEnd,
  targetDate,
  initialTime,
}: CountdownTimerProps) {
  const { t, i18n } = useTranslation();
  const { isMobile } = useMobile();
  const isRTL = i18n.language === "ae";

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [isRTL]);
  const calculateTimeLeft = () => {
    if (initialTime) {
      return {
        days: initialTime.days ?? 0,
        hours: initialTime.hours ?? 0,
        minutes: initialTime.minutes ?? 0,
        seconds: initialTime.seconds ?? 0,
      };
    }

    const now = new Date();
    const target = targetDate
      ? new Date(targetDate)
      : new Date("2025-07-08T11:00:00+08:00");
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [countdown, setCountdown] = useState<CountdownState>(
    calculateTimeLeft()
  );

  //
  // 台灣時間
  const eventDate = new Date("2025-07-08T11:00:00+08:00"); // 建議加上 Z (UTC)
  const eventEnd = new Date("2025-07-08T12:00:00+08:00");

  const eventTitle = "ASUS Graphics Card 30th Anniversary Theme Park";
  const eventDescription =
    "Join us in celebrating three decades of innovation and excellence in graphics technology!";

  // ✅ 1. Google 用的 datetime 格式要無 - : .（且是 UTC 時間）
  const formatGoogleDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const googleStart = formatGoogleDate(eventDate);
  const googleEnd = formatGoogleDate(eventEnd);

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&details=${encodeURIComponent(
    eventDescription
  )}&dates=${googleStart}/${googleEnd}`;

  const googleCalendarUrl = `https://accounts.google.com/ServiceLogin?continue=${encodeURIComponent(
    calendarUrl
  )}`;

  useEffect(() => {
    // 如果所有時間都是 0，直接結束倒數
    if (
      countdown.days === 0 &&
      countdown.hours === 0 &&
      countdown.minutes === 0 &&
      countdown.seconds === 0
    ) {
      onCountdownEnd();
      return;
    }

    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setCountdown(timeLeft);

      if (
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0
      ) {
        clearInterval(timer);
        onCountdownEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, initialTime, onCountdownEnd]);

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-start bg-[#000]   overflow-x-hidden font-RobotoRegular ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      {/* 頁面主標題 */}

      <div
        className="relative h-[65vh]  md:min-h-screen flex flex-col items-center justify-start  overflow-x-hidden w-full "
        style={{
          backgroundImage: "url('./images/bg02-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <CustomLanguageDialog isThemePark={false} />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#25252500] via-[#00000000] to-[#000000]  "></div>
        <div className="absolute top-[30%] md:top-[28%] right-[-70%]  md:right-0 w-[150%] md:w-[50%] ">
          <motion.img
            src="./images/bg02-2.png"
            alt=""
            className="w-full "
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: {
                opacity: 1,
                x: [200, 0],
                y: [0, -20, 0],
                transition: {
                  opacity: { duration: 1.5, ease: "easeOut" },
                  x: {
                    duration: 1,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                },
              },
            }}
            initial="hidden"
            animate="visible"
          />
        </div>
        <div className="w-10/12 md:w-10/12 mx-auto flex flex-col items-center justify-between h-screen ">
          <div className="pt-10 text-center z-10 ">
            <h1 className="font-TTNormsProMedium text-3xl md:text-5xl font-semibold text-white mb-2 drop-shadow-lg text-shadow-[0_0_15px_#FB8DE9]">
              {t("welcome")}
            </h1>
            <h2 className="font-TTNormsProMedium text-xl md:text-3xl text-white font-light mb-2 drop-shadow-lg text-shadow-[0_0_15px_#fff] my-4">
              {t("subtitle")}
            </h2>
          </div>

          {/* 行動按鈕區塊 */}

          {/* Calendar Dialog */}
        </div>
      </div>

      {/* 活動說明 */}
      <div className="relative z-10 text-center  py-6 w-[85%] md:w-[80%] mx-auto ">
        <div className="absolute -top-[5%] -left-[30%] -z-10 w-[55%]">
          <img src="./images/g03.png" alt="" className="w-full" />
        </div>
        <div className="absolute -top-[30%] -right-[25%] -z-10 w-[60%]">
          <img src="./images/g04.png" alt="" className="w-full" />
        </div>
        {/* 倒數計時區塊 */}
        <h1 className="font-TTNormsProMedium text-4xl md:text-4xl  text-[#C1BCFA] my-[6%] md:my-[4%] drop-shadow-lg text-shadow-[0_0_15px_#C1BCFA]">
          {t("celebration")}
        </h1>
        <div className="relative z-10  mx-auto  md:w-8/12 h-full mt-6 md:mt-0 mb-6 md:mb-12">
          <div className="flex justify-center gap-3 md:gap-5 w-full ">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Minutes" },
              { value: countdown.seconds, label: "Seconds" },
            ].map((item, index, arr) => (
              <React.Fragment key={index}>
                <div
                  className="
                    gradient-box3 
                    text-center
                    backdrop-blur-sm
                    bg-gradient-to-t from-[#6E00FF] to-[#000]
                    flex flex-col items-center justify-center
                    rounded-2xl
                     w-1/5 py-2 md:w-1/5 aspect-[9/10] md:py-0
                  "
                >
                  <div className="text-xl md:text-[4vw] font-semibold mb-[1%] text-white ">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-white font-semibold text-sm md:text-2xl ">
                    {item.label}
                  </div>
                </div>
                {index < arr.length - 1 && (
                  <div className="flex items-center justify-center text-4xl md:text-5xl font-semibold text-white">
                    :
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "data_layer_event",
            event_name_ga4: "add_to_google_calendar",
            event_category_DL: "outbound-links",
            event_action_DL: "clicked",
            event_label_DL: "Google Calendar",
            event_value_DL: "",
          });
        }}
        className=" cursor-pointer btn-glow text-xl md:text-2xl bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition"
      >
        {t("add_to_calendar")}
      </a>
      {/* <CalendarDialog
        isOpen={isCalendarDialogOpen}
        onClose={() => setIsCalendarDialogOpen(false)}
      /> */}

      {/* 其實不用分兩段但這樣會更好控制後面的顏色 */}

      <div className="relative z-10 text-center  py-6 w-[95%] md:w-[80%] mx-auto ">
        <div className="absolute bottom-[15%] -left-[25%] -z-10 w-[54%]">
          <img src="./images/g05.png" alt="" className="w-full" />
        </div>
        <div className="absolute bottom-[7%] right-[28%] -z-10 w-[54%]">
          <img src="./images/g06.png" alt="" className="w-full" />
        </div>
        <div className="absolute bottom-[0%] -right-[38%] -z-10 w-[54%]">
          <img src="./images/g07.png" alt="" className="w-full" />
        </div>
        <div className="mb-12 px-[5%]">
          <p className="font-TTNormsProMedium font-normal mb-4 text-[#C1BCFA] text-2xl md:text-4xl text-center text-shadow-[0_0_15px_#CFAFFF]">
            {t("section_1_title")}
          </p>
          <p className="text-white text-left md:text-center text-lg md:text-2xl md:px-6">
            {t("section_1_subtitle")}
          </p>
          <div className="w-full flex items-center justify-center gradient-box py-[5%] px-6 md:px-10  relative  my-12  ">
            <div
              className={`  absolute top-0 left-0 w-full h-full opacity-50 -z-10 rounded-4xl ${
                isMobile ? "opacity-[0.2]" : "opacity-50"
              }`}
              style={{
                backgroundImage: "url('./images/0628/banner01_2x.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "100% 70%",
              }}
            ></div>
            <div className="absolute top-[-12%] md:top-[50%] right-[-10%] md:right-[3%] z-10 w-[45%] md:w-[30%]  md:-translate-y-1/2 ">
              <img src="./images/p02.png" alt="" className=" origin-center" />
            </div>
            <div
              className={`md:w-[70%]   ${
                isRTL ? "text-right order-2" : "text-left order-1"
              }`}
            >
              <p className="text-[#C1BCFA] font-TTNormsProMedium  text-2xl md:text-4xl ">
                <Trans
                  i18nKey="section_2_title"
                  components={{
                    br: <br />,
                  }}
                />
              </p>
              <p className="text-white text-lg md:text-2xl  mt-6">
                <Trans
                  i18nKey="section_2_subtitle"
                  components={{
                    br: <br />,
                  }}
                />
              </p>
            </div>
            <div
              className={`text-white w-full md:w-1/2 ${
                isRTL ? "order-1" : "order-2"
              }`}
            >
              {/* <img src=\"/your-ferris-wheel.png\" alt=\"Ferris Wheel\" className=\"w-32 h-32 object-contain\" /> */}
            </div>
            <div className="absolute -top-1 -right-[20%] -z-10 w-[58%]">
              <img src="./images/g01.png" alt="" className="w-full" />
            </div>
          </div>
        </div>

        <div className="mb-12 px-[5%]">
          <p className="font-TTNormsProMedium font-semibold mb-12 text-[#C1BCFA] text-4xl text-center text-shadow-[0_0_15px_#CFAFFF]">
            {t("section_3_title")}
          </p>

          <div className=" gradient-box w-full flex items-center justify-center  relative  aspect-[16/8] md:aspect-[16/7.6]  overflow-hidden group">
            <div
              className="absolute top-0 left-0 w-full h-full  -z-10 rounded-4xl  group-hover:brigh"
              style={{
                backgroundImage: "url('./images/0628/prize_2x.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "100% 100%",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
