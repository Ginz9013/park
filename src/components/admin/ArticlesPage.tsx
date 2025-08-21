import { useEffect, useState } from "react";
import { authService } from "../../services/authService";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SECTION_OPTIONS = [
  { label: "全部分類", value: "" },
  { label: "FavoriteMoment", value: "FavoriteMoment" },
  { label: "HugeASUSFans", value: "HugeASUSFans" },
  { label: "SpecialFeatures", value: "SpecialFeatures" },
  { label: "TheGamer", value: "TheGamer" },
  { label: "TouchingMoment", value: "TouchingMoment" },
];

interface Article {
  articleId: number;
  title: string;
  content: string;
  section: string;
  gpu: string;
  name: string; // 作者
  email: string;
  ytlink: string;
  postlink: string;
  isActive: boolean;
  userId: number;
  imageId: number;
  createdAt: string;
  updatedAt: string;
  image?: { id: number; url: string };
  voteCount: number;
  userVote: number;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [section, setSection] = useState("");
  const [ytlinkOnly, setYtlinkOnly] = useState(false);
  const [postlinkOnly, setPostlinkOnly] = useState(false);
  const [bothLinkOnly, setBothLinkOnly] = useState(false);

  const [inputValue, setInputValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    // 組合查詢參數
    const params: any = { page: page, pageSize: pageSize, isActive: true };
    if (section) params.section = section;
    if (searchTerm) params.searchTerm = searchTerm;
    if (bothLinkOnly) {
      params.bothLinkOnly = true;
    } else {
      if (ytlinkOnly) params.ytlinkOnly = true;
      if (postlinkOnly) params.postlinkOnly = true;
    }

    authService
      .adminGetArticles(params)
      .then((res) => {
        if (res.success) {
          const data = res.data.map((item: any) => {
            if (item.image?.url) {
              if (item.image.url.startsWith("/uploads/")) {
                const fileName = item.image.url.split("/").pop();
                if (fileName) {
                  item.image.url = `https://www.asus.com/event/ASUSVGA30years/Image_Upload/Image_Upload/${fileName}`;
                }
              } else if (item.image.url.includes("///")) {
                const fileName = item.image.url.split("/").pop();
                if (fileName) {
                  item.image.url = `https://www.asus.com/event/ASUSVGA30years/Image_Upload/Image_Upload/${fileName}`;
                }
              } else if (item.image.url.startsWith("/StoragePath/")) {
                const fileName = item.image.url.split("/").pop();
                if (fileName) {
                  item.image.url = `https://www.asus.com/event/ASUSVGA30years/Image_Upload/Image_Upload/${fileName}`;
                }
              }
            }
            return item;
          });
          setArticles(data || []);
          setTotal(res.pagination.total || 0);
          setTotalPages(res.pagination.totalPages || 0);
        } else {
          setError("查詢失敗");
        }
      })
      .catch(() => setError("查詢失敗"))
      .finally(() => setLoading(false));
  }, [page, pageSize, section, ytlinkOnly, postlinkOnly, bothLinkOnly, searchTerm]);

  // 新增切換文章啟用狀態的函式
  const handleToggleActive = async (
    articleId: number,
    newIsActive: boolean
  ) => {
    try {
      const res = await authService.adminToggleArticleActive(
        articleId,
        newIsActive
      );
      if (res.success) {
        setArticles((prev) =>
          prev.map((a) =>
            a.articleId === articleId ? { ...a, isActive: newIsActive } : a
          )
        );
      } else {
        alert("狀態切換失敗：" + (res.message || ""));
      }
    } catch (e) {
      alert("狀態切換失敗，請稍後再試");
    }
  };

  const handleDeleteArticle = async (articleId: number) => {
    const ok = window.confirm("確定要刪除這篇文章嗎？此操作無法復原！");
    if (!ok) return;
    try {
      const res = await authService.adminDeleteArticle(articleId);
      if (res.success) {
        setArticles((prev) => prev.filter((a) => a.articleId !== articleId));
      } else {
        alert("刪除失敗：" + (res.message || ""));
      }
    } catch (e) {
      alert("刪除失敗，請稍後再試");
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-5xl  mx-auto mt-8">
      <h1 className="text-2xl font-bold ">
        文章管理 <span className="text-gray-500 text-sm"> (共 {total} 筆)</span>
      </h1>
      {/* 查詢條件選單（美化版） */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm mt-4">
        <div className="font-semibold text-gray-700 mb-2">查詢條件</div>
        {/* 搜尋框 */}
        <div className="flex gap-4 mb-4">
          <Input className="w-72" onChange={(e) => setInputValue(e.target.value)} />
          <Button
            className="bg-blue-800 hover:bg-blue-900 w-24 cursor-pointer"
            onClick={() => setSearchTerm(inputValue)}
          >搜尋</Button>
        </div>
        {/* 分類選項 */}
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className="text-gray-600 mr-2">分類：</label>
            <select
              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={section}
              onChange={(e) => {
                setPage(1);
                setSection(e.target.value);
              }}
            >
              {SECTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-1 font-medium text-blue-700">
              <input
                type="checkbox"
                checked={ytlinkOnly}
                disabled={bothLinkOnly}
                onChange={(e) => {
                  setPage(1);
                  setYtlinkOnly(e.target.checked);
                }}
              />
              只顯示有 YouTube 連結
            </label>
            <label className="flex items-center gap-1 font-medium text-green-700">
              <input
                type="checkbox"
                checked={postlinkOnly}
                disabled={bothLinkOnly}
                onChange={(e) => {
                  setPage(1);
                  setPostlinkOnly(e.target.checked);
                }}
              />
              只顯示有分享社群連結
            </label>
            <label className="flex items-center gap-1 font-medium text-purple-700">
              <input
                type="checkbox"
                checked={bothLinkOnly}
                onChange={(e) => {
                  setPage(1);
                  setBothLinkOnly(e.target.checked);
                  if (e.target.checked) {
                    setYtlinkOnly(false);
                    setPostlinkOnly(false);
                  }
                }}
              />
              兩者皆有內容
            </label>
          </div>
        </div>
      </div>
      {/* 分頁器 */}
      <div className="flex justify-end items-center gap-2 mb-4">
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
      {loading ? (
        <div>載入中...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="rounded-md border">
          <Table className="mb-4  ">
            <TableHeader className="bg-gray-200 ">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>標題</TableHead>
                <TableHead>作者</TableHead>
                <TableHead>建立時間</TableHead>
                <TableHead>得票數</TableHead>
                <TableHead>操作</TableHead>

                {/* 其他欄位可依需求增加 */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>無資料</TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <>
                    <TableRow
                      key={article.articleId}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleExpand(article.articleId)}
                    >
                      <TableCell>{article.articleId}</TableCell>
                      <TableCell>
                        <div className="w-[150px ] aspect-video bg-gray-500 rounded-md">
                          <img
                            src={article.image?.url}
                            alt="article image"
                            className="w-full  contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="w-[40%]">
                        <div className="flex items-center gap-2">
                          {expandedIds.includes(article.articleId) ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                          <div className="w-[180px]  truncate ">
                            <div className=" flex items-center gap-2 ">
                              {" "}
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {article.section}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{article.name}</TableCell>
                      <TableCell>
                        {new Date(article.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{article.voteCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 justify-center">
                          <Switch
                            checked={article.isActive}
                            onCheckedChange={(checked) =>
                              handleToggleActive(article.articleId, checked)
                            }
                            aria-label={article.isActive ? "啟用" : "停用"}
                          />
                          <span className="ml-1 text-sm">
                            {article.isActive ? "顯示" : "隱藏"}
                          </span>
                          |
                          <button
                            className="text-zinc-500  hover:text-red-500 cursor-pointer flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteArticle(article.articleId);
                            }}
                          >
                            <Trash2 size={20} /> 刪除文章
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedIds.includes(article.articleId) && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <div className="p-4 bg-gray-50 rounded text-left flex  gap-2">
                            <div className="w-[55%]">
                              <div className=" ">
                                {" "}
                                <b>標題：</b>
                                {article.title}
                              </div>
                              <div>
                                <b>顯示卡型號：</b>
                                {article.gpu ? article.gpu : "無"}
                              </div>
                              <div className="whitespace-pre-wrap">
                                <b>文字內容：</b>

                                <div className="whitespace-pre-wrap">
                                  {article.content ? article.content : "無"}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>
                                <b>Email：</b>
                                {article.email ? article.email : "無"}
                              </div>

                              <div>
                                <b>影片連結：</b>
                                {article.ytlink
                                  ? <a className="text-blue-500 underline" href={article.ytlink}>article.ytlink</a>
                                  : "無"}
                              </div>
                              <div>
                                <b>分享社群：</b>
                                {article.postlink.length > 0
                                  ? <a className="text-blue-500 underline" href={article.postlink}>article.postlink</a> 
                                  : "無"}
                              </div>
                              <div>
                                <b>最後更新：</b>
                                {new Date(article.updatedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
          {/* 分頁器 */}
        </div>
      )}
      <div className="flex justify-end items-center gap-2 mt-4">
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
  );
}
