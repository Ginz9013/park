import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "儀表板", path: "/admin" },
  { label: "文章管理", path: "/admin/articles" },
  { label: "點數排行榜", path: "/admin/leaderboard" },
];

export default function AdminNavbar({ onLogout }: { onLogout?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="w-full bg-blue-800 text-white shadow flex items-center px-6 h-16  absolute top-0 left-0 z-50">
      <div className="text-xl font-bold tracking-wide">樂園管理員頁面</div>
      <div className="ml-8 flex gap-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            className={`px-3 py-1 rounded transition font-medium ${
              location.pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-blue-700"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="ml-auto">
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          登出
        </button>
      </div>
    </nav>
  );
}
