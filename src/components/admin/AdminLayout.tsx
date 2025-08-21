import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLogin from "../AdminLogin";
import { authService } from "../../services/authService";

export default function AdminLayout() {
  // 初始化時從 localStorage 讀取登入狀態
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("admin_logged_in") === "1";
  });
  const [checking, setChecking] = useState(true);

  // 每次進入頁面時，檢查後端 Cookie 是否有效
  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") === "1") {
      setChecking(true);
      authService
        .adminGetPointRankingTop10()
        .then((res) => {
          if (!res.success) {
            setIsLoggedIn(false);
            localStorage.removeItem("admin_logged_in");
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
          localStorage.removeItem("admin_logged_in");
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("admin_logged_in", "1");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
    // 可加上清除 session/cookie
  };

  if (checking) {
    return (
      <div className="p-8 text-center text-gray-500">驗證登入狀態中...</div>
    );
  }

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onLogout={handleLogout} />
      <div className="pt-20 px-4">
        <Outlet />
      </div>
    </div>
  );
}
