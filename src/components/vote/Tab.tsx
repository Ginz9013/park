import { useState } from "react";
import { useResponsiveTransform } from "@/hooks/useResponsiveTransform";
import { useTranslation } from "react-i18next";

export enum StoryType {
  HugeASUSFans = "HugeASUSFans",
  SpecialFeatures = "SpecialFeatures",
  FavoriteMoment = "FavoriteMoment",
  TheGamer = "TheGamer",
  MyOwnStory = "MyOwnStory",
}

type TabProps = {
  onTabChange?: (section: StoryType | null) => void;
};

const Tab: React.FC<TabProps> = ({ onTabChange }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ae";

  const [activePhase, setActivePhase] = useState(0);

  const { getTransform } = useResponsiveTransform();

  const tabs = [
    { label: "ALL", value: null },
    { label: t("r1.vote.option1"), value: StoryType.HugeASUSFans },
    { label: t("r1.vote.option2"), value: StoryType.SpecialFeatures },
    { label: t("r1.vote.option3"), value: StoryType.FavoriteMoment },
    { label: t("r1.vote.option4"), value: StoryType.TheGamer },
    { label: t("r1.vote.option5"), value: StoryType.MyOwnStory },
  ];

  const handleTabClick = (index: number) => {
    if (isRTL) {
      const reverseIndex = 5 - index;
      setActivePhase(reverseIndex);
    } else {
      setActivePhase(index);
    }
    // 直接使用對應的 value，ALL 的 value 是 null
    const selectedSection = tabs[index].value;
    onTabChange?.(selectedSection);
  };

  return (
    <div className="w-full my-4">
      <div className="relative flex md:flex-row flex-col  justify-center items-center bg-black/50 border border-white/20 rounded-3xl md:rounded-full p-1 md:max-w-full mx-auto">
        {/* Indicator */}
        <div
          className="absolute top-0 left-0 md:h-full md:w-1/6 h-1/6 w-full rounded-full bg-gradient-to-r from-[#0C5E99] via-[#149CFF] to-[#FF70C3] shadow-lg transition-transform duration-300 ease-in-out"
          style={{
            transform: getTransform(activePhase * 100),
          }}
        ></div>

        {/* 按鈕群 */}
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className="relative z-10 md:w-1/5 px-4 py-2 rounded-full text-white text-lg focus:outline-none leading-none cursor-pointer"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tab;
