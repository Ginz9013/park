import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { shouldAutoShowPage, recordAutoShowPage } from "@/utils/loginSkip";

interface UseAutoShowOptions {
  pageKey: string; // 頁面唯一標識
  delay?: number; // 延遲時間（毫秒）
  onShow?: () => void; // 顯示時的回調函數
  expireDays?: number; // 失效天數（可選，預設7天）
}

/**
 * 通用的登入後自動顯示 Hook
 * @param options 配置選項
 * @returns 是否應該顯示
 */
export const useAutoShow = ({
  pageKey,
  delay = 2000,
  onShow,
  expireDays = 7,
}: UseAutoShowOptions) => {
  const { isAuthenticated } = useAuth();
  const hasTriggered = useRef(false);

  // 主要的自動顯示邏輯
  useEffect(() => {
    console.log(`[useAutoShow] ${pageKey} - isAuthenticated:`, isAuthenticated);
    console.log(
      `[useAutoShow] ${pageKey} - hasTriggered:`,
      hasTriggered.current
    );

    // 重置 hasTriggered 當登入狀態改變時
    if (isAuthenticated) {
      hasTriggered.current = false;
      console.log(`[useAutoShow] ${pageKey} - Reset hasTriggered`);
    }

    // 如果已經觸發過，不再重複觸發
    if (hasTriggered.current) {
      console.log(`[useAutoShow] ${pageKey} - Already triggered, skipping`);
      return;
    }

    // 檢查是否應該自動顯示
    const shouldShow = shouldAutoShowPage(pageKey, expireDays);
    console.log(`[useAutoShow] ${pageKey} - shouldShow:`, shouldShow);

    if (isAuthenticated && shouldShow) {
      hasTriggered.current = true;
      console.log(`[useAutoShow] ${pageKey} - Will show after ${delay}ms`);

      // 延遲顯示
      const timer = setTimeout(() => {
        console.log(`[useAutoShow] ${pageKey} - Executing onShow callback`);
        // 記錄已自動顯示
        recordAutoShowPage(pageKey, expireDays);

        // 執行顯示回調
        onShow?.();
      }, delay);

      return () => clearTimeout(timer);
    } else {
      console.log(
        `[useAutoShow] ${pageKey} - Not showing. isAuthenticated:`,
        isAuthenticated,
        "shouldShow:",
        shouldShow
      );
    }
  }, [isAuthenticated, pageKey, delay, onShow, expireDays]);

  // 添加調試日誌

  const shouldShow =
    isAuthenticated &&
    shouldAutoShowPage(pageKey, expireDays) &&
    !hasTriggered.current;

  return {
    shouldShow,
  };
};
