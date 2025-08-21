import { RefObject } from "react";
import DialogTemplate from "@/components/DialogTemplate";
import { Button } from "@/components/ui/button";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useMission } from "@/hooks/useMission";
import { FIND_CARD_POINT_RULE_ID } from "@/types/pointRule";
import { useTranslation } from "react-i18next";


type FindCardModallProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  parentNode: RefObject<HTMLDivElement | null>;
}

const FindCardModal: React.FC<FindCardModallProps> = ({ open, setOpen, parentNode }) => {

  const { t } = useTranslation();
  const { isMobile } = useMobile();
  const { missions } = useMission();

  const foundCards = missions.get(FIND_CARD_POINT_RULE_ID)?.progress ?? 0;

  const rendererArray = Array.from({ length: 3 }, (_, i) => i < foundCards);

  return createPortal(
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      className={cn(isMobile ? "" : "w-auto max-w-[50vw]")}
      zIndex={100}
    >
      {/* 標題 */}
      <h2 className="text-2xl lg:text-3xl text-glow mb-4">{t("r2.secret_mission.page.title")}</h2>


      {/* 文字 */}
      <p className="text-xl my-6">
        {t("r2.secret_mission.page.rule_description1")}
      </p>
      <p className="text-xl my-6">
        {t("r2.secret_mission.page.rule_description2")}
      </p>

      {/* 圖片 */}
      <div className="flex mb-6">
        {rendererArray.map((state, index) => (
          <img
            key={index}
            src={state
              ? "./elements/r2/findCard/founded.png"
              : "./elements/r2/findCard/not_found.png"}
            alt="Find Card"
            className="w-18 sm:w-24 md:w-28 xl:w-48 aspect-square rounded-lg shadow-lg"
          />
        ))}
      </div>


      {/* 按鈕 */}
      <Button
        size="lg"
        className="w-56 border border-gray-500 bg-inherit text-xl cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false)
        }}
      >
        Close
      </Button>

    </DialogTemplate>,
    parentNode && typeof parentNode !== "string" && parentNode.current
      ? parentNode.current
      : document.body
  );
}

export default FindCardModal;