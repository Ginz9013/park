import { useEffect, useState } from "react";
import { authService } from "../../services/authService";

interface LeaderboardItem {
  rank: number;
  userId: number;
  asusLoginId: string;
  email: string;
  firstName: string;
  lastName: string;
  points: number;
}

export default function PointLeaderboardPage() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    authService
      .adminGetPointLeaderboard({ page, pageSize })
      .then((res) => {
        if (res.success) {
          setData(res.data || []);
          setTotal(res.pagination?.total || res.totalCount || 0);
          setTotalPages(
            res.pagination?.totalPages ||
              Math.ceil((res.totalCount || 0) / pageSize) ||
              1
          );
        } else {
          setError("查詢失敗");
        }
      })
      .catch(() => setError("查詢失敗"))
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">點數排行榜</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">共 {total} 筆</div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50 cursor-pointer"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一頁
          </button>
          <span>
            {page} / {totalPages || 1}
          </span>
          <button
            className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50 cursor-pointer"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            下一頁
          </button>
        </div>
      </div>
      {loading ? (
        <div>載入中...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full mb-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">排名</th>
                <th className="p-2 text-left">姓名/帳號</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">分數</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    無資料
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.userId}>
                    <td className="p-2">{item.rank}</td>
                    <td className="p-2">
                      {item.firstName || item.asusLoginId || item.email}
                    </td>
                    <td className="p-2">{item.email}</td>
                    <td className="p-2">{item.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
