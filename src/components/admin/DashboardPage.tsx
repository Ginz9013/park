import { useEffect, useState } from "react";
import { authService } from "../../services/authService";

export default function DashboardPage() {
  // 統一用一個 state 存所有統計資料
  const [stats, setStats] = useState<null | {
    totalArticles: number;
    uniqueAuthors: number;
    sectionCounts: Record<string, number>;
    totalMembers: number;
    totalLoginCount: number;
  }>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [pointRanking, setPointRanking] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [rankingError, setRankingError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingStats(true);
    setStatsError(null);
    authService
      .adminGetArticleCount()
      .then((res) => {
        if (res) {
          setStats(res);
        } else {
          setStatsError("查詢失敗");
        }
      })
      .catch(() => setStatsError("查詢失敗"))
      .finally(() => setLoadingStats(false));

    // 取得排行榜
    setLoadingRanking(true);
    setRankingError(null);
    authService
      .adminGetPointRankingTop10()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setPointRanking(res.data);
        } else {
          setRankingError("查詢失敗");
        }
      })
      .catch(() => setRankingError("查詢失敗"))
      .finally(() => setLoadingRanking(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">儀表板</h1>

      <div className="flex flex-wrap gap-6 mb-10">
        {/* 卡片區塊 */}
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">文章總數</div>
          {loadingStats ? (
            <div className="text-lg text-gray-400">載入中...</div>
          ) : statsError ? (
            <div className="text-red-500">{statsError}</div>
          ) : (
            <div className="text-4xl font-bold text-blue-700">
              {stats?.totalArticles ?? "-"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">作者總數</div>
          {loadingStats ? (
            <div className="text-lg text-gray-400">載入中...</div>
          ) : statsError ? (
            <div className="text-red-500">{statsError}</div>
          ) : (
            <div className="text-4xl font-bold text-blue-700">
              {stats?.uniqueAuthors ?? "-"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">會員總數</div>
          {loadingStats ? (
            <div className="text-lg text-gray-400">載入中...</div>
          ) : statsError ? (
            <div className="text-red-500">{statsError}</div>
          ) : (
            <div className="text-4xl font-bold text-blue-700">
              {stats?.totalMembers ?? "-"}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-[220px] bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">登入次數</div>
          {loadingStats ? (
            <div className="text-lg text-gray-400">載入中...</div>
          ) : statsError ? (
            <div className="text-red-500">{statsError}</div>
          ) : (
            <div className="text-4xl font-bold text-blue-700">
              {stats?.totalLoginCount ?? "-"}
            </div>
          )}
        </div>
      </div>
      {/* 各分類投稿數表格 */}
      <div className="bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">各分類投稿數</h2>
        {loadingStats ? (
          <div className="text-lg text-gray-400">載入中...</div>
        ) : statsError ? (
          <div className="text-red-500">{statsError}</div>
        ) : stats && stats.sectionCounts ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">分類</th>
                <th className="p-2 text-left">投稿數</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.sectionCounts).map(([section, count]) => (
                <tr key={section}>
                  <td className="p-2">{section}</td>
                  <td className="p-2">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500">無資料</div>
        )}
      </div>
      {/* 點數排行榜 top10 */}
      <div className="bg-white rounded-xl shadow p-8 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          點數排行榜 Top 10
        </h2>
        {loadingRanking ? (
          <div className="text-lg text-gray-400">載入中...</div>
        ) : rankingError ? (
          <div className="text-red-500">{rankingError}</div>
        ) : pointRanking.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">排名</th>
                <th className="p-2 text-left">帳號名稱</th>
                <th className="p-2 text-left">分數</th>
              </tr>
            </thead>
            <tbody>
              {pointRanking.map((item) => (
                <tr key={item.userId}>
                  <td className="p-2">{item.rank}</td>
                  <td className="p-2">
                    {item.firstName || item.asusLoginId || item.email}
                  </td>
                  <td className="p-2">{item.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500">無資料</div>
        )}
      </div>
    </div>
  );
}
