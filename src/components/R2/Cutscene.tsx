import useMobile from "@/hooks/useMobile";
import { useSupportsHEVCAlpha } from "@/hooks/useSupportsHEVCAlpha";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Cutscene = () => {

  const { t } = useTranslation();

  const { isMobile } = useMobile();
  const supportsHEVCAlpha = useSupportsHEVCAlpha();
  
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();

  const to = searchParams.get("to");

  useEffect(() => {
    const timeout = setTimeout(() => {
      // 推送 GTM 資料
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "data_layer_event",
        event_name_ga4: `click_go ${to}`,
        event_category_DL: "internal-links",
        event_action_DL: "clicked",
        event_label_DL: `/${to}`,
        event_value_DL: "",
      });

      navigate(`/${to}`);
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex justify-center items-end"
      style={{
        backgroundImage: isMobile ? "url('./elements/r2/cutscene/cutscene_bg_mobile.jpg')" : "url('./elements/r2/cutscene/cutscene_bg_pc.png')"
      }}
    >
      <video
        className="w-full h-full absolute top-0 left-0 object-cover z-0 scale-65 sm:scale-75 md:scale-100"
        muted
        playsInline
        autoPlay
        loop
      >
        {supportsHEVCAlpha
          ? <source
              src="./elements/r2/cutscene/output.mov"
              type="video/webm"
            />
          : <source
            src="./elements/r2/cutscene/output.webm"
            type="video/webm"
          />
        }
      </video>
      <p className="text-white text-3xl md:text-5xl mb-36">{t("r2.cable.cutscene")}</p>

      {/* BGM */}
      <audio src="./sound/r2/cable_car_bgm.wav" autoPlay></audio>
    </div>
  );
}

export default Cutscene;