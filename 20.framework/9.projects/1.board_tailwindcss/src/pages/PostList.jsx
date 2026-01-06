import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listPosts } from "../api/boardApi.js";
import Pagination from "../components/Pagination.jsx";

export default function PostList() {
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["posts", { page, pageSize, q }],
    queryFn: () => listPosts({ page, pageSize, q }),
    placeholderData: keepPreviousData,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const summary = useMemo(() => {
    if (!q) return `총 ${total}개`;
    return `검색 "${q}" · ${total}개`;
  }, [q, total]);

  function onSearch(e) {
    e.preventDefault();
    setPage(1);
    setQ(qInput.trim());
  }

  if (isLoading) return <p className="text-slate-500">로딩 중...</p>;

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
        목록 로드 실패: {error?.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 상단 헤더 */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">게시판</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <span>{summary}</span>
            {isFetching && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                업데이트 중...
              </span>
            )}
          </div>
        </div>

        <Link
          to="/posts/new"
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                     bg-blue-600 text-white shadow-sm shadow-blue-200
                     hover:bg-blue-500 active:scale-[0.98]"
        >
          글쓰기
        </Link>
      </div>

      {/* 검색바 */}
      <form
        onSubmit={onSearch}
        className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200"
      >
        <input
          className="w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900
                     ring-1 ring-slate-200 placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="제목/작성자/본문 검색"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
        />
        <button
          type="submit"
          className="shrink-0 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold
                     bg-white text-slate-700 ring-1 ring-slate-200
                     hover:bg-slate-50 active:scale-[0.98]"
        >
          검색
        </button>
      </form>

      {/* 게시판 테이블 */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
          <div className="col-span-1">No</div>
          <div className="col-span-7">제목</div>
          <div className="col-span-2">작성자</div>
          <div className="col-span-2 text-right">작성일</div>
        </div>

        {/* 테이블 바디 */}
        {items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            게시글이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((p, idx) => {
              const no = total - ((page - 1) * pageSize + idx);
              return (
                <li key={p.id}>
                  {/* 데스크톱 행 */}
                  <div
                    className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 items-center
                               hover:bg-slate-50 transition"
                  >
                    <div className="col-span-1 text-sm text-slate-500 tabular-nums">
                      {no}
                    </div>

                    <div className="col-span-7 min-w-0">
                      <Link
                        to={`/posts/${p.id}`}
                        className="block font-semibold text-slate-900 hover:underline truncate"
                      >
                        {p.title}
                      </Link>
                      <div className="mt-0.5 text-sm text-slate-600 truncate">
                        {p.content}
                      </div>
                    </div>

                    <div className="col-span-2 text-sm text-slate-700 truncate">
                      {p.author}
                    </div>

                    <div className="col-span-2 text-right text-sm text-slate-500 tabular-nums">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* 모바일 카드형 (게시판스럽게 접힘) */}
                  <Link
                    to={`/posts/${p.id}`}
                    className="md:hidden block px-4 py-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {p.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {p.content}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {p.author} · {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 tabular-nums">#{no}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="pt-1">
        <Pagination page={data.page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
