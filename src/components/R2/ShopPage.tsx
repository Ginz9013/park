import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
// import { t } from "i18next";
import useMobile from "@/hooks/useMobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShopGetPointModal from "./shop/ShopGetPointModal";
import { useMission } from "@/hooks/useMission";
import { authService } from "@/services/authService";
import { playSound } from "@/utils/sound";
import { SHOP_LINK_POINT_RULE_ID } from "@/types/pointRule";
import { useTranslation } from "react-i18next";
import shopListJson from "@/utils/shopList.json";
import { Map } from "lucide-react";


type Store = { store: string; link: string; };
type Country = { country: string; stores: Store[]};
const shopList = shopListJson as Record<string, Country[]>;

// const shopList = {
//   amazonUs: [
//     {
//       productName: "ROG Delta II",
//       link: "https://www.amazon.com/rog-delta-ii"
//     },
//     {
//       productName: "ROG Delta X",
//       link: "https://www.amazon.com/rog-delta-x"
//     },
//     {
//       productName: "ROG Delta Z",
//       link: "https://www.amazon.com/rog-delta-z"
//     }
//   ],
//   bestBuyUs: [
//     {
//       productName: "ROG Delta II",
//       link: "https://www.bestbuy.com/rog-delta-ii"
//     },
//     {
//       productName: "ROG Delta S Wireless",
//       link: "https://www.bestbuy.com/rog-delta-s-wireless"
//     },
//     {
//       productName: "ROG Delta V",
//       link: "https://www.bestbuy.com/rog-delta-v"
//     }
//   ],
//   microCenter: [
//     {
//       productName: "ROG Delta Z",
//       link: "https://www.futureshop.ca/rog-delta-z"
//     },
//     {
//       productName: "ROG Delta II Core",
//       link: "https://www.futureshop.ca/rog-delta-ii-core"
//     },
//     {
//       productName: "ROG Delta S",
//       link: "https://www.futureshop.ca/rog-delta-s"
//     },
//     {
//       productName: "ROG Delta Alpha",
//       link: "https://www.futureshop.ca/rog-delta-alpha"
//     }
//   ],
//   fnacFr: [
//     {
//       productName: "ROG Delta S Wireless",
//       link: "https://www.fnac.com/rog-delta-s-wireless"
//     },
//     {
//       productName: "ROG Delta II",
//       link: "https://www.fnac.com/rog-delta-ii"
//     }
//   ],
//   cdiscountFr: [
//     {
//       productName: "ROG Delta S",
//       link: "https://www.cdiscount.com/rog-delta-s"
//     },
//     {
//       productName: "ROG Delta II Core",
//       link: "https://www.cdiscount.com/rog-delta-ii-core"
//     },
//     {
//       productName: "ROG Delta Omega",
//       link: "https://www.cdiscount.com/rog-delta-omega"
//     }
//   ]
// };


type ShopPageProps = {
  onClose: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ onClose }) => {

  const { t } = useTranslation();
  const { isMobile } = useMobile();
  const [showShopGetPoint, setShowShopGetPoint] = useState<boolean>(false);
  const { missions, refetch } = useMission();

  // 商店區域
  const regionList = useMemo(() => Object.entries(shopList).map(([region]) => region), [shopList]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>("TAIWAN");
  // 商店國家
  const locationList = useMemo(() => selectedRegion
    ? shopList[selectedRegion].map(country => country.country)
    : [],
    [selectedRegion]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>("Taiwan");
  // 商店清單
  const storeList = useMemo(() => {
    if (!selectedRegion || !selectedCountry) return [];

    const country = shopList[selectedRegion].find(country => country.country === selectedCountry);
    return country ? country.stores : []
  }, [selectedRegion, selectedCountry]);

  const pageRef = useRef<HTMLDivElement>(null);

  const showGetPointModal = async () => {
    // 確認任務狀態
    const isGetPointByShopLink = !!missions.get(SHOP_LINK_POINT_RULE_ID)?.completedAt;

    // 已經得過分，跳出
    if (isGetPointByShopLink) return;
    
    const res = await authService.addPointByRuleId(SHOP_LINK_POINT_RULE_ID);

    // 加分失敗，跳出
    if (res.status !== "Success") return;

    // 建立任務紀錄
    await authService.createMissionRecord(SHOP_LINK_POINT_RULE_ID);

    // 重新呼叫API
    refetch();

    // 播放得分音效
    playSound("./sound/r2/get_point.wav");

    setShowShopGetPoint(true)
  };

  const handleClickLink = (storeName: string) => {
    // 推送 GTM 資料
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "data_layer_event",
      event_name_ga4: `click_go ${storeName}`,
      event_category_DL: "outbound-links",
      event_action_DL: "clicked",
      event_label_DL: storeName,
      event_value_DL: "",
    });

    showGetPointModal();
  }

  return (
    <motion.div
      ref={pageRef}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "text-white absolute top-0 left-0 w-full h-screen z-40 flex flex-col items-center justify-start overflow-auto px-[20vw] py-16"
      )}
      style={{
        backgroundImage: `url(./images/r2/background.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* 右上角返回按鈕 */}
      <div className="absolute top-[4%] right-4 text-white z-30 flex items-center gap-4">
        <Button onClick={onClose} className="cursor-pointer"><Map /></Button>
      </div>

      {/* 主要內容 */}
      <div className="flex flex-col justify-center items-center">
        {/* 文字 */}
        <h2
          className={cn(
            "text-3xl md:text-4xl text-glow mb-4",
            isMobile ? "text-center" : "text-start"
          )}
        >
          {t("r2.shop.title")}
        </h2>
        <p className={isMobile ? "w-full" : "w-1/2"}>
          {t("r2.shop.description")}
        </p>

        {/* 選項區 */}
        <div className={cn(
          "flex gap-6 mt-12",
          isMobile ? "flex-col" : ""
        )}>
          {/* Region */}
          <div className="flex gap-4">
            <Label htmlFor="region" className={cn("text-2xl", isMobile && "mr-7")}>{t("r2.shop.region")}</Label>
            <Select value={selectedRegion ?? undefined} onValueChange={setSelectedRegion}>
              <SelectTrigger id="region" className="w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regionList.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="flex gap-4">
            <Label htmlFor="location" className="text-2xl">{t("r2.shop.location")}</Label>
            <Select value={selectedCountry ?? undefined} onValueChange={setSelectedCountry}>
              <SelectTrigger id="location" className="w-[180px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {locationList.map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 地點標題 */}
        <h2
          className={cn(
            "text-2xl md:text-4xl text-glow uppercase mt-12",
            isMobile ? "text-center" : "text-start mb-4"
          )}
        >
          {selectedCountry}
        </h2>

        {/* 清單 */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-inherit !border-b-0">
              <TableHead className="font-bold text-lg text-white py-4">{t("r2.shop.table.eshop")}</TableHead>
              <TableHead className="font-bold text-lg text-white w-[100px] text-end ">{t("r2.shop.table.where")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 無商店資料時 */}
            {storeList.length <= 0 && (
              <TableRow>
                <TableCell className="text-xl text-purple-300">Coming Soon...</TableCell>
                <TableCell className="text-end py-4">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 mr-8 cursor-pointer hover:opacity-80 duration-150"
                    aria-disabled
                  >
                    <img src="./images/r2/icon-shop.png" alt="icon-shop" className="w-12 aspect-[72/48]" />
                  </a>
                </TableCell>
              </TableRow>
            )}

            {/* 有商店資料時 */}
            {storeList.length > 0 && storeList.map(store => (
              <TableRow key={store.store}>
                <TableCell className="text-xl text-purple-300">{store.store}</TableCell>
                <TableCell className="text-end py-4">
                  <a
                    href={store.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 mr-8 cursor-pointer hover:opacity-80 duration-150"
                    onClick={() => handleClickLink(store.store)}
                  >
                    <img src="./images/r2/icon-shop.png" alt="icon-shop" className="w-12 aspect-[72/48]" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 得分對話窗 */}
      <ShopGetPointModal
        open={showShopGetPoint}
        setOpen={setShowShopGetPoint}
        parentNode={pageRef}
      />
    </motion.div>
  );
};

export default ShopPage;
