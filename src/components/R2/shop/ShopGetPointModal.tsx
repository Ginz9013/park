import React, { RefObject } from "react";
import DialogTemplate from "@/components/DialogTemplate";
import { Button } from "@/components/ui/button";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Map } from 'lucide-react';
import { useTranslation } from "react-i18next";

type ShopGetPointModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  parentNode: RefObject<HTMLDivElement | null>;
}

const ShopGetPointModal: React.FC<ShopGetPointModalProps> = ({ open, setOpen, parentNode }) => {

  const { t } = useTranslation();
  const { isMobile } = useMobile();

  return createPortal(
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      className={cn(isMobile ? "" : "w-auto max-w-[50vw]")}
      zIndex={100}
    >
      {/* Icon */}
      <img src="./images/wheel/video-finished.png" alt="Get Draw Point" />

      {/* 文字 */}
      <h2 className="text-3xl">{t("r2.shop.get_point.title")}</h2>
      <h2 className="">{t("r2.shop.get_point.sub_title")}</h2>
      <p className="font-bold my-6">{t("r2.shop.get_point.point")}</p>


      {/* 按鈕 */}
      <Button
        size="lg"
        className="botton-background-gradient text-black cursor-pointer w-full"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false)
        }}
      >
        <Map />
      </Button>

    </DialogTemplate>,
    parentNode && typeof parentNode !== "string" && parentNode.current
      ? parentNode.current
      : document.body
  );
}

export default ShopGetPointModal;