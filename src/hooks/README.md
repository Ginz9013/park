# useAutoShow Hook 使用說明

## 功能概述

`useAutoShow` Hook 提供了一個通用的解決方案，讓元件可以在用戶登入後自動顯示一次，之後就靠用戶手動觸發。

## 基本用法

```tsx
import { useAutoShow } from "@/hooks/useAutoShow";

const MyComponent: React.FC = () => {
  useAutoShow({
    pageKey: "my-page", // 頁面唯一標識
    delay: 2000, // 延遲時間（毫秒）
    onShow: () => {
      // 顯示邏輯
      setShowDialog(true);
    },
  });

  return <div>我的元件</div>;
};
```

## 參數說明

### `pageKey` (string, 必需)

頁面的唯一標識符，用於區分不同的自動顯示頁面。

### `delay` (number, 可選)

延遲顯示的時間，單位為毫秒。預設值為 2000ms。

### `onShow` (function, 可選)

當需要自動顯示時執行的回調函數。

## 使用範例

### 1. 基本用法

```tsx
const WelcomeDialog: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  useAutoShow({
    pageKey: "welcome",
    delay: 3000,
    onShow: () => setShowDialog(true),
  });

  return showDialog ? <Dialog /> : null;
};
```

### 2. 在頁面元件中使用

```tsx
const WheelPage: React.FC = () => {
  const [showIntro, setShowIntro] = useState(false);

  useAutoShow({
    pageKey: "wheel-intro",
    delay: 1500,
    onShow: () => setShowIntro(true),
  });

  return (
    <div>
      {showIntro && <IntroDialog />}
      {/* 其他內容 */}
    </div>
  );
};
```

### 3. 多個元件同時使用

```tsx
const MainPage: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // 歡迎對話框
  useAutoShow({
    pageKey: "welcome-dialog",
    delay: 2000,
    onShow: () => setShowWelcome(true),
  });

  // 教學對話框
  useAutoShow({
    pageKey: "tutorial-dialog",
    delay: 5000,
    onShow: () => setShowTutorial(true),
  });

  return (
    <div>
      {showWelcome && <WelcomeDialog />}
      {showTutorial && <TutorialDialog />}
    </div>
  );
};
```

## 測試和調試

### 重置自動顯示記錄

```javascript
import { resetAutoShowRecord } from "@/utils/loginSkip";

// 在瀏覽器控制台執行
resetAutoShowRecord();
```

### 查看當前記錄狀態

```javascript
import { getAutoShowRecord } from "@/utils/loginSkip";

// 在瀏覽器控制台執行
console.log(getAutoShowRecord());
```

### 檢查特定頁面是否已顯示

```javascript
import { hasPageBeenShown } from "@/utils/loginSkip";

// 在瀏覽器控制台執行
console.log(hasPageBeenShown("ticket")); // true/false
```

## 注意事項

1. **唯一性**：每個 `pageKey` 只會自動顯示一次
2. **登入狀態**：只有在用戶已登入時才會觸發自動顯示
3. **延遲執行**：使用 `setTimeout` 確保頁面載入完成後再顯示
4. **記憶體管理**：Hook 會自動清理 timer，避免記憶體洩漏

## 向後兼容

原有的 `shouldAutoShowTicketPage()` 和 `recordAutoShowTicketPage()` 函數仍然可用，但建議使用新的 API。
