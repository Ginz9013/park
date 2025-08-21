import { createPortal } from "react-dom";
import DialogTemplate from "@/components/DialogTemplate"
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import { useTranslation } from "react-i18next";

type GetCableCarPointModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const GetCableCarPointModal: React.FC<GetCableCarPointModalProps> = ({ open, setOpen}) => {

  const { t } = useTranslation();

  return createPortal(
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      className="w-96"
    >
      {/* Icon */}
      <img src="./images/wheel/video-finished.png" alt="Get Draw Point" />
      <h2 className="text-3xl">{t("r2.cable.point.title")}</h2>

      <p className="font-bold my-6">{t("r2.cable.point.get")}</p>


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
    document.body
  );
}

export default GetCableCarPointModal;