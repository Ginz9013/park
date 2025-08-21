import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import { authService } from "../services/authService";

const NAV_ITEMS = [
  { label: "儀表板", value: "dashboard" },
  { label: "用戶管理", value: "users" },
  { label: "資料管理", value: "data" },
  // 可依需求擴充
];

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(NAV_ITEMS[0].value);
  const [articleStats, setArticleStats] = useState<null | {
    totalArticles: number;
    uniqueAuthors: number;
  }>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn && selectedMenu === "dashboard") {
      setLoadingStats(true);
      setStatsError(null);
      authService
        .adminGetArticleCount()
        .then((res) => {
          if (res.success) {
            setArticleStats({
              totalArticles: res.totalArticles,
              uniqueAuthors: res.uniqueAuthors,
            });
          } else {
            setStatsError("查詢失敗");
          }
        })
        .catch(() => setStatsError("查詢失敗"))
        .finally(() => setLoadingStats(false));
    }
  }, [isLoggedIn, selectedMenu]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    // 可加上清除 token 或 session 的邏輯
  };

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-blue-800 text-white shadow flex items-center px-6 h-16">
        <div className="text-xl font-bold tracking-wide">後台管理系統</div>
        <div className="ml-8 flex gap-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.value}
              className={`px-3 py-1 rounded transition font-medium ${
                selectedMenu === item.value
                  ? "bg-blue-600"
                  : "hover:bg-blue-700"
              }`}
              onClick={() => setSelectedMenu(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            登出
          </button>
        </div>
      </nav>

      {/* 主要內容區塊 */}
      <div className="flex flex-col items-center justify-center pt-16">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center mt-8">
          <h1 className="text-2xl font-bold mb-4">
            {NAV_ITEMS.find((i) => i.value === selectedMenu)?.label}
          </h1>
          {selectedMenu === "dashboard" && (
            <div className="mb-8">
              {loadingStats ? (
                <div>載入中...</div>
              ) : statsError ? (
                <div className="text-red-500">{statsError}</div>
              ) : articleStats ? (
                <>
                  <div>
                    文章總數：
                    <span className="font-bold">
                      {articleStats.totalArticles}
                    </span>
                  </div>
                  <div>
                    作者總數：
                    <span className="font-bold">
                      {articleStats.uniqueAuthors}
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          )}
          <p className="mb-8">歡迎進入後台！您可以在這裡管理相關資料。</p>
        </div>
      </div>
    </div>
  );
}
