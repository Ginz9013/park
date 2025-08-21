import { useEffect, useState } from "react";
import { UserData } from "../types/auth";
import { authService } from "../services/authService";

export function AuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    // handleLogin("6337cf35655843e5a52bfceeb2a1d502");
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authService.checkAuthStatus();
      if (data.isValid && data.userData) {
        const loginCompain = await authService.login();
        // console.log("loginCompain", loginCompain);
        if (loginCompain.success) {
          setIsAuthenticated(true);

          setErrorMessage(null);

          const userMe = await authService.getUserMe();
          if (userMe.success) {
            setUserData(userMe.data);
            // console.log("userMe", userMe);
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        // console.log("未登入:", data.errorMessage);
        setIsAuthenticated(false);
        setUserData(null);
        setErrorMessage(data.errorMessage || "未登入或登入已過期");
      }
    } catch (error) {
      console.error("驗證過程發生錯誤:", error);
      setIsAuthenticated(false);
      setUserData(null);
      setErrorMessage("驗證過程發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-white/50">載入中...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      {isAuthenticated ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-green-400 font-medium">已登入</p>
          </div>
          {userData && (
            <div className="bg-gray-700 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>電子郵件</div>
                <div className="text-white">{userData.email}</div>

                <div>積分</div>
                <div className="text-white">{userData.points}</div>
                <div>最後登入時間</div>
                <div className="text-white">
                  {new Date(userData.lastLoginAt + "Z").toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <p className="text-red-400">未登入</p>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-300 ml-5">{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
