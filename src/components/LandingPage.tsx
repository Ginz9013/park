import { useRef, useState, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import CustomLanguageDialog from "./CustomLanguageDialog";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation, Trans } from "react-i18next";
import { CircleChevronRight, SquareArrowOutUpRight, Play } from "lucide-react";
import AudioController from "./AudioController";
import { useResponsiveTransform } from "../hooks/useResponsiveTransform";
import TermDialog from "./TermDialog";
import { playSound } from "@/utils/sound";
import LandingPageVideoDialog from "./Wheel/LandingPageVideoDialog";
import KolVideo from "@/utils/KOLVideo.json";

const gameCards = [
  {
    title: "landing_page.section_2_stage_2_title",
    date: "landing_page.section_2_stage_2_date",
    desc: "landing_page.section_2_stage_2_content",
    active: true,
    img: "slide1.jpg",
    link: "./#themepark",
  },
  {
    title: "landing_page.section_2_stage_1_title",
    date: "landing_page.section_2_stage_1_date",
    desc: "landing_page.section_2_stage_1_content",
    active: true,
    img: "slide2.jpg",
    link: "./#themepark",
  },
  // 射擊遊戲
  {
    title: "landing_page.section_2_stage_3_title",
    date: "landing_page.section_2_stage_3_date",
    desc: "landing_page.section_2_stage_3_content",
    active: true,
    img: "landing/Arcade.png",
    link: "./#themepark",
  },
  // 抽卡
  {
    title: "landing_page.section_2_stage_4_title",
    date: "landing_page.section_2_stage_4_date",
    desc: "landing_page.section_2_stage_4_content",
    active: true,
    img: "landing/card_collection.png",
    link: "./#themepark",
  },
  // Dream Craft
  {
    title: "landing_page.section_2_stage_5_title",
    date: "landing_page.section_2_stage_5_date",
    desc: "landing_page.section_2_stage_5_content",
    active: true,
    img: "landing/DreamCraft.png",
    link: "./#themepark",
  },
  // 找彩蛋
  {
    title: "landing_page.section_2_stage_6_title",
    date: "landing_page.section_2_stage_6_date",
    desc: "landing_page.section_2_stage_6_content",
    active: true,
    img: "landing/secret_mission.png",
    link: "./#themepark",
  },
  // 商店
  {
    title: "landing_page.section_2_stage_7_title",
    date: "landing_page.section_2_stage_7_date",
    desc: "landing_page.section_2_stage_7_content",
    active: true,
    img: "landing/shop.png",
    link: "./#themepark",
  },
  // 投票所
  {
    title: "landing_page.section_2_stage_8_title",
    date: "landing_page.section_2_stage_8_date",
    desc: "landing_page.section_2_stage_8_content",
    active: true,
    img: "landing/polling.png",
    link: "./#themepark",
  },
  // // 纜車
  // {
  //   title: "landing_page.section_2_stage_9_title",
  //   date: "landing_page.section_2_stage_9_date",
  //   desc: "landing_page.section_2_stage_9_content",
  //   active: true,
  //   img: "landing/cable_car.png",
  //   link: "./#themepark",
  // },
  // {
  //   title: "landing_page.section_2_stage_coming_soon",
  //   date: "",
  //   desc: "",
  //   active: false,
  //   img: "slide03.jpg",
  //   link: "./#themepark",
  // },
];
const prizeCards = [
  {
    title: "TOP1",
    subtitle1: "A special GeForce RTX 50 Series Graphics Card",
    Ga4_event_name: "GrandPrize_A_special_GeForce_RTX_50_Series_Graphics_Card",
    link1: "",
    subtitle2: "ROG Thor 1200w Platinum lll",
    Ga4_event_name2: "GrandPrize_ROG_Thor_1200w_Platinum_lll",
    link2: "",
    img: "0703/prize01.png",
  },
  {
    title: "TOP2",
    subtitle1: "TUF Gaming GeForce RTX 5080",
    Ga4_event_name1: "GrandPrize_TUF_Gaming_GeForce_RTX_5080",
    link1:
      "https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx5080-16g-gaming/",
    subtitle2: "TUF Gaming 1000W Gold",
    Ga4_event_name2: "GrandPrize_TUF_Gaming_1000W_Gold",
    link2:
      "https://www.asus.com/motherboards-components/power-supply-units/tuf-gaming/tuf-gaming-1000g/",
    img: "prize0627/prize02.png",
  },
  {
    title: "TOP3",
    subtitle1: "ProArt GeForce RTX 5080",
    Ga4_event_name1: "GrandPrize_ProArt_GeForce_RTX_5080",
    link1:
      "https://www.asus.com/motherboards-components/graphics-cards/proart/proart-rtx5080-16g/",
    subtitle2: "ROG Strix 1000W Platinum",
    Ga4_event_name2: "GrandPrize_ROG_Strix_1000W_Platinum",
    link2:
      "https://rog.asus.com/power-supply-units/rog-strix/rog-strix-1000p-gaming/",
    img: "prize0627/prize03.png",
  },
  {
    title: "TOP4",
    subtitle1: "ROG Strix GeForce RTX 5070 Ti",
    Ga4_event_name1: "GrandPrize_ROG_Strix_GeForce_RTX_5070_Ti",
    link1:
      "https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx5070ti-16g-gaming/",
    subtitle2: "ROG Strix 1000W Platinum",
    Ga4_event_name2: "GrandPrize_ROG_Strix_1000W_Platinum",
    link2:
      "https://rog.asus.com/power-supply-units/rog-strix/rog-strix-1000p-gaming/",
    img: "prize0627/prize04.png",
  },
];

const LuckyDrawPrizesData = [
  {
    title: "Phase1",
    date: "landing_page.phase1_date",
    prizes: [
      {
        title: "ROG Pelta x 1",
        img: "0702/phase1/p01.png",
        link: "https://rog.asus.com/headsets-audio/headsets/wireless-headsets/rog-pelta/",
        link2: "",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Pelta",
      },
      {
        title: "ROG Azoth x 1",
        img: "0702/phase1/p02.png",
        link: "https://rog.asus.com/keyboards/keyboards/compact/rog-azoth-model/",
        link2: "",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Azoth",
      },
      {
        title: "ROG Slash Backpack 4.0 x 1",
        link: "https://rog.asus.com/apparel-bags-gear/rog-slash/rog-slash-bag/rog-slash-backpack-4-0/",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Slash_Backpack_4_0",
        title2: "ROG Ombre Hoodie x 3",
        link2:
          "https://rog.asus.com/apparel-bags-gear/apparel/rog-ombre-hoodie/",
        Ga4_event_name2: "LuckyDrawPrize_ROG_Ombre_Hoodie",
        img: "0702/phase1/p03.png",
      },
    ],
  },
  {
    title: "Phase2",
    date: "landing_page.phase2_date",
    prizes: [
      {
        title: "ROG Delta II x 1",
        link: "https://rog.asus.com/headsets-audio/headsets/wireless-headsets/rog-delta-ii/",
        link2: "",
        img: "0702/phase2/p01.png",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Delta_II",
      },
      {
        title: "ROG Gladius lll Wireless AimPoint x 1",
        link: "https://rog.asus.com/mice-mouse-pads/mice/ergonomic-right-handed/rog-gladius-iii-wireless-aimpoint-model/",
        link2: "",
        img: "0702/phase2/p02.png",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Gladius_lll_Wireless_AimPoint",
      },
      {
        title: "ROG Archer Ergoair Gaming Backpack x 1",
        link: "https://rog.asus.com/apparel-bags-gear/bags/rog-archer-ergoair-gaming-backpack/",
        title2: "ROG Apex Windbreaker x 3",
        link2: "",
        img: "0702/phase2/p03.png",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Archer_Ergoair_Gaming_Backpack",
        Ga4_event_name2: "LuckyDrawPrize_ROG_Apex_Windbreaker",
      },
    ],
  },
  {
    title: "Phase3",
    date: "landing_page.phase3_date",
    prizes: [
      {
        title: "Dual GeForce RTX 5060 Ti x 2",
        link: "",
        img: "0702/phase3/p01.png",
        link2: "",
        Ga4_event_name1: "LuckyDrawPrize_Dual_GeForce_RTX_5060_Ti",
      },
      {
        title: "ROG STRIX Z890-A Gaming Wifi x 1",
        link: "",
        img: "0702/phase3/p02.png",
        link2: "",
        Ga4_event_name1: "LuckyDrawPrize_ROG_STRIX_Z890_A_Gaming_Wifi",
      },
      {
        title: "ROG Azoth Extreme x 1 ",
        link: "",
        img: "0702/phase3/p03.png",
        link2: "",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Azoth_Extreme",
      },
      {
        title: "ROG Harpe Ace Extreme x 1",
        link: "",
        img: "0702/phase3/p04.png",
        link2: "",
        Ga4_event_name1: "LuckyDrawPrize_ROG_Harpe_Ace_Extreme",
      },
    ],
  },
];

function LuckyDrawPrizesComponent() {
  const [activePhase, setActivePhase] = useState(0);
  const [activePhaseData, setActivePhaseData] = useState(
    LuckyDrawPrizesData[0]
  );
  const { getTransform } = useResponsiveTransform();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ae";

  return (
    <div className="mt-8 w-full">
      <div className="relative flex md:flex-row flex-col   justify-center items-center bg-black/50 border border-white/20 rounded-4xl md:rounded-full p-1 my-8 md:max-w-[80%] mx-auto">
        <div
          className="absolute p-1 top-0 left-0 md:h-full md:w-1/3 h-1/3 w-full  transition-transform duration-300 ease-in-out"
          style={{
            transform: getTransform(activePhase * 100),
          }}
        >
          <div className=" border-2  border-white/60  top-0 left-0  w-full h-full rounded-full bg-gradient-to-r from-[#0C5E99] via-[#149CFF] to-[#FF70C3] shadow-lg transition-transform duration-300 ease-in-out"></div>
        </div>
        {LuckyDrawPrizesData.map((phase, index) => (
          <button
            key={index}
            onClick={() => {
              if (isRTL) {
                const reverseIndex = 2 - index;
                setActivePhase(reverseIndex);
              } else {
                setActivePhase(index);
              }
              setActivePhaseData(LuckyDrawPrizesData[index]);
            }}
            className=" cursor-pointer relative z-10 md:w-1/3 px-4 py-2 rounded-full text-white text-xl md:text-2xl focus:outline-none leading-none "
            aria-label={phase.title.replace("Phase", "Phase ")}
          >
            <p className="font-bold">
              {phase.title.replace("Phase", "Phase ")}
            </p>
            <p className="text-white text-lg md:text-xl"> {t(phase.date)}</p>
          </button>
        ))}
      </div>
      <AnimatePresence>
        <div
          className={`flex md:flex-row flex-col justify-center items-start gap-8 mt-12 mx-auto  ${
            activePhaseData.prizes.length > 3 ? "w-full" : "w-full"
          }`}
        >
          {LuckyDrawPrizesData[activePhase].prizes.map((prize, prizeIndex) => (
            <motion.div
              key={"prize" + prize.img + prizeIndex}
              className="text-center flex flex-col w-full hover:brightness-120 transition-all duration-300 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="w-full h-full gradient-box aspect-square  backdrop-blur-sm   flex items-start justify-start rounded-4xl "
                style={{
                  backgroundImage: "url('./images/prize0627/prize_bg01.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="relative  h-full  bg-amber-20/0 w-full flex flex-col justify-center items-center">
                  <div className="w-[100%] text-white text-xl hover:scale-105 transition-all duration-300">
                    <img
                      src={"./images/" + prize.img}
                      alt=""
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="text-lg mt-2 text-white ">
                <p className="flex items-start justify-start gap-2 text-lg mb-2">
                  <CircleChevronRight
                    size={20}
                    className="flex-shrink-0 mt-1"
                  />
                  {prize.link.length > 0 ? (
                    <a
                      href={prize.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-left hover:underline hover:text-white/90 transition-all duration-300"
                      onClick={() => {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                          event: "data_layer_event",
                          event_name_ga4: prize.Ga4_event_name1,
                          event_category_DL: "internal-links",
                          event_action_DL: "clicked",
                          event_label_DL: prize.title,
                          event_value_DL: "",
                        });
                      }}
                    >
                      {prize.title}
                    </a>
                  ) : (
                    <span className="text-left">{prize.title}</span>
                  )}
                </p>
                {prize.title2 && (
                  <p className="flex items-start justify-start gap-2 text-lg mb-2">
                    <CircleChevronRight
                      size={20}
                      className="flex-shrink-0 mt-1"
                    />
                    {prize.link2 && prize.link2.length > 0 ? (
                      <a
                        href={prize.link2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-left hover:underline hover:text-white/90 transition-all duration-300"
                        onClick={() => {
                          window.dataLayer = window.dataLayer || [];
                          window.dataLayer.push({
                            event: "data_layer_event",
                            event_name_ga4: prize.Ga4_event_name2,
                            event_category_DL: "internal-links",
                            event_action_DL: "clicked",
                            event_label_DL: prize.title2,
                            event_value_DL: "",
                          });
                        }}
                      >
                        {prize.title2}
                      </a>
                    ) : (
                      <span className="text-left">{prize.title2}</span>
                    )}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

function GameCarousel() {
  const [start, setStart] = useState(0);
  const [cardWidth, setCardWidth] = useState(0); // 手機版位移用
  const cardRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ae";

  // === 手機版：估算單卡寬度（含間距） ===
  useEffect(() => {
    const update = () => {
      if (!cardRef.current) return;
      // 你註解寫 16=mx-2*2，但 class 用 gap-5; 這裡仍沿用你的 +20 做簡化
      setCardWidth(cardRef.current.offsetWidth + 20);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // === 共用：左右切換 ===
  const maxStartMobile = Math.max(0, gameCards.length - 1);
  const maxStartDesktop = Math.max(0, gameCards.length - 3);

  const handlePrev = () =>
    setStart((s) => Math.max(0, s - 1));
  const handleNextMobile = () =>
    setStart((s) => Math.min(maxStartMobile, s + 1));
  const handleNextDesktop = () =>
    setStart((s) => Math.min(maxStartDesktop, s + 1));

  // === 桌面版：切片出 3 張 ===
  const visibleDesktop = useMemo(
    () => gameCards.slice(start, start + 3),
    [start]
  );

  return (
    <div className="relative px-0 md:px-0">
      {/* 手機版左右按鈕 */}
      <div className="lg:hidden absolute left-1/2 -bottom-[25%] z-20 shadow-lg -translate-x-1/2 w-full flex justify-between px-6">
        <button
          onClick={handlePrev}
          className="w-[20%] text-white flex items-center justify-center text-2x p-0 m-0 hover:scale-110 transition"
          disabled={start === 0}
          aria-label="Previous"
        >
          <img src="./images/left.png" alt="" className="w-full" />
        </button>
        <button
          onClick={handleNextMobile}
          className="w-[20%] text-white flex items-center justify-center text-2xl hover:scale-110 transition"
          disabled={start === maxStartMobile}
          aria-label="Next"
        >
          <img src="./images/right.png" alt="" className="w-full" />
        </button>
      </div>

      {/* 手機版：單一卡片位移輪播 */}
      <div className="lg:hidden transition-transform duration-500 ease-in-out ml-[0%]">
        <div
          className="flex transition-transform duration-500 ease-in-out relative gap-5"
          style={{ transform: `translateX(-${start * cardWidth}px)` }}
        >
          {gameCards.map((card, idx) => (
            <div
              key={idx}
              ref={idx === 0 ? cardRef : undefined}
              className="gradient-box flex-shrink-0 w-full aspect-square rounded-4xl flex flex-col justify-between overflow-hidden text-white"
              style={{ opacity: card.active ? 1 : 0.8 }}
              onClick={() => card.link && (window.location.href = card.link)}
            >
              {card.active ? (
                <div className="relative w-full h-full py-3 px-4">
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background:
                        "linear-gradient(170deg, #14098B, #00000050, #00000050, #00000095,#000000)",
                    }}
                  />
                  <div
                    className="absolute inset-0 -z-20"
                    style={{
                      backgroundImage: `url(${"./images/" + card.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="text-xl md:text-3xl font-semibold mb-2 font-TTNormsProMedium">
                    {t(card.title)}
                    {card.date && (
                      <span className="md:text-2xl block text-base font-normal">
                        {t(card.date)}
                      </span>
                    )}
                  </div>
                  {card.desc && (
                    <div
                      className={`py-3 px-3 absolute bottom-[1px] left-[1px] right-0 max-w-[85%] ${
                        isRTL ? "rounded-tl-3xl" : "rounded-tr-3xl"
                      } rounded-bl-lg backdrop-blur text-white/85 md:text-2xl`}
                      style={{
                        background:
                          "linear-gradient(180deg,  #00000030, #6E00FF50)",
                      }}
                    >
                      {t(card.desc)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-lg">
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background:
                        "linear-gradient(170deg, #00000090, #00000095,#14098B)",
                    }}
                  />
                  <img src="./images/Locked.png" alt="" className="w-full" />
                  <div className="text-center text-white text-xl">
                    New Attractions: <br /> Coming Soon !
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 桌面版：可切換、一次顯示三個 */}
      <div className="hidden lg:block relative">
        {/* 桌面版左右按鈕 */}
        <div className="absolute inset-y-0 top-[110%] left-1/2 -translate-x-1/2 w-72 flex items-center justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            disabled={start === 0}
            aria-label="Previous"
            className="pointer-events-auto ml-[-1rem] rounded-full p-2 bg-black/30 hover:bg-black/50 transition disabled:opacity-40"
          >
            <img src="./images/left.png" alt="" className="w-12 h-12" />
          </button>
          <button
            onClick={handleNextDesktop}
            disabled={start === maxStartDesktop}
            aria-label="Next"
            className="pointer-events-auto mr-[-1rem] rounded-full p-2 bg-black/30 hover:bg-black/50 transition disabled:opacity-40"
          >
            <img src="./images/right.png" alt="" className="w-12 h-12" />
          </button>
        </div>

        <div className="flex justify-center gap-8">
          {visibleDesktop.map((card, idx) => (
            <div
              key={`${start}-${idx}`} // 避免切片位移時 key 碰撞
              className="gradient-box w-[30%] aspect-square rounded-4xl flex justify-between overflow-hidden text-white group hover:brightness-140 transition relative"
              style={{ opacity: card.active ? 1 : 0.8 }}
              onClick={() => card.link && (window.location.href = card.link)}
            >
              {card.active ? (
                <div className="relative w-full h-full py-3 px-4 z-0">
                  <div
                    className="absolute inset-0 -z-10 rounded-4xl"
                    style={{
                      background:
                        "linear-gradient(170deg, #14098B, #00000040, #00000040, #00000095,#000000)",
                    }}
                  />
                  <div
                    className="absolute inset-0 -z-20 group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    style={{
                      backgroundImage: `url(${"./images/" + card.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="text-2xl font-semibold mb-2">
                    <span className="font-TTNormsProMedium">{t(card.title)}</span>
                    {card.date && (
                      <span className="block font-normal text-xl">
                        {t(card.date)}
                      </span>
                    )}
                  </div>
                  {card.desc && (
                    <div
                      className={`text-lg py-3 px-3 absolute bottom-[1px] left-[1px] right-0 max-w-[85%] ${
                        isRTL ? "rounded-tl-3xl" : "rounded-tr-3xl"
                      } rounded-bl-lg backdrop-blur text-white/85`}
                      style={{
                        background:
                          "linear-gradient(180deg,  #00000030, #6E00FF50)",
                      }}
                    >
                      {t(card.desc)}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 p-2">
                    <SquareArrowOutUpRight className="text-white" size={20} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-lg">
                  <div
                    className="absolute inset-0 -z-10"
                    style={{
                      background:
                        "linear-gradient(170deg, #00000090, #00000095,#14098B)",
                    }}
                  />
                  <img src="./images/Locked.png" alt="" className="w-full" />
                  <div className="text-center text-white text-2xl">
                    <Trans i18nKey="landing_page.section_2_stage_coming_soon" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 可選：顯示目前頁碼 */}
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: maxStartDesktop + 1 }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to set ${i + 1}`}
              onClick={() => setStart(i)}
              className={`h-2 w-2 rounded-full ${
                i === start ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


function PrizeCarousel_mobile() {
  const [start, setStart] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 取得卡片寬度
  useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth); // 16 = mx-2*2
    }
    const handleResize = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxStart = prizeCards.length - 1;

  const handlePrev = () => setStart((s) => Math.max(0, s - 1));
  const handleNext = () => setStart((s) => Math.min(maxStart, s + 1));

  return (
    <div className="relative px-0  md:px-0 mt-12">
      <div
        className="flex transition-transform duration-500 ease-in-out relative"
        style={{
          transform: `translateX(-${start * cardWidth}px)`,
        }}
      >
        {prizeCards.map((card, idx) => (
          <div
            key={idx}
            ref={idx === 0 ? cardRef : undefined}
            className="flex-shrink-0 w-full md:w-[320px]  mx-0 flex flex-col justify-between text-white"
          >
            <div className="relative w-full h-full py-3 px-4">
              <div
                className="w-full  gradient-box aspect-square backdrop-blur-sm flex items-start justify-start rounded-4xl"
                style={{
                  backgroundImage:
                    idx === 0
                      ? "url('./images/0703/prize01_bg_mb.png')"
                      : "url('./images/prize0627/prize_bg01.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="gradient-box2 text-white absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 font-semibold z-10 bg-black rounded-full">
                  <div className="text-white text-xl text-gradient text-glow ">
                    {card.title}
                  </div>
                </div>
                <div className="relative h-full bg-amber-20/0 w-full flex flex-col justify-center items-center p-4">
                  <div className="w-[100%] text-white text-xl">
                    <img
                      src={"./images/" + card.img}
                      alt=""
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {idx > 0 && (
                <div className="text-lg mt-2 ">
                  <p className="flex items-start justify-start gap-2 text-lg mb-2">
                    <CircleChevronRight
                      size={20}
                      className="flex-shrink-0 mt-1"
                    />
                    {card.link1 && card.link1.length > 0 ? (
                      <a
                        href={card.link1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-left hover:underline hover:text-white/90 transition-all duration-300"
                        onClick={() => {
                          window.dataLayer = window.dataLayer || [];
                          window.dataLayer.push({
                            event: "data_layer_event",
                            event_name_ga4: card.Ga4_event_name1,
                            event_category_DL: "internal-links",
                            event_action_DL: "clicked",
                            event_label_DL: card.subtitle1,
                            event_value_DL: "",
                          });
                        }}
                      >
                        {card.subtitle1}
                      </a>
                    ) : (
                      <span>{card.subtitle1}</span>
                    )}
                  </p>
                  <p className="flex items-start justify-start gap-2 text-lg mb-2">
                    <CircleChevronRight
                      size={20}
                      className="flex-shrink-0 mt-1"
                    />
                    {card.link2 && card.link2.length > 0 ? (
                      <a
                        href={card.link2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-left hover:underline hover:text-white/90 transition-all duration-300"
                        onClick={() => {
                          window.dataLayer = window.dataLayer || [];
                          window.dataLayer.push({
                            event: "data_layer_event",
                            event_name_ga4: card.Ga4_event_name2,
                            event_category_DL: "internal-links",
                            event_action_DL: "clicked",
                            event_label_DL: card.subtitle2,
                            event_value_DL: "",
                          });
                        }}
                      >
                        {card.subtitle2}
                      </a>
                    ) : (
                      <span>{card.subtitle2}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className="relative z-20 shadow-lg w-full md:w-auto md:gap-1 flex justify-between px-6 "
        style={{ gap: "1rem" }}
      >
        <button
          onClick={handlePrev}
          className="w-[20%] md:w-full text-white flex items-center justify-center text-2xl p-0 m-0 hover:scale-110 transition"
          disabled={start === 0}
          aria-label="Previous"
        >
          <img src="./images/left.png" alt="" className="w-full" />
        </button>
        <button
          onClick={handleNext}
          className="w-[20%] md:w-full text-white flex items-center justify-center text-2xl hover:scale-110 transition"
          disabled={start === maxStart}
          aria-label="Next"
        >
          <img src="./images/right.png" alt="" className="w-full" />
        </button>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const [isTermDialogOpen, setIsTermDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-[#000]  overflow-x-hidden font-RobotoRegular">
      <CustomLanguageDialog isThemePark={false} />
      {/* 背景音樂 */}
      <AudioController
        src="./sound/landingpage_rollerpage_bgm.wav"
        positionStyle="absolute top-[4%] md:top-[2.5%] right-[0rem] md:right-4 z-50"
      />
      {/* 頁面主標題 */}

      <div
        className="relative h-[65vh]  md:min-h-screen flex flex-col items-center justify-start  overflow-x-hidden   w-full "
        style={{
          backgroundImage: "url('./images/bg02-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#25252500] via-[#00000000] to-[#000000]  "></div>
        <div className="absolute top-[25%]  lg:top-[28%] xl:top-[28%] right-[-70%] md:right-[-40%] xl:right-0 lg:right-[0%] w-[150%] md:w-[100%] lg:w-[50%]  xl:w-[50%]">
          <motion.img
            src="./images/bg02-2.png"
            alt=""
            className="w-full h-full object-cover"
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
        <div className="w-11/12 md:w-10/12 mx-auto flex flex-col items-center justify-between h-screen ">
          <div className="pt-10 text-center z-10 ">
            <h1 className="font-TTNormsProMedium  text-3xl md:text-5xl font-semibold text-white mb-2 drop-shadow-lg text-shadow-[0_0_15px_#FB8DE9] md:text-center">
              <Trans i18nKey="welcome" />
            </h1>
            <h2 className="font-TTNormsProMedium text-xl md:text-3xl text-white font-light mb-2 drop-shadow-lg text-shadow-[0_0_15px_#fff] my-4">
              <Trans i18nKey="landing_page.subtitle" />
            </h2>
          </div>

          {/* 行動按鈕區塊 */}
        </div>
      </div>
      <div className="absolute top-[25%] -left-[25%]  w-[54%]">
        <img src="./images/g05.png" alt="" className="w-full" />
      </div>
      <div className="absolute top-[17%] right-[0%] w-[54%]">
        <img src="./images/g06.png" alt="" className="w-full" />
      </div>
      <div className="absolute top-[30%] -right-[38%]  w-[54%]">
        <img src="./images/g07.png" alt="" className="w-full" />
      </div>
      <div className="relative z-10 text-center  py-6 w-[90%] md:w-[80%] mx-auto ">
        <div className="mb-12 md:px-[5%]">
          <p className="font-TTNormsProMedium mb-4 text-[#C1BCFA] text-3xl md:text-4xl text-center text-shadow-[0_0_15px_#CFAFFF]">
            {t("landing_page.section_1_title")}
          </p>
          <p className="text-white text-center text-lg md:text-2xl md:px-6">
            {t("landing_page.section_1_subtitle")}
          </p>
        </div>

        <a
          href="./#themepark"
          onClick={(e) => {
            e.preventDefault(); // 阻止立即跳轉
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "data_layer_event",
              event_name_ga4: "click_into_map",
              event_category_DL: "internal-links",
              event_action_DL: "clicked",
              event_label_DL: "lets_go",
              event_value_DL: "",
            });

            // 播放點擊音效，播放完成後跳轉
            playSound("./sound/click_into_map.wav");
            setTimeout(() => {
              window.location.href = "./#themepark";
            }, 500);
          }}
          className="btn-glow text-2xl  bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition"
        >
          {t("landing_page.let_go")}
        </a>
      </div>

      {/* Play games 區域 */}
      <div className="w-10/12 mx-auto mt-[10%]">
        <h3 className="font-TTNormsProMedium mb-12 text-[#C1BCFA] text-2xl md:text-4xl text-center text-shadow-[0_0_15px_#CFAFFF]">
          {t("landing_page.section_2_title")}
        </h3>
        <GameCarousel />
      </div>

      {/* KOL VIDEO */}
      {/* 精彩時刻區域 0701之前不要顯示 */}

      <div className="w-10/12 mx-auto mt-[30%] md:mt-[10%]">
        <h3 className="font-TTNormsProMedium font-semibold mb-18 text-[#C1BCFA] text-3xl text-center text-shadow-[0_0_15px_#CFAFFF]">
          {t("landing_page.section_4_title")}
        </h3>

        {/* 老闆們影片 */}
        <div className=" flex justify-center items-start gap-8 scale-130 mb-12">
          {KolVideo.filter(video => video.id < 3).map((video) => (
            <div
              key={video.id}
              className="bg-[#000] rounded-xl w-[33%] overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => {
                setSelectedVideo(video.url);
                setIsVideoDialogOpen(true);
              }}
            >
              <div className="aspect-video bg-gray-700 mb-4 rounded relative group">
                {/* 影片縮圖 */}
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  light={true}
                  controls={false}
                  style={{ pointerEvents: "none" }}
                />
                {/* 播放按鈕覆蓋層 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Play size={48} className="text-white" fill="white" />
                  </div>
                </div>
              </div>
              <p className="text-[8px] md:text-lg text-white font-semibold text-center mb-4 md:px-2">
                {video.title}
              </p>
            </div>
          ))}
        </div>

        {/* 其他 KOL */}
        <div className=" flex justify-center items-center gap-8">
          {KolVideo.filter(video => video.id >= 3).map((video) => (
            <div
              key={video.id}
              className="bg-[#000] rounded-xl w-[33%] overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300"
              onClick={() => {
                setSelectedVideo(video.url);
                setIsVideoDialogOpen(true);
              }}
            >
              <div className="aspect-video bg-gray-700 mb-4 rounded relative group">
                {/* 影片縮圖 */}
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  light={true}
                  controls={false}
                  style={{ pointerEvents: "none" }}
                />
                {/* 播放按鈕覆蓋層 */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Play size={48} className="text-white" fill="white" />
                  </div>
                </div>
              </div>
              <p className="text-[12px] md:text-lg text-white font-semibold text-center mb-4 md:px-2">
                {video.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How to win 區域   */}
      <div className="w-11/12 md:w-10/12 mx-auto mt-[26%] lg:mt-[10%]">
        <h3 className="font-TTNormsProMedium font-semibold mb-6 md:mb-12 text-[#C1BCFA] text-3xl md:text-4xl text-center text-shadow-[0_0_15px_#CFAFFF]">
          {t("landing_page.section_3_title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col items-center">
            <div className="md:text-4xl mb-2 text-white">
              <img src="./images/prize.png" alt="" className="w-full" />
            </div>
            <p className="font-TTNormsProMedium text-white text-2xl md:text-4xl  mb-2">
              {t("landing_page.section_3_stage_1_title")}
            </p>
            <p className="text-white/80 text-lg md:text-2xl">
              <Trans i18nKey="landing_page.section_3_stage_1_content" />
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl mb-2 text-white">
              <img src="./images/game.png" alt="" className="w-full" />
            </div>
            <p className="font-TTNormsProMedium text-white text-2xl md:text-4xl  mb-2">
              {t("landing_page.section_3_stage_2_title")}
            </p>
            <p className="text-white/80 text-lg md:text-2xl">
              <Trans i18nKey="landing_page.section_3_stage_2_content" />
            </p>
          </div>
          {/* <div className="flex flex-col items-center justify-center ">
            <div className="text-4xl mb-2 text-white">
              <img src="./images/Locked02.png" alt="" className="w-full" />
            </div>
          </div> */}
        </div>
        <div className="text-white/80 hover:text-white  transition-all duration-300 text-center text-2xl flex items-center justify-center w-full p-4 mt-10 ">
          <div
            className="btn-glow text-2xl  bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition"
            onClick={() => setIsTermDialogOpen(true)}
          >
            Terms and Conditions
          </div>
        </div>
      </div>

      {/* Grand Prizes 區域  desktop*/}
      <div className="w-10/12 mx-auto mt-[10%] hidden md:block">
        <div className="text-center">
          <h3 className="font-TTNormsProMedium  mb-12 text-[#C1BCFA] text-2xl md:text-4xl  text-shadow-[0_0_15px_#CFAFFF]">
            {t("landing_page.section_5_title")}
          </h3>
        </div>
        <div
          className="gradient-box  aspect-[16/6.4] w-full   backdrop-blur-sm    flex items-center justify-start rounded-4xl hover:brightness-120 transition-all duration-300 "
          style={{
            backgroundImage: "url('./images/prize0625/prize01_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="gradient-box2  text-white  absolute -top-5 left-10  px-6 py-2   font-semibold z-10 bg-black rounded-full">
            <div className="text-white text-2xl text-gradient text-glow ">
              TOP1
            </div>
          </div>
          <div
            className="relative w-[90%] h-full  mx-auto bg-amber-20/0  flex flex-col justify-center  items-center cursor-pointer"
          >
            <p className="text-white text-[1.6vw]  text-center font-TTNormsProMedium  pt-10 text-shadow-[0_0_15px_#CFAFFF]">
              <a href="https://rog.asus.com/graphics-cards/graphics-cards/rog-matrix/rog-matrix-rtx5090-p32g-30th/" target="_blank" className="hover:underline" >ROG Matrix RTX 5090 - ASUS Graphics Cards 30th Anniversary Edition</a>
              <br />
              <a href="https://rog.asus.com/power-supply-units/rog-thor/rog-thor-1600t3-gaming/" target="_blank" className="hover:underline" >ROG THOR 1600W Platinum III</a>
            </p>
            <div className="w-[54%] text-white text-xl mt-[2%] hover:w-[56%] transition-all duration-300 z">
              <img src="./images/0703/prize01.png" alt="" className="w-full" />
            </div>
          </div>
          <div className="w-full text-white text-sm absolute bottom-4 left-5 hidden">
            <p className="flex items-start gap-2 text-2xl mb-2">
              <CircleChevronRight size={24} className="flex-shrink-0 mt-1" />
              <span>A special GeForce RTX 50 Series Graphics Card </span>
            </p>
            <p className="flex items-start gap-2 text-2xl">
              <CircleChevronRight size={24} className="flex-shrink-0 mt-1" />
              <span>ROG Thor 1200w Platinum lll </span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 mt-10">
          <div className="w-full h-full">
            <div
              className="w-full h-full gradient-box aspect-square  backdrop-blur-sm rounded-4xl  flex items-start justify-start hover:brightness-120 transition-all duration-300 "
              style={{
                backgroundImage: "url('./images/prize0627/prize_bg01.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="gradient-box2  text-white  absolute -top-5 left-[10%]   px-6 py-2   font-semibold z-10 bg-black rounded-full">
                <div className="text-white text-xl text-gradient text-glow ">
                  TOP2
                </div>
              </div>
              <div className="relative  h-full  bg-amber-20/0 w-full flex flex-col justify-center items-center p-4">
                <div className="w-[100%] text-white text-xl hover:scale-105 transition-all duration-300">
                  <img
                    src="./images/prize0627/prize02.png"
                    alt=""
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="w-full text-white text-xl mt-2">
              <p className="flex items-start gap-2  mb-2">
                <CircleChevronRight size={22} className="flex-shrink-0 mt-1" />
                <a
                  href="https://www.asus.com/motherboards-components/graphics-cards/tuf-gaming/tuf-rtx5080-16g-gaming/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white/90 transition-all duration-300"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: "data_layer_event",
                      event_name_ga4: "prize_link_TUF_Gaming_GeForce_RTX_5080",
                      event_category_DL: "internal-links",
                      event_action_DL: "clicked",
                      event_label_DL: "TUF Gaming GeForce RTX 5080",
                      event_value_DL: "",
                    });
                  }}
                >
                  TUF Gaming GeForce RTX 5080{" "}
                </a>
              </p>
              <p className="flex items-start gap-2  ">
                <CircleChevronRight size={22} className="flex-shrink-0 mt-1" />
                <a
                  href="https://www.asus.com/motherboards-components/power-supply-units/tuf-gaming/tuf-gaming-1000g/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white/90 transition-all duration-300"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: "data_layer_event",
                      event_name_ga4: "prize_link_TUF_Gaming_1000W_Gold",
                      event_category_DL: "internal-links",
                      event_action_DL: "clicked",
                      event_label_DL: "TUF Gaming 1000W Gold",
                      event_value_DL: "",
                    });
                  }}
                >
                  TUF Gaming 1000W Gold{" "}
                </a>
              </p>
            </div>
          </div>

          <div className="w-full h-full">
            <div
              className="w-full h-full gradient-box aspect-square  backdrop-blur-sm rounded-4xl  flex items-start justify-start  hover:brightness-120 transition-all duration-300 "
              style={{
                backgroundImage: "url('./images/prize0627/prize_bg01.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="gradient-box2  text-white absolute -top-5 left-[10%]   px-6 py-2   font-semibold z-10 bg-black rounded-full">
                <div className="text-white text-xl text-gradient text-glow ">
                  TOP3
                </div>
              </div>
              <div className="relative  h-full  bg-amber-20/0 w-full flex flex-col justify-center items-center p-4">
                <div className="w-[100%] text-white text-xl hover:scale-105 transition-all duration-300">
                  <img
                    src="./images/prize0627/prize03.png"
                    alt=""
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="w-full text-white text-xl mt-2">
              <p className="flex items-start gap-2  mb-2">
                <CircleChevronRight size={22} className="flex-shrink-0 mt-1" />
                <a
                  href="https://www.asus.com/motherboards-components/graphics-cards/proart/proart-rtx5080-16g/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white/90 transition-all duration-300"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: "data_layer_event",
                      event_name_ga4: "prize_link_ProArt_GeForce_RTX_5080",
                      event_category_DL: "internal-links",
                      event_action_DL: "clicked",
                      event_label_DL: "ProArt GeForce RTX 5080",
                      event_value_DL: "",
                    });
                  }}
                >
                  ProArt GeForce RTX 5080{" "}
                </a>
              </p>
              <p className="flex items-start gap-2  ">
                <CircleChevronRight size={22} className="flex-shrink-0 mt-1" />
                <a
                  href="https://rog.asus.com/power-supply-units/rog-strix/rog-strix-1000p-gaming/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white/90 transition-all duration-300"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: "data_layer_event",
                      event_name_ga4: "prize_link_ROG_Strix_1000W_Platinum",
                      event_category_DL: "internal-links",
                      event_action_DL: "clicked",
                      event_label_DL: "ROG Strix 1000W Platinum",
                      event_value_DL: "",
                    });
                  }}
                >
                  ROG Strix 1000W Platinum{" "}
                </a>
              </p>
            </div>
          </div>

          <div className="w-full h-full">
            <div
              className="w-full h-full gradient-box aspect-square  backdrop-blur-sm   flex items-start justify-start rounded-4xl hover:brightness-120 transition-all duration-300 "
              style={{
                backgroundImage: "url('./images/prize0627/prize_bg01.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="gradient-box2  text-white absolute -top-5 left-[10%]   px-6 py-2   font-semibold z-10 bg-black rounded-full">
                <div className="text-white text-xl text-gradient text-glow ">
                  TOP4
                </div>
              </div>
              <div className="relative  h-full  bg-amber-20/0 w-full flex flex-col justify-center items-center p-4">
                <div className="w-[100%] text-white text-xl hover:scale-105 transition-all duration-300">
                  <img
                    src="./images/prize0627/prize04.png"
                    alt=""
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="w-full text-white text-xl mt-2">
              <p className="flex items-start gap-2  mb-2">
                <CircleChevronRight size={22} className="flex-shrink-0 mt-1" />
                <a
                  href="https://rog.asus.com/graphics-cards/graphics-cards/rog-strix/rog-strix-rtx5070ti-16g-gaming/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white/90 transition-all duration-300"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: "data_layer_event",
                      event_name_ga4:
                        "prize_link_ROG_Strix_GeForce_RTX_5070_Ti",
                      event_category_DL: "internal-links",
                      event_action_DL: "clicked",
                      event_label_DL: "ROG Strix GeForce RTX 5070 Ti",
                      event_value_DL: "",
                    });
                  }}
                >
                  ROG Strix GeForce RTX 5070 Ti{" "}
                </a>
              </p>
              <p className="flex items-start gap-2  ">
                <CircleChevronRight size={22} className="flex-shrink-0 mt-1" />
                <a
                  href="https://rog.asus.com/power-supply-units/rog-strix/rog-strix-1000p-gaming/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white/90 transition-all duration-300"
                  onClick={() => {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                      event: "data_layer_event",
                      event_name_ga4: "prize_link_ROG_Strix_1000W_Platinum",
                      event_category_DL: "internal-links",
                      event_action_DL: "clicked",
                      event_label_DL: "ROG Strix 1000W Platinum",
                      event_value_DL: "",
                    });
                  }}
                >
                  ROG Strix 1000W Platinum{" "}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How to win 區域  mobile*/}

      {/*  */}
      <div className="w-11/12 md:w-10/12 mx-auto mt-[10%] block md:hidden">
        <div className="text-center mb-5">
          <h3 className="font-semibold mb-4 text-[#C1BCFA] text-3xl md:text-4xl font-TTNormsProMedium text-shadow-[0_0_15px_#CFAFFF]  ">
            {t("landing_page.section_5_title")}
          </h3>
          <p className="text-white text-2xl">Something BIG is coming soon...</p>
        </div>
        <PrizeCarousel_mobile />
      </div>

      {/* lucky draw 區域 */}
      <div className="w-10/12 mx-auto mt-[10%] pb-[10%] z-10">
        <h3 className="font-TTNormsProMedium mb-10 text-[#C1BCFA] text-2xl md:text-4xl text-center text-shadow-[0_0_15px_#CFAFFF]">
          {t("landing_page.section_6_title")}
        </h3>

        {/* Phase1-3 */}
        <LuckyDrawPrizesComponent />
      </div>

      <div className="w-[40%] absolute bottom-[0%] left-[0%] opacity-30  pointer-events-none">
        <img src="./images/e01.png" alt="" className="w-full" />
      </div>
      <div className="w-[32%] absolute bottom-[10%] right-[0%] opacity-70 pointer-events-none">
        <img src="./images/e02.png" alt="" className="w-full" />
      </div>
      <div className="w-[30%] absolute bottom-[30%] left-[0%] opacity-70 pointer-events-none">
        <img src="./images/e03.png" alt="" className="w-full" />
      </div>

      <TermDialog
        isOpen={isTermDialogOpen}
        onClose={() => setIsTermDialogOpen(false)}
        onAccept={() => setIsTermDialogOpen(false)}
      />

      {/* Video Dialog */}
      <LandingPageVideoDialog
        isOpen={isVideoDialogOpen}
        onClose={() => setIsVideoDialogOpen(false)}
        url={selectedVideo || ""}
      />
    </div>
  );
}
