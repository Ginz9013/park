import React from "react";
import { useAutoShow } from "@/hooks/useAutoShow";

// 範例：如何在其他元件中使用 useAutoShow Hook

const ExampleUsage: React.FC = () => {
  // 使用自動顯示 Hook
  useAutoShow({
    pageKey: "welcome-dialog", // 頁面唯一標識
    delay: 3000, // 3秒後自動顯示
    onShow: () => {
      // 顯示歡迎對話框
      console.log("顯示歡迎對話框");
      // setShowWelcomeDialog(true);
    },
  });

  return (
    <div>
      <h2>使用範例</h2>
      <p>這個元件展示了如何使用 useAutoShow Hook</p>
    </div>
  );
};

// 另一個範例：輪盤頁面
// const WheelPageExample: React.FC = () => {
//   useAutoShow({
//     pageKey: "wheel-intro",
//     delay: 1500, // 1.5秒後自動顯示
//     onShow: () => {
//       // 顯示輪盤介紹
//       console.log("顯示輪盤介紹");
//       // setShowWheelIntro(true);
//     },
//   });

//   return (
//     <div>
//       <h2>輪盤頁面範例</h2>
//     </div>
//   );
// };

// 投票頁面範例
// const VotePageExample: React.FC = () => {
//   useAutoShow({
//     pageKey: "vote-tutorial",
//     delay: 1000, // 1秒後自動顯示
//     onShow: () => {
//       // 顯示投票教學
//       console.log("顯示投票教學");
//       // setShowVoteTutorial(true);
//     },
//   });

//   return (
//     <div>
//       <h2>投票頁面範例</h2>
//     </div>
//   );
// };

export default ExampleUsage;
