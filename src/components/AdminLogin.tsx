import { useState } from "react";
import { authService } from "../services/authService";

export default function AdminLogin({
  onLoginSuccess,
}: {
  onLoginSuccess?: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await authService.adminLogin(username, password);
      if (result && result.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(result?.message || "登入失敗");
      }
    } catch (err: any) {
      setError(err?.message || "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">管理員登入</h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">帳號</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700">密碼</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
}
